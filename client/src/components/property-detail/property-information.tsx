import { Property } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, GraduationCap, ShoppingCart, Utensils, PalmtreeIcon, Car } from "lucide-react";
import { BedDouble, Bath, LandPlot } from "lucide-react";

interface PropertyInformationProps {
  property: Property;
}

export default function PropertyInformation({ property }: PropertyInformationProps) {
  const features = property.features || [];

  return (
    <>
      {/* Property Highlights */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center bg-slate-50 p-3 rounded-lg">
              <BedDouble className="text-primary text-xl mb-1" />
              <span className="font-semibold">{property.beds} Beds</span>
            </div>
            <div className="flex flex-col items-center bg-slate-50 p-3 rounded-lg">
              <Bath className="text-primary text-xl mb-1" />
              <span className="font-semibold">{property.baths} Baths</span>
            </div>
            <div className="flex flex-col items-center bg-slate-50 p-3 rounded-lg">
              <LandPlot className="text-primary text-xl mb-1" />
              <span className="font-semibold">{property.squareFeet.toLocaleString()} sqft</span>
            </div>
            <div className="flex flex-col items-center bg-slate-50 p-3 rounded-lg">
              <Car className="text-primary text-xl mb-1" />
              <span className="font-semibold">{property.garageSpaces} Garage</span>
            </div>
          </div>
          
          {/* Description moved to a different location */}
          
          {features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-800 mb-2">Property Features</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="text-green-500 text-sm" />
                    <span className="text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-100 rounded-lg h-64 mb-4 flex items-center justify-center">
            {/* Map placeholder */}
            <div className="text-center text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p>Interactive map would be displayed here</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-slate-800 mb-2">Nearby Amenities</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center space-x-2">
                <GraduationCap className="text-slate-500 text-sm" />
                <span className="text-slate-600">Schools (0.8 mi)</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="text-slate-500 text-sm" />
                <span className="text-slate-600">Shopping (1.2 mi)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Utensils className="text-slate-500 text-sm" />
                <span className="text-slate-600">Restaurants (0.5 mi)</span>
              </div>
              <div className="flex items-center space-x-2">
                <PalmtreeIcon className="text-slate-500 text-sm" />
                <span className="text-slate-600">Parks (0.3 mi)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
