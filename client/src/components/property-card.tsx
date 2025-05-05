import { Property } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { 
  Eye, 
  Heart, 
  BedDouble, 
  Bath, 
  LandPlot,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: Property & { 
    topBid: number | null;
    isFavorite?: boolean;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);
  
  const addToFavoritesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/properties/${property.id}/favorite`);
      return await res.json();
    },
    onSuccess: () => {
      setIsFavorite(true);
      toast({
        title: "Success",
        description: "Property added to favorites",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/properties/${property.id}/favorite`);
      return await res.json();
    },
    onSuccess: () => {
      setIsFavorite(false);
      toast({
        title: "Success",
        description: "Property removed from favorites",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      removeFromFavoritesMutation.mutate();
    } else {
      addToFavoritesMutation.mutate();
    }
  };
  
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
            <div className="flex items-center space-x-1 text-slate-500">
              <Eye className="h-3 w-3" />
              <span className="text-xs font-medium">{property.viewCount || 0} views</span>
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
        <div>
          <button 
            onClick={toggleFavorite}
            className={`flex items-center text-xs ${isFavorite ? 'text-red-500' : 'text-slate-400'} hover:text-red-500 transition-colors`}
          >
            <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
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
