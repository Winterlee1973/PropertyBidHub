import { useQuery } from "@tanstack/react-query";
import PropertyCard from "@/components/property-card";
import { Loader2, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Property } from "@shared/schema";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [location] = useLocation();
  const [sortBy, setSortBy] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8;
  
  // Parse URL search parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split("?")[1] || "");
    const locationParam = searchParams.get("location");
    const searchParam = searchParams.get("search");
    
    if (locationParam) {
      setSelectedLocation(locationParam);
      setSearchTerm(locationParam);
    } else if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location]);

  const { data: properties, isLoading, error } = useQuery<(Property & { topBid: number | null })[]>({
    queryKey: ["/api/properties"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          <p>Error loading properties: {error.message}</p>
        </div>
      </div>
    );
  }

  // Filter properties based on search term
  const filteredProperties = properties?.filter(property => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearchTerm =
      property.title.toLowerCase().includes(lowerSearchTerm) ||
      property.address.toLowerCase().includes(lowerSearchTerm) ||
      property.city.toLowerCase().includes(lowerSearchTerm) ||
      property.state.toLowerCase().includes(lowerSearchTerm);

    // Include the specific mock property if search term is "Locust Valley, NY" or "11560"
    const isSpecificLocustValleySearch =
      (lowerSearchTerm === "locust valley, ny" || lowerSearchTerm === "11560") &&
      property.address === "687 Duck Pond Road" &&
      property.city === "Locust Valley" &&
      property.state === "NY";

    return matchesSearchTerm || isSpecificLocustValleySearch;
  }) || [];

  // Add the specific mock property if the search term is "Locust Valley, NY" or "11560"
  const lowerSearchTerm = searchTerm.toLowerCase();
  const shouldAddMockProperty =
    (lowerSearchTerm === "locust valley, ny" || lowerSearchTerm === "11560") &&
    !filteredProperties.some(p => p.address === "687 Duck Pond Road" && p.city === "Locust Valley" && p.state === "NY");

  if (shouldAddMockProperty) {
    const mockProperty = {
      id: 999, // Use a unique ID not likely to conflict
      title: "Luxury Estate",
      address: "687 Duck Pond Road",
      city: "Locust Valley",
      state: "NY",
      description: "A stunning luxury estate.",
      askingPrice: "0.00", // Placeholder
      beds: 0, // Placeholder
      baths: "0", // Placeholder
      squareFeet: 0, // Placeholder
      garageSpaces: 0, // Placeholder
      featuredImage: "/attached_assets/Screenshot_20250505-172952.png", // Provided image
      images: ["/attached_assets/Screenshot_20250505-172952.png"], // Provided image
      features: [], // Placeholder
      isFeatured: false, // Placeholder
      isNewListing: false, // Placeholder
      isHotProperty: false, // Placeholder
      viewCount: 0, // Placeholder
      endDate: new Date(), // Placeholder
      createdAt: new Date(), // Placeholder
      topBid: null, // Placeholder
    };
    filteredProperties.push(mockProperty);
  }

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "priceAsc":
        return Number(a.askingPrice) - Number(b.askingPrice);
      case "priceDesc":
        return Number(b.askingPrice) - Number(a.askingPrice);
      case "mostBids":
        // This would require additional api but we can leave as placeholder
        return 0;
      default: // latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Paginate properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title and filters */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Available Properties</h1>
        
        {selectedLocation && (
          <div className="mb-4 flex items-center">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 border-primary text-primary">
              <MapPin className="h-3.5 w-3.5" />
              <span>{selectedLocation}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 ml-1" 
                onClick={() => {
                  setSelectedLocation(null);
                  setSearchTerm("");
                }}
              >
                &times;
              </Button>
            </Badge>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white border border-slate-300 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest listings</SelectItem>
                <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                <SelectItem value="mostBids">Most bids</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search properties..."
              className="w-full md:w-80 pl-10 pr-4 py-2 border border-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500">Filter:</span>
            <Button variant="outline" className="border border-slate-300 text-sm flex items-center space-x-1">
              <i className="fas fa-filter text-slate-400"></i>
              <span>Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Property grid */}
      {currentProperties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">No properties match your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }} 
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
