import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, Home, UserRound, ChevronDown, LogOut, Search, MapPin, Check } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

// Mock data for locations - in a real app, this would come from an API
const LOCATIONS = [
  { id: 1, name: "Huntington", state: "New York", zip: "11743" },
  { id: 2, name: "Huntsville", state: "Alabama", zip: "35801" },
  { id: 3, name: "Huntington Beach", state: "California", zip: "92648" },
  { id: 4, name: "Huntingdon Valley", state: "Pennsylvania", zip: "19006" },
  { id: 5, name: "Huntley", state: "Illinois", zip: "60142" },
];

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);
  const [, setLocation] = useLocation();
  
  // Parse URL search parameters to get existing location
  useEffect(() => {
    const url = window.location.href;
    const searchParams = new URLSearchParams(url.split("?")[1] || "");
    const locationParam = searchParams.get("location");
    
    if (locationParam) {
      setSearchTerm(locationParam);
    }
  }, []);
  
  // Filter locations based on search term
  const filteredLocations = LOCATIONS.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.zip.includes(searchTerm)
  );
  
  // Handle search submission
  const handleSearch = () => {
    if (selectedLocation) {
      // Navigate to properties page with the selected location as a query parameter
      setLocation(`/properties?location=${selectedLocation.name},${selectedLocation.state}`);
      setOpenSearch(false);
    } else if (searchTerm.length >= 3 && filteredLocations.length > 0) {
      // If no location is selected but there are filtered results, use the first one
      setLocation(`/properties?location=${filteredLocations[0].name},${filteredLocations[0].state}`);
      setOpenSearch(false);
    } else if (searchTerm.length >= 3) {
      // If no results, just search with the term as is
      setLocation(`/properties?search=${searchTerm}`);
      setOpenSearch(false);
    }
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "How It Works", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center py-4">
          <div className="flex items-center mr-4">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="text-primary text-2xl" />
              <h1 className="text-2xl font-bold text-slate-800">PropertyBid</h1>
            </Link>
          </div>
          
          {/* Location search bar - show on properties page */}
          {window.location.pathname.includes('/properties') && (
            <div className="flex-grow max-w-md hidden md:flex my-2">
              <Popover open={openSearch && searchTerm.length >= 3} onOpenChange={setOpenSearch}>
                <PopoverTrigger asChild>
                  <div className="flex flex-grow rounded-md relative">
                    <Input
                      type="text"
                      placeholder="Search location..."
                      className="w-full h-9 pl-8 pr-4 rounded-md text-gray-800 border-gray-300 focus:border-primary"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={16} />
                    </span>
                    {searchTerm && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 h-6 w-6 p-0 transform -translate-y-1/2"
                        onClick={() => setSearchTerm("")}
                      >
                        &times;
                      </Button>
                    )}
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
                            setOpenSearch(false);
                            handleSearch();
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
            </div>
          )}
          
          <div className="hidden lg:flex items-center space-x-4 ml-auto mr-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-slate-600 hover:text-primary whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center ml-auto lg:ml-0 space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-slate-700">
                    <UserRound className="h-5 w-5" />
                    <span className="hidden md:inline">{user.firstName} {user.lastName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>My Profile</DropdownMenuItem>
                  <DropdownMenuItem>My Bids</DropdownMenuItem>
                  <DropdownMenuItem>Scheduled Visits</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-primary">
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary">
                  <Link href="/auth">Register</Link>
                </Button>
              </>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-slate-600"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      className="text-slate-600 py-2 hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
