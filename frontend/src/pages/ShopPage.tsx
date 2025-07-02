import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/ShopFilters";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from'axios'

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: { url: string; public_id: string }[];
}

const ShopPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "All";
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/products'),
          axios.get('http://localhost:3000/api/categories')
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryQuery) {
      setActiveCategory(categoryQuery);
    }
  }, [categoryQuery]);

  useEffect(() => {
    let filtered = products;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(filtered);
  }, [activeCategory, priceRange, searchQuery, products]);

  const filters = (
    <ShopFilters 
      categories={categories}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
    />
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Shop Our Collection</h1>
          <p className="text-muted-foreground mb-8">
            Discover our handmade resin creations, crafted with love and attention to detail.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6">
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="mb-4">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  {filters}
                </SheetContent>
              </Sheet>
            ) : (
              <div className="md:w-1/4">
                <div className="sticky top-20">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  {filters}
                </div>
              </div>
            )}
            
            <div className={isMobile ? "w-full" : "md:w-3/4"}>
              {searchQuery && (
                <div className="mb-4">
                  <p className="text-muted-foreground">Search results for: <span className="font-medium text-foreground">{searchQuery}</span></p>
                </div>
              )}
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopPage;
