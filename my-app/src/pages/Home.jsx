import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from '../context/AuthContext';

// Backend URL for product images
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const perPage = 8;
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
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

  // Instead of adding to cart, navigate to product details on button click
  const handleGoToProduct = (e, product) => {
    e.stopPropagation();
    navigate(`/products/${product._id}`);
  };

  const featuredProducts = normalizedProducts.slice(0, 3);

  return (
    <div className="home min-h-screen bg-home-bg text-home-text">
      {/* Hero Section */}
      <div 
        className="home-hero relative min-h-screen flex items-center justify-center bg-home-bg bg-cover bg-center bg-no-repeat"
      >
        <div className="home-hero-overlay absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="home-hero-content relative z-20 text-center w-full max-w-4xl mx-auto px-6">
          <div className="home-hero-text flex flex-col items-center justify-center space-y-6">
            <h1 className="home-title text-6xl sm:text-7xl md:text-8xl font-bold tracking-wider text-white">
              DEADMENALIVE
            </h1>
            <p className="home-subtitle text-lg sm:text-xl md:text-2xl font-light tracking-wide text-white">
              RISE FROM THE ASHES. WEAR THE MINDSET.
            </p>
            <div className="home-shopnow-btn-container mt-8">
              <button
                onClick={() => {
                  const featured = document.getElementById('home-featured');
                  if (featured) {
                    featured.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="home-shopnow-btn inline-block bg-primary-navbar text-white px-12 py-3 rounded hover:bg-[#ff2525] transition-all text-lg font-medium"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="home-featured-section mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary-navbar">Featured Collection</h2>
        <div className="home-featured-list grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="home-featured-product group relative bg-[#242424] rounded-lg overflow-hidden transition-all hover:scale-105"
            >
              <div className="home-featured-product-img-container aspect-w-1 aspect-h-1">
                <img
                  src={
                    product.image
                      ? (product.image.startsWith("/uploads/")
                          ? `${BACKEND_URL}${product.image}`
                          : `${BACKEND_URL}/uploads/${product.image}`)
                      : "/images/placeholder.svg"
                  }
                  alt={product.name}
                  className="home-featured-product-img w-full h-full object-cover"
                />
              </div>
              <div className="home-featured-product-info p-6">
                <h3 className="home-featured-product-name text-lg font-semibold text-white mb-2">{product.name}</h3>
                <p className="home-featured-product-price text-xl font-medium text-primary-navbar mb-4">${product.price?.toFixed(2)}</p>
                <button
                  onClick={(e) => handleGoToProduct(e, product)}
                  className="home-featured-product-addcart-btn w-full bg-primary-navbar text-white px-6 py-3 rounded hover:bg-[#ff2525] transition-all"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* All Products Plain Text */}
        <div className="mt-6 flex justify-center">
          <span className="text-3xl font-bold text-primary-navbar text-center" style={{ letterSpacing: '0.01em' }}>
            All Products
          </span>
        </div>
      </section>

      {/* Filters */}
      <div className="home-products-filters flex flex-wrap gap-4 justify-center mb-12">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="home-products-search px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-primary-navbar min-w-[250px]"
        />

        <select 
          onChange={(e) => setCategory(e.target.value)} 
          value={category} 
          className="home-products-category px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-primary-navbar"
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
          className="home-products-sort px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-primary-navbar"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-white text-center py-12">Loading products...</div>
      ) : (
        <div className="home-products-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {paginated.map((product) => (
            <div
               key={product._id}
               onClick={() => navigate(`/products/${product._id}`)}
               className="home-product-card group relative bg-[#23232a] rounded-lg overflow-hidden transition-all hover:scale-105 cursor-pointer shadow-md p-4"
               style={{ minWidth: 0, maxWidth: '270px', margin: 'auto' }}
             >
               <div className="home-product-img-container" style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '10px' }}>
                 <img
                   src={
                     product.image
                       ? (product.image.startsWith("/uploads/")
                           ? `${BACKEND_URL}${product.image}`
                           : `${BACKEND_URL}/uploads/${product.image}`)
                       : "/images/placeholder.svg"
                   }
                   alt={product.name}
                   style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                 />
               </div>
               <div className="home-product-info px-3 py-4">
                 <h3 className="home-product-name text-lg font-semibold text-white mb-2 truncate" title={product.name}>{product.name}</h3>
                 <p className="home-product-price text-base font-medium text-primary-navbar mb-2">${product.price?.toFixed(2)}</p>
                 {product.status && (
                   <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1 ${
                     product.status === 'Active' ? 'bg-green-700 text-green-100' :
                     product.status === 'Inactive' ? 'bg-gray-600 text-gray-200' :
                     product.status === 'Out of Stock' ? 'bg-red-700 text-red-100' : 'bg-gray-500 text-white'
                   }`}>
                     {product.status}
                   </span>
                 )}
               </div>
             </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="home-products-pagination flex justify-center mt-12 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`home-products-page-btn px-6 py-3 rounded transition-all ${
                page === i + 1
                  ? "bg-primary-navbar text-white"
                  : "bg-[#242424] text-white hover:bg-[#ff2525]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;