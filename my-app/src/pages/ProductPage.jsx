import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from '../context/AuthContext';
import { formatPrice } from "../utils/helpers";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center text-white py-16">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert("Please select a size");
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }
    const result = await addToCart(
      product,
      quantity,
      selectedSize
    );
    if (result.success) {
      navigate("/cart");
    } else {
      alert(result.message || "Could not add to cart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-16 min-h-[70vh] bg-home-bg text-home-text">
      {/* Product Image */}
      <div className="flex-1 flex items-start justify-center">
        <img
          src={
            product.image
              ? (product.image.startsWith("/uploads/")
                  ? `${BACKEND_URL}${product.image}`
                  : `${BACKEND_URL}/uploads/${product.image}`)
              : "/images/placeholder.svg"
          }
          alt={product.name}
          className="w-full max-w-md rounded-lg shadow-lg object-cover mt-2"
        />
      </div>
      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-start">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-semibold mb-4">{formatPrice(product.price)}</p>
        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-6">
            <span className="block mb-2">Size</span>
            <div className="flex gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded ${selectedSize === size ? "bg-[#232838]" : "bg-gray-900"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Quantity */}
        <div className="mb-6">
          <span className="block mb-2">Quantity</span>
          <select
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="px-4 py-2 border rounded bg-gray-900"
          >
            {[...Array(Math.min(10, product.stock || 10)).keys()].map(i => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#232838] py-3 rounded-lg mb-8 hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
        {/* Description & Details */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Description</h2>
          <p>{product.description}</p>
          <h2 className="text-xl font-semibold">Product Details</h2>
          <ul className="list-disc list-inside">
            <li>Category: {product.category}</li>
            <li>Status: {product.status}</li>
            <li>Stock: {product.stock} units available</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;