import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/helpers";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  const subtotal = totalPrice;
  const shipping = cart.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={
                    item.product?.image
                      ? (item.product.image.startsWith("/uploads/")
                          ? `${BACKEND_URL}${item.product.image}`
                          : `${BACKEND_URL}/uploads/${item.product.image}`)
                      : "/images/placeholder.svg"
                  }
                  alt={item.product?.name || ''}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-gray-600">{formatPrice(item.product?.price || 0)}</p>
                  {item.selectedSize && (
                    <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                  )}
                  {item.selectedColor && (
                    <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </p>
                  <button
                    onClick={async () => {
                      const result = await removeFromCart(item._id);
                      if (!result.success) alert(result.message);
                    }}
                    className="text-red-500 hover:underline ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 border rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex-1 border border-black text-black px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/continue-checkout")}
                className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;