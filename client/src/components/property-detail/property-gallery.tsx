import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Take the first 5 images for the main gallery (or fewer if there are less than 5)
  const displayImages = images.slice(0, Math.min(5, images.length));
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[500px]">
        {displayImages.map((image, index) => {
          // First image takes up 2 columns and 2 rows
          const isMainImage = index === 0;
          // Last image shows 'View all' button if there are more than 5 images
          const isLastDisplayed = index === displayImages.length - 1 && images.length > 5;
          
          return (
            <div
              key={index}
              className={`relative ${
                isMainImage ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={image}
                alt={`Property view ${index + 1}`}
                className="h-full w-full object-cover rounded-lg"
              />
              
              {isLastDisplayed && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-medium rounded-lg">
                      <span>View all {images.length} photos</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0">
                    <div className="relative h-[80vh]">
                      <img
                        src={images[currentImageIndex]}
                        alt={`Property view ${currentImageIndex + 1}`}
                        className="h-full w-full object-contain"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full"
                        onClick={handlePrev}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full"
                        onClick={handleNext}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
