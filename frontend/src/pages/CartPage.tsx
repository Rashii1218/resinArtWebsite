import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { cart, loading, error, updateQuantity, removeFromCart } = useCart();

  const getImageUrl = (images: Array<{ url: string; public_id?: string; publicId?: string }>) => {
    if (!images || images.length === 0) return null;
    return images[0].url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <p>Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <ShoppingBag className="h-16 w-16 mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const shipping = 5.99;
  
  // Calculate custom text total for display purposes
  const customTextTotal = cart.items.reduce((sum, item) => {
    if (item.customText && item.product?.customTextPrice) {
      return sum + (item.product.customTextPrice * item.quantity);
    }
    return sum;
  }, 0);
  
  const total = cart.total + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-4">Product</th>
                      <th className="text-center pb-4">Quantity</th>
                      <th className="text-right pb-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.filter(item => item.product).map((item) => (
                      <tr key={item.product?._id || 'unknown'} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center">
                            {item.product?.images && getImageUrl(item.product.images) ? (
                              <img 
                                src={getImageUrl(item.product.images)} 
                                alt={item.product.name || 'Product'} 
                                className="w-16 h-16 object-cover rounded mr-4" 
                              />
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded mr-4 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{item.product?.name || 'Unknown Product'}</h3>
                              <p className="text-sm text-muted-foreground">${item.product?.price?.toFixed(2) || '0.00'}</p>
                              {item.customText && (
                                <div className="mt-1">
                                  <p className="text-xs text-blue-600">
                                    Custom text: "{item.customText}"
                                    {item.product?.customTextPrice && item.product.customTextPrice > 0 && (
                                      <span className="text-muted-foreground ml-1">
                                        (+${item.product.customTextPrice.toFixed(2)})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex justify-center items-center">
                            <div className="flex border rounded-md">
                              <button 
                                className="px-3 py-1 border-r hover:bg-gray-100"
                                onClick={() => updateQuantity(item.product?._id || '', Math.max(1, item.quantity - 1))}
                              >
                                -
                              </button>
                              <span className="w-12 text-center p-1">
                                {item.quantity}
                              </span>
                              <button 
                                className="px-3 py-1 border-l hover:bg-gray-100"
                                onClick={() => updateQuantity(item.product?._id || '', item.quantity + 1)}
                                disabled={item.quantity >= (item.product?.stock || 0)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end">
                            <p className="font-medium">
                              ${((item.product?.price || 0) * item.quantity + (item.customText && item.product?.customTextPrice ? item.product.customTextPrice * item.quantity : 0)).toFixed(2)}
                            </p>
                            <button 
                              className="ml-4 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.product?._id || '')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <Button variant="outline" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                {customTextTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custom Text</span>
                    <span>${customTextTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full" asChild>
                <Link to="/checkout">
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
