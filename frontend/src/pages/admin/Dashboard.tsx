import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from '@/components/ImageUpload';
import { Plus, Package, Settings, Users, BarChart, Tag } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import OrdersList from './OrdersList';
import CustomersList from './CustomersList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: { url: string; public_id: string }[];
  isFeatured?: boolean;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ url: string; public_id: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState<{ url: string; public_id: string } | null>(null);
  const [allowsCustomText, setAllowsCustomText] = useState(false);
  const [customTextLabel, setCustomTextLabel] = useState('Custom Text');
  const [customTextMaxLength, setCustomTextMaxLength] = useState(50);
  const [customTextPrice, setCustomTextPrice] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error ❌",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error ❌",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const handleImageUploaded = (url: string, publicId: string) => {
    console.log('Product image uploaded:', { url, publicId });
    setImages(prev => [...prev, { url, public_id: publicId }]);
  };

  const handleImageDeleted = (publicId: string) => {
    console.log('Product image deleted:', publicId);
    setImages(prev => prev.filter(img => img.public_id !== publicId));
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`${API_URL}/api/products/${productId}`);
      toast({
        title: "Success! 🎉",
        description: "Product deleted successfully",
        variant: "success",
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error ❌",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Current images state:', images);
      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        stock: parseInt(data.stock),
        images: images.map(img => ({
          url: img.url,
          public_id: img.public_id
        })),
        allowsCustomText,
        customTextLabel,
        customTextMaxLength,
        customTextPrice
      };

      console.log('Sending product data:', productData);
      const response = await axios.post(`${API_URL}/api/products`, productData);
      console.log('Product creation response:', response.data);
      
      toast({
        title: "Success! 🎉",
        description: "Product created successfully",
        variant: "success",
      });
      
      reset({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
      });
      setImages([]);
      setAllowsCustomText(false);
      setCustomTextLabel('Custom Text');
      setCustomTextMaxLength(50);
      setCustomTextPrice(0);
      await fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error.response?.data || error.message);
      toast({
        title: "Error ❌",
        description: error.response?.data?.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      navigate(`?search=${encodeURIComponent(value)}`);
    } else {
      navigate('');
    }
  };

  const handleCategoryImageUploaded = (url: string, publicId: string) => {
    console.log('Category image uploaded:', { url, publicId });
    setCategoryImage({ url, public_id: publicId });
  };

  const handleCategoryImageDeleted = () => {
    console.log('Category image deleted');
    setCategoryImage(null);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    console.log('Current categoryImage state:', categoryImage);

    try {
      const categoryData = {
        name: newCategory,
        description: newCategoryDescription,
        image: categoryImage ? {
          url: categoryImage.url,
          public_id: categoryImage.public_id
        } : null
      };

      console.log('Sending category data:', categoryData);
      const response = await axios.post(`${API_URL}/api/categories`, categoryData);
      console.log('Category created:', response.data);
      
      setCategories([...categories, response.data]);
      setNewCategory('');
      setNewCategoryDescription('');
      setCategoryImage(null);
      toast({
        title: "Success! 🎉",
        description: "Category added successfully",
        variant: "success",
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error ❌",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await axios.delete(`${API_URL}/api/categories/${categoryId}`);
      fetchCategories();
      toast({
        title: "Success! 🎉",
        description: "Category deleted successfully",
        variant: "success",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error ❌",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`${API_URL}/api/products/${productId}`, {
        isFeatured: !currentStatus
      });
      fetchProducts();
      toast({
        title: "Success! 🎉",
        description: `Product ${!currentStatus ? 'added to' : 'removed from'} featured products`,
        variant: "success",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error ❌",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate('/')}>Back to Site</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" name="name" required {...register('name')} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" name="category" required {...register('category')} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" required {...register('description')} />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" name="price" type="number" step="0.01" required {...register('price')} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input id="stock" name="stock" type="number" required {...register('stock')} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="border rounded-lg p-4">
                      <ImageUpload
                        onImageUploaded={handleImageUploaded}
                        onImageDeleted={handleImageDeleted}
                        maxImages={4}
                        initialImages={[]}
                        type="product"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="allowsCustomText"
                        type="checkbox"
                        checked={allowsCustomText}
                        onChange={(e) => setAllowsCustomText(e.target.checked)}
                      />
                      <Label htmlFor="allowsCustomText">Allow customer to add custom text?</Label>
                    </div>
                    
                    {allowsCustomText && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="customTextLabel">Custom Text Label</Label>
                          <Input
                            id="customTextLabel"
                            value={customTextLabel}
                            onChange={(e) => setCustomTextLabel(e.target.value)}
                            placeholder="e.g. What should we write?"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customTextMaxLength">Max Length</Label>
                          <Input
                            id="customTextMaxLength"
                            type="number"
                            min={1}
                            value={customTextMaxLength}
                            onChange={(e) => setCustomTextMaxLength(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customTextPrice">Custom Text Price ($)</Label>
                          <Input
                            id="customTextPrice"
                            type="number"
                            min={0}
                            step={1}
                            value={customTextPrice}
                            onChange={(e) => setCustomTextPrice(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Creating...' : 'Create Product'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product List</CardTitle>
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    console.log('Product images:', product.images);
                    return (
                      <Card key={product._id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', product.images[0].url);
                                e.currentTarget.src = '/placeholder.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-bold">${product.price}</span>
                            <span className="text-sm">Stock: {product.stock}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              variant={product.isFeatured ? "default" : "outline"} 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                            >
                              {product.isFeatured ? 'Featured' : 'Make Featured'}
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(product._id)}>
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      value={newCategoryDescription}
                      onChange={(e) => setNewCategoryDescription(e.target.value)}
                      placeholder="Enter category description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category Image</Label>
                    <div className="border rounded-lg p-4">
                      <ImageUpload
                        onImageUploaded={handleCategoryImageUploaded}
                        onImageDeleted={handleCategoryImageDeleted}
                        maxImages={1}
                        initialImages={categoryImage ? [categoryImage.url] : []}
                        publicIds={categoryImage ? [categoryImage.public_id] : []}
                        type="category"
                      />
                    </div>
                    {categoryImage && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Image uploaded: {categoryImage.url}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button type="submit">Add Category</Button>
                </form>
                <div className="grid gap-4 mt-4">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {category.image && (
                          <img
                            src={category.image.url}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Manage Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Manage Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomersList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard; 