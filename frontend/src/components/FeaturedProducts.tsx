import { useState,useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios'
import AddToCart from "@/components/AddToCart";

const FeaturedProducts = () => {
  const [products,setProducts] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/featured');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={scrollLeft}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={scrollRight}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" asChild>
            <Link to="/shop">View All</Link>
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Card key={product.id} className="min-w-[280px] max-w-[280px] overflow-hidden group transition-all duration-300 hover:shadow-lg flex-shrink-0">
              <Link to={`/product/${product._id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images?.[0]?.url || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-2 right-2">New</Badge>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-base">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <span className="font-bold text-primary">${product.price}</span>
                </div>
                <div className="space-y-4">
                <div className="text-green-600 font-medium flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                  In Stock ({product.stock} available)
                </div>
                
                <AddToCart productId={product._id} stock={product.stock} />
              </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
