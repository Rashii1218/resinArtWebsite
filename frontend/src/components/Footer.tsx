
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Resin Artisan</h3>
            <p className="text-muted-foreground mb-4">
              Handcrafted resin creations made with love and attention to detail. Every piece tells a story.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">123 Resin Ave, Craftville</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <a href="mailto:contact@resinartisan.com" className="text-muted-foreground hover:text-primary">
                  contact@resinartisan.com
                </a>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary">
                  (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to get updates on new products and special offers.
            </p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Your email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Resin Artisan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
