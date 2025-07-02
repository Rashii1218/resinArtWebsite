import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface AddToCartProps {
  productId: string;
  stock: number;
  customText?: string;
}

const AddToCart: React.FC<AddToCartProps> = ({ productId, stock, customText }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity, customText);
      // You can add a success notification here
    } catch (error) {
      // You can add an error notification here
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border-r hover:bg-gray-100"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            className="px-3 py-1 border-l hover:bg-gray-100"
            disabled={quantity >= stock}
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {stock} available
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        disabled={stock === 0}
      >
        {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default AddToCart; 