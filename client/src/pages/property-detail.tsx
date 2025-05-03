import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import PropertyGallery from "@/components/property-detail/property-gallery";
import PropertyInformation from "@/components/property-detail/property-information";
import BidForm from "@/components/property-detail/bid-form";
import VisitForm from "@/components/property-detail/visit-form";
import { Separator } from "@/components/ui/separator";
import { Property } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { HomeIcon, Heart, Share2Icon, PrinterIcon, ChevronRight } from "lucide-react";

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:id");
  const propertyId = params?.id;

  const { data: property, isLoading, error } = useQuery<Property & { topBid: number | null }>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          <p>Error loading property: {error?.message || "Property not found"}</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get property features array
  const features = property.features || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex text-sm text-slate-500">
          <Link href="/" className="hover:text-primary flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/" className="hover:text-primary">
            Properties
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-slate-700 font-medium">{property.title}</span>
        </nav>
      </div>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{property.title}</h1>
            <p className="text-slate-500 mt-1">{property.address}, {property.city}, {property.state}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" className="flex items-center space-x-1 text-slate-500 hover:text-primary">
              <Heart className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-1 text-slate-500 hover:text-primary">
              <Share2Icon className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-1 text-slate-500 hover:text-primary">
              <PrinterIcon className="h-4 w-4" />
              <span>Print</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {features.slice(0, 4).map((feature, index) => (
            <Badge key={index} variant="outline" className="bg-slate-100 text-slate-700 py-1">{feature}</Badge>
          ))}
        </div>
      </div>

      {/* Property Gallery */}
      <PropertyGallery images={property.images} />

      {/* Property Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <PropertyInformation property={property} />
        </div>

        {/* Sidebar */}
        <div>
          {/* Price and Bidding Info */}
          <BidForm property={property} />
          
          <Separator className="my-6" />
          
          {/* Schedule Visit */}
          <VisitForm propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}
