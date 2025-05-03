import { Property } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Star, 
  Clock, 
  BedDouble, 
  Bath, 
  LandPlot,
} from "lucide-react";

interface PropertyCardProps {
  property: Property & { topBid: number | null };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Calculate days remaining until end date
  const endDate = new Date(property.endDate);
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') {
      price = parseFloat(price);
    }
    return price.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    });
  };

  const getTagBadge = () => {
    if (property.isNewListing) {
      return <Badge className="bg-secondary text-white">New Listing</Badge>;
    } else if (property.isHotProperty) {
      return <Badge className="bg-accent text-white">Hot Property</Badge>;
    } else if (property.isFeatured) {
      return <Badge className="bg-yellow-500 text-white">Featured</Badge>;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative">
          <img 
            className="h-48 w-full object-cover" 
            src={property.featuredImage} 
            alt={property.title} 
          />
          <div className="absolute top-0 left-0 m-4">
            {getTagBadge()}
          </div>
          <div className="absolute bottom-0 right-0 m-4">
            <span className="bg-slate-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
              {property.images.length} Photos
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">{property.title}</h3>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs font-medium">4.8</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-2">{property.address}, {property.city}, {property.state}</p>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-primary font-semibold text-lg">{formatPrice(property.askingPrice)}</span>
              <span className="text-slate-500 text-xs block">Asking Price</span>
            </div>
            <div className="text-right">
              {property.topBid ? (
                <>
                  <span className="text-accent font-semibold">{formatPrice(property.topBid)}</span>
                  <span className="block text-slate-500 text-xs">Current Top Bid</span>
                </>
              ) : (
                <span className="block text-slate-500 text-xs">No bids yet</span>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <div className="flex items-center">
              <BedDouble className="h-3 w-3 mr-1" /> {property.beds} Beds
            </div>
            <div className="flex items-center">
              <Bath className="h-3 w-3 mr-1" /> {property.baths} Baths
            </div>
            <div className="flex items-center">
              <LandPlot className="h-3 w-3 mr-1" /> {property.squareFeet.toLocaleString()} sqft
            </div>
          </div>
        </div>
      </Link>
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          <Clock className="h-3 w-3 inline mr-1" /> {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
        </div>
        <div>
          <Button 
            size="sm" 
            className="bg-primary text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
            asChild
          >
            <Link href={`/property/${property.id}`}>Place Bid</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
