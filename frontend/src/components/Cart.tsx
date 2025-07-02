import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-blue-500 hover:text-blue-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex items-center border-b py-4">
              <img
                src={item.product.images[0]?.url}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                    className="px-2 py-1 border rounded-l"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="px-2 py-1 border rounded-r"
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="ml-4 text-right">
                <p className="font-semibold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-4">
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button
              className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600"
              onClick={() => {/* Implement checkout */}}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 