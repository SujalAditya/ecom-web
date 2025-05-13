import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from '../context/AuthContext';

const API_URL = "http://localhost:5000/api";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const perPage = 12; // Show more products per page
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products");
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Ensure all products have _id for addToCart
  const normalizedProducts = products.map(p => ({ ...p, _id: p._id || p.id }));

  const filtered = normalizedProducts
    .filter(p => (category ? p.category === category : true))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="bg-[#1a1a1a] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">All Products</h1>
          <div className="h-1 w-16 bg-[#ff3e3e] mx-auto mb-12"></div>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-[#ff3e3e] min-w-[250px]"
            />
            <select 
              onChange={(e) => setCategory(e.target.value)} 
              value={category} 
              className="px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-[#ff3e3e]"
            >
              <option value="">All Categories</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Hoodies">Hoodies</option>
              <option value="Pants">Pants</option>
              <option value="Accessories">Accessories</option>
            </select>
            <select 
              onChange={(e) => setSortBy(e.target.value)} 
              value={sortBy} 
              className="px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-[#ff3e3e]"
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center text-white text-lg">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg">{error}</div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {paginated.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/products/${product._id}`);
                    }
                  }}
                  className="group relative bg-[#242424] rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
                  style={{ outline: 'none' }}
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img
  src={
    product.image
      ? (product.image.startsWith('/uploads/')
          ? `http://localhost:5000${product.image}`
          : `http://localhost:5000/uploads/${product.image}`)
      : '/images/placeholder.svg'
  }
  alt={product.name}
  className="w-full h-full object-cover"
/>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                    <p className="text-xl font-medium text-[#ff3e3e] mb-4">${product.price?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-6 py-3 rounded transition-all ${
                      page === i + 1
                        ? "bg-[#ff3e3e] text-white"
                        : "bg-[#242424] text-white hover:bg-[#ff2525]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;