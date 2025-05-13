import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/helpers";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deletingId, setDeletingId] = useState(null); // Track which product is being deleted
  const [showModal, setShowModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setProducts([
      { id: 1, name: "T-Shirt", price: 29.99, category: "Clothing", stock: 100, status: "Active" },
      { id: 2, name: "Hoodie", price: 59.99, category: "Clothing", stock: 50, status: "Active" },
      { id: 3, name: "Cap", price: 19.99, category: "Accessories", stock: 75, status: "Active" },
      { id: 4, name: "Sneakers", price: 89.99, category: "Footwear", stock: 30, status: "Active" }
    ]);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleStatusChange = (productId, newStatus) => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, status: newStatus } : product
    ));
  };

  const handleDelete = (productId) => {
    setPendingDelete(productId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setDeletingId(pendingDelete);
    setShowModal(false);
    setTimeout(() => {
      setProducts(products => products.filter(product => product.id !== pendingDelete));
      setDeletingId(null);
      setToast("Product deleted successfully.");
      setTimeout(() => setToast(""), 2000);
    }, 800);
  };

  return (
    <div className="admin-products bg-admin-products-bg min-h-screen p-8">
      <div className="admin-products-header flex justify-between items-center mb-6">
        <h1 className="admin-products-title text-2xl font-bold">Manage Products</h1>
        <button
          onClick={() => navigate("/admin/add-product")}
          className="admin-products-add-btn btn btn-primary"
        >
          Add New Product
        </button>
      </div>
      {/* Filters */}
      <div className="admin-products-filters flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-products-search px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-primary-navbar min-w-[250px]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="admin-products-category px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-primary-navbar"
        >
          <option value="">All Categories</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Footwear">Footwear</option>
        </select>
      </div>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
      {/* Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Delete Product</h2>
            <p className="mb-6 text-gray-800">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Products Table */}
      <div className="admin-products-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="admin-product-card bg-admin-product-card-bg p-6 rounded-lg shadow flex flex-col">
            <div className="admin-product-info flex-1 flex flex-col">
              <h2 className="admin-product-name text-xl font-semibold mb-2">{product.name}</h2>
              <p className="admin-product-price text-lg font-bold mb-2">{formatPrice(product.price)}</p>
              <p className="admin-product-category text-sm mb-4">{product.category}</p>
              <p className="admin-product-stock text-sm mb-4">Stock: {product.stock}</p>
              <div className="admin-product-status mt-auto mb-4">
                <select
                  value={product.status}
                  onChange={(e) => handleStatusChange(product.id, e.target.value)}
                  className="admin-products-status-select px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-primary-navbar"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="admin-product-actions mt-auto flex gap-2">
                <button
                  onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                  className="admin-product-edit-btn bg-primary-navbar text-white px-4 py-2 rounded hover:bg-[#ff2525] transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="admin-product-delete-btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition-all"
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;