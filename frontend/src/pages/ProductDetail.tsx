import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Heart, Share2, ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import AddToCart from "@/components/AddToCart";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: { url: string; public_id: string }[];
  allowsCustomText: boolean;
  customTextLabel?: string;
  customTextMaxLength?: number;
  customTextPrice?: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <Link to="/shop" className="text-muted-foreground hover:text-primary">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <Link to={`/shop/${product.category.toLowerCase()}`} className="text-muted-foreground hover:text-primary">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img 
                src={product.images[selectedImage]?.url || '/placeholder.png'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image.public_id}
                  className={`w-20 h-20 border rounded-md overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image.url} 
                    alt={`${product.name} view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="flex items-center mt-2 mb-4">
              <div className="flex items-center">
                {renderStars(4.5)}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                (4.5 reviews)
              </span>
            </div>
            
            <div className="text-2xl font-bold text-primary mb-6">${product.price}</div>
            
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            <Separator className="my-6" />
            
            {/* Product Features */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Features:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {/* Add product features here */}
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="text-green-600 font-medium flex items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                In Stock ({product.stock} available)
              </div>
              {product.allowsCustomText && (
                <div className="space-y-2">
                  <label htmlFor="customText" className="block font-medium">
                    {product.customTextLabel || "Custom Text"} <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    id="customText"
                    type="text"
                    maxLength={product.customTextMaxLength || 50}
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder={product.customTextLabel || "Enter your custom text (optional)"}
                  />
                  {product.customTextPrice > 0 && (
                    <div className="text-sm text-gray-500">+${product.customTextPrice.toFixed(2)} for custom text</div>
                  )}
                </div>
              )}
              <AddToCart productId={product._id} stock={product.stock} customText={customText} />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
