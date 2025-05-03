import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search, Home, Building, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for locations - in a real app, this would come from an API
const LOCATIONS = [
  { id: 1, name: "Huntington", state: "New York", zip: "11743" },
  { id: 2, name: "Huntsville", state: "Alabama", zip: "35801" },
  { id: 3, name: "Huntington Beach", state: "California", zip: "92648" },
  { id: 4, name: "Huntingdon Valley", state: "Pennsylvania", zip: "19006" },
  { id: 5, name: "Huntley", state: "Illinois", zip: "60142" },
];

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);
  const [, setLocation] = useLocation();

  // Filter locations based on search term
  const filteredLocations = LOCATIONS.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.zip.includes(searchTerm)
  );

  // Close the popover if there's no search term
  useEffect(() => {
    if (searchTerm.length < 3) {
      setSelectedLocation(null);
    }
  }, [searchTerm]);

  // Handle search submission
  const handleSearch = () => {
    if (selectedLocation) {
      // Navigate to properties page with the selected location as a query parameter
      setLocation(`/properties?location=${selectedLocation.name},${selectedLocation.state}`);
    } else if (searchTerm.length >= 3 && filteredLocations.length > 0) {
      // If no location is selected but there are filtered results, use the first one
      setLocation(`/properties?location=${filteredLocations[0].name},${filteredLocations[0].state}`);
    } else if (searchTerm.length >= 3) {
      // If no results, just search with the term as is
      setLocation(`/properties?search=${searchTerm}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 flex content-center items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-6/12 px-4 text-center">
              <h1 className="text-5xl font-bold text-primary mb-6">
                Find Your Dream Property
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Discover premium real estate properties and place bids in our transparent auction platform.
              </p>
              
              {/* Search Box */}
              <div className="relative flex w-full max-w-xl mx-auto">
                <Popover open={open && searchTerm.length >= 3} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <div className="flex flex-grow rounded-md relative">
                      <Input
                        type="text"
                        placeholder="Enter city, town or ZIP code"
                        className="w-full h-12 pl-10 pr-4 rounded-l-md text-gray-800 border-gray-300 focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandEmpty>No locations found.</CommandEmpty>
                      <CommandGroup>
                        {filteredLocations.map((location) => (
                          <CommandItem
                            key={location.id}
                            onSelect={() => {
                              setSelectedLocation(location);
                              setSearchTerm(`${location.name}, ${location.state}`);
                              setOpen(false);
                            }}
                            className="flex items-center"
                          >
                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                            <span>{location.name}, {location.state} {location.zip}</span>
                            {selectedLocation?.id === location.id && (
                              <Check className="ml-auto h-4 w-4 text-primary" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button 
                  className="h-12 px-6 rounded-r-md bg-primary hover:bg-primary-600"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">Why Choose PropertyBid?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Our platform offers a seamless experience for finding and bidding on your next property.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-4/12 px-4 text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary mb-6">
              <Home className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Listings</h3>
            <p className="text-gray-600 mb-4">
              Browse through our exclusive collection of high-quality properties in the best locations.
            </p>
          </div>
          
          <div className="w-full md:w-4/12 px-4 text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary mb-6">
              <Building className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Transparent Bidding</h3>
            <p className="text-gray-600 mb-4">
              Participate in a fair and transparent bidding process with real-time updates.
            </p>
          </div>
          
          <div className="w-full md:w-4/12 px-4 text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary mb-6">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Scheduling</h3>
            <p className="text-gray-600 mb-4">
              Schedule property visits with just a few clicks to see your potential new home.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-3xl font-bold text-white">
                Ready to find your dream property?
              </h2>
              <p className="mt-4 text-lg text-white opacity-80">
                Start your search today and join thousands of satisfied customers.
              </p>
            </div>
            <div className="w-full lg:w-6/12 px-4 mt-8 lg:mt-0 text-center lg:text-right">
              <Button 
                className="px-8 py-3 bg-white text-primary hover:bg-gray-100"
                onClick={() => setLocation("/properties")}
              >
                Browse All Properties
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}