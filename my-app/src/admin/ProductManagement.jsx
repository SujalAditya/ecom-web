import React, { useEffect, useState, useRef } from 'react';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    imageFile: null,
    status: 'Active'
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setCategories(["All Categories", ...Array.from(new Set(data.map(p => p.category).filter(Boolean)))]);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || category === "All Categories" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const openModal = () => {
    setShowModal(true);
    setNewProduct({ name: '', description: '', price: '', stock: '', category: '', image: '', imageFile: null, status: 'Active' });
    setAddError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeModal = () => {
    setShowModal(false);
    setAddError('');
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setNewProduct(prev => ({ ...prev, imageFile: file }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.description) {
      setAddError('All fields except image are required.');
      setAddLoading(false);
      return;
    }
    let imageUrl = newProduct.image;
    if (newProduct.imageFile) {
      // Upload file to backend
      const formData = new FormData();
      formData.append('image', newProduct.imageFile);
      const token = localStorage.getItem('token');
      try {
        const uploadRes = await fetch('/api/products/upload-image', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      } catch (err) {
        setAddError('Image upload failed');
        setAddLoading(false);
        return;
      }
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          category: newProduct.category,
          image: imageUrl,
          status: newProduct.status
        })
      });
      if (!res.ok) throw new Error('Failed to add product');
      const created = await res.json();
      setProducts(prev => [created, ...prev]);
      setShowModal(false);
    } catch (err) {
      setAddError('Failed to add product');
    }
    setAddLoading(false);
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setProducts(products => products.map(p => p._id === productId ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products => products.filter(p => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-home-text">Manage Products</h2>
        <button onClick={openModal} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 ml-auto">Add New Product</button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="bg-[#23263a] text-white px-4 py-2 rounded focus:outline-none md:w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="bg-[#23263a] text-white px-4 py-2 rounded focus:outline-none md:w-56"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#242424] p-8 rounded-lg w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={closeModal}>&times;</button>
            <h3 className="text-xl font-semibold mb-4 text-home-text">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input name="name" value={newProduct.name} onChange={handleInputChange} className="w-full px-4 py-2 rounded bg-[#23263a] text-white" placeholder="Product Name" />
              <textarea name="description" value={newProduct.description} onChange={handleInputChange} className="w-full px-4 py-2 rounded bg-[#23263a] text-white" placeholder="Description" rows={3} />
              <input name="price" value={newProduct.price} onChange={handleInputChange} type="number" step="0.01" className="w-full px-4 py-2 rounded bg-[#23263a] text-white" placeholder="Price" />
              <input name="stock" value={newProduct.stock} onChange={handleInputChange} type="number" className="w-full px-4 py-2 rounded bg-[#23263a] text-white" placeholder="Stock" />
              <input name="category" value={newProduct.category} onChange={handleInputChange} className="w-full px-4 py-2 rounded bg-[#23263a] text-white" placeholder="Category" />
              <input name="image" value={newProduct.image} onChange={handleInputChange} className="w-full px-4 py-2 rounded bg-[#23263a] text-white" placeholder="Image URL (optional)" />
              <select name="status" value={newProduct.status} onChange={handleInputChange} className="w-full px-4 py-2 rounded bg-[#23263a] text-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Or upload image from your computer:</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="w-full text-white" />
              </div>
              {addError && <div className="text-red-500 text-sm">{addError}</div>}
              <div className="flex gap-4 mt-4">
                <button type="button" className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={closeModal}>Cancel</button>
                <button type="submit" className="flex-1 bg-primary-navbar text-white px-4 py-2 rounded hover:bg-[#ff2525]" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-home-text">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-[#242424] rounded-lg shadow-md p-6 flex flex-col">
              <div className="mb-2 text-lg font-semibold text-home-text">{product.name}</div>
<div className="mb-1 text-gray-400">${product.price?.toFixed(2)}</div>
<div className="mb-1 text-xs text-gray-500">{product._id}</div>
{(() => {
  const BACKEND_URL = "http://localhost:5000";
  const imgSrc = product.image
    ? (product.image.startsWith('/uploads/')
        ? `${BACKEND_URL}${product.image}`
        : `${BACKEND_URL}/uploads/${product.image}`)
    : `https://via.placeholder.com/120x80?text=${encodeURIComponent(product.name)}`;
  return (
    <img
      src={imgSrc}
      alt={product.name}
      className="w-full h-24 object-contain bg-black rounded mb-2"
    />
  );
})()}
<div className="mb-1 text-gray-400">Stock: {product.stock}</div>
<select className="bg-[#23263a] text-white px-2 py-1 rounded mb-3" value={product.status || 'Active'} onChange={e => handleStatusChange(product._id, e.target.value)}>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
  <option value="Out of Stock">Out of Stock</option>
</select>
<div className="flex gap-2 mt-auto">
  <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Edit</button>
  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
