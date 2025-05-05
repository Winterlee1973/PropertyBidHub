import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Home,
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Send 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Home className="text-white text-xl" />
              <h3 className="text-lg font-bold">PropertyBid</h3>
            </div>
            <p className="text-slate-300 mb-2 text-sm">
              The premier platform for real estate bidding.
            </p>
            <div className="flex space-x-3 mb-2">
              <a href="#" className="text-slate-300 hover:text-white">
                <Facebook size={16} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Twitter size={16} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Instagram size={16} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/" className="text-slate-300 hover:text-white">Home</Link></li>
              <li><Link href="/" className="text-slate-300 hover:text-white">Properties</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-white">How It Works</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">About</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">Resources</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="text-slate-300 hover:text-white">Bidding Guide</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Insights</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Trends</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">Subscribe</h4>
            <p className="text-slate-300 mb-2 text-sm">
              Latest property listings
            </p>
            <form className="mb-1">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="h-8 px-2 py-1 text-sm bg-slate-700 text-white rounded-l-md border-none focus-visible:ring-primary"
                />
                <Button type="submit" size="sm" className="h-8 px-2 bg-primary rounded-l-none hover:bg-blue-700">
                  <Send size={12} />
                </Button>
              </div>
            </form>
            <p className="text-slate-400 text-xs">
              We won't share your email
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-4 pt-4 flex flex-col md:flex-row justify-between">
          <p className="text-slate-400 text-xs">© 2025 PropertyBid. All rights reserved.</p>
          <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
            <a href="#" className="text-slate-400 text-xs hover:text-white">Privacy</a>
            <a href="#" className="text-slate-400 text-xs hover:text-white">Terms</a>
            <a href="#" className="text-slate-400 text-xs hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
