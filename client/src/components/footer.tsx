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
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="text-white text-2xl" />
              <h3 className="text-xl font-bold">PropertyBid</h3>
            </div>
            <p className="text-slate-300 mb-4">
              The premier platform for real estate bidding. 
              Find your dream property and make competitive offers with ease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-300 hover:text-white">Home</Link></li>
              <li><Link href="/" className="text-slate-300 hover:text-white">Properties</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-white">How It Works</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white">Bidding Guide</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Property Insights</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Market Trends</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Subscribe</h4>
            <p className="text-slate-300 mb-4">
              Get the latest property listings and market updates.
            </p>
            <form className="mb-4">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 bg-slate-700 text-white rounded-l-md border-none focus-visible:ring-primary" 
                />
                <Button type="submit" className="bg-primary rounded-l-none hover:bg-blue-700">
                  <Send size={16} />
                </Button>
              </div>
            </form>
            <p className="text-slate-400 text-sm">
              We'll never share your email with anyone else.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-slate-400 text-sm">© 2023 PropertyBid. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 text-sm hover:text-white">Privacy Policy</a>
            <a href="#" className="text-slate-400 text-sm hover:text-white">Terms of Service</a>
            <a href="#" className="text-slate-400 text-sm hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
