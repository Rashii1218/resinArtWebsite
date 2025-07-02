import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string; public_id: string }[];
  category: string;
  isNew?: boolean;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const addToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`);
    // This will be connected to cart functionality later
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product._id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
          <Link to={`/product/${product._id}`}>
            <div className="relative aspect-square overflow-hidden bg-muted">
              {!imageErrors[product._id] && product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => handleImageError(product._id)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
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
            <Button 
              variant="secondary" 
              className="w-full mt-2"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
