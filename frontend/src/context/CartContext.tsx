import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      public_id: string;
    }>;
    stock: number;
    allowsCustomText?: boolean;
    customTextLabel?: string;
    customTextMaxLength?: number;
    customTextPrice?: number;
  };
  quantity: number;
  customText?: string;
}

interface Cart {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity?: number, customText?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

  const fetchCart = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/cart`, {
        withCredentials: true
      });
      setCart(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.response?.data?.message || 'Error fetching cart');
      if (error.response?.status !== 401) {
        toast({
          title: "Error",
          description: error.response?.data?.message || 'Error fetching cart',
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1, customText?: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add items to your cart",
          variant: "destructive"
        });
        return;
      }
      const response = await axios.post(`${API_URL}/cart/items`, {
        productId,
        quantity,
        ...(customText ? { customText } : {})
      }, {
        withCredentials: true
      });
      setCart(response.data);
      setError(null);
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.response?.data?.message || 'Error adding to cart');
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error adding to cart',
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update your cart",
          variant: "destructive"
        });
        return;
      }
      const response = await axios.patch(`${API_URL}/cart/items/${productId}`, {
        quantity
      }, {
        withCredentials: true
      });
      setCart(response.data);
      setError(null);
    } catch (error) {
      console.error('Error updating cart:', error);
      setError(error.response?.data?.message || 'Error updating cart');
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error updating cart',
        variant: "destructive"
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to remove items from your cart",
          variant: "destructive"
        });
        return;
      }
      const response = await axios.delete(`${API_URL}/cart/items/${productId}`, {
        withCredentials: true
      });
      setCart(response.data);
      setError(null);
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.response?.data?.message || 'Error removing from cart');
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error removing from cart',
        variant: "destructive"
      });
    }
  };

  const clearCart = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to clear your cart",
          variant: "destructive"
        });
        return;
      }
      await axios.delete(`${API_URL}/cart`, {
        withCredentials: true
      });
      setCart(null);
      setError(null);
      toast({
        title: "Success",
        description: "Cart cleared",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.response?.data?.message || 'Error clearing cart');
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error clearing cart',
        variant: "destructive"
      });
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 