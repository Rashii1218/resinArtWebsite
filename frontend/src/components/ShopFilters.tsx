import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useLocation } from "react-router-dom";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
  };
}

interface ShopFiltersProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const ShopFilters = ({
  categories,
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
}: ShopFiltersProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    const searchParams = new URLSearchParams(location.search);
    if (value === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    navigate(`/shop?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <RadioGroup value={activeCategory} onValueChange={handleCategoryChange}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="All" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.name} id={category._id} />
                <Label htmlFor={category._id}>{category.name}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-4">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in-stock"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="in-stock" className="ml-2">In Stock</Label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="new-arrivals"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="new-arrivals" className="ml-2">New Arrivals</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopFilters;
