
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-purple-100 via-teal-50 to-blue-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Handcrafted Resin Art
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-lg">
                Discover unique, handmade resin creations that bring color and elegance to your life. Each piece is carefully crafted with love and attention to detail.
              </p>
              <div className="flex space-x-4">
                <Button asChild size="lg">
                  <Link to="/shop">Shop Now</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/about">Our Story</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="grid grid-cols-2 gap-4 rotate-3 transform hover:rotate-0 transition-transform duration-500">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
                    alt="Resin art piece" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" 
                    alt="Resin jewelry" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
