import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ContinueCheckout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: '', phone: '', isDefault: false
  });

  // Fetch addresses from backend
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/addresses', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
        setSelectedAddress(data[0] || null);
      }
    };
    fetchAddresses();
  }, []);

  // Calculate totals
  const totalMRP = cart.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
  const discount = 2270; // Demo
  const platformFee = 20;
  const shippingFee = 0;
  const totalAmount = totalMRP - discount + platformFee + shippingFee;

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddAddress = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(addressForm)
    });
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
      setShowAddAddress(false);
      setAddressForm({ name: '', street: '', city: '', state: '', zip: '', country: '', phone: '', isDefault: false });
      setSelectedAddress(data[data.length - 1]);
    } else {
      // Optionally handle error
      alert('Failed to add address');
    }
  };

  return (
    <div className="min-h-screen bg-[#10121a] text-white flex flex-col items-center py-8">
      <div className="w-full max-w-5xl flex gap-8">
        {/* Left: Address Selection */}
        <div className="flex-1 bg-[#242424] rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary-navbar">Select Delivery Address</h2>
            <button className="bg-primary-navbar text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#ff2525] transition" onClick={() => setShowAddAddress(true)}>ADD NEW ADDRESS</button>
          </div>
          {selectedAddress && !showAddAddress && (
            <div className="border border-primary-navbar rounded-lg p-4 mb-4 flex flex-col gap-2 bg-[#191b22]">
              <div className="flex items-center gap-2">
                <input type="radio" checked readOnly className="accent-pink-600" />
                <span className="font-bold text-white">{selectedAddress.name}</span>
                <span className="ml-2 bg-green-700 text-green-100 text-xs px-2 py-1 rounded">HOME</span>
              </div>
              <div className="text-gray-200">
                {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}<br />
                {selectedAddress.country}
              </div>
              <div className="text-white">Mobile: <span className="font-bold">{selectedAddress.phone}</span></div>
              <div className="text-gray-400 text-sm">• Pay on Delivery available</div>
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-1 border border-primary-navbar rounded text-sm text-primary-navbar hover:bg-primary-navbar hover:text-white transition" onClick={() => setSelectedAddress(null)}>REMOVE</button>
                <button className="px-4 py-1 border border-primary-navbar rounded text-sm text-primary-navbar hover:bg-primary-navbar hover:text-white transition" onClick={() => setShowAddAddress(true)}>EDIT</button>
              </div>
            </div>
          )}
          {showAddAddress && (
            <div className="border border-primary-navbar rounded-lg p-4 mb-4 bg-[#191b22]">
              <div className="mb-2 font-semibold text-primary-navbar">Add New Address</div>
              <input className="mb-2 px-2 py-1 border border-gray-600 rounded w-full bg-[#10121a] text-white placeholder-gray-400" name="name" placeholder="Name" value={addressForm.name} onChange={handleAddressChange} />
              <input className="mb-2 px-2 py-1 border border-gray-600 rounded w-full bg-[#10121a] text-white placeholder-gray-400" name="street" placeholder="Street" value={addressForm.street} onChange={handleAddressChange} />
              <input className="mb-2 px-2 py-1 border border-gray-600 rounded w-full bg-[#10121a] text-white placeholder-gray-400" name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} />
              <input className="mb-2 px-2 py-1 border border-gray-600 rounded w-full bg-[#10121a] text-white placeholder-gray-400" name="state" placeholder="State" value={addressForm.state} onChange={handleAddressChange} />
              <input className="mb-2 px-2 py-1 border border-gray-600 rounded w-full bg-[#10121a] text-white placeholder-gray-400" name="zip" placeholder="ZIP" value={addressForm.zip} onChange={handleAddressChange} />
              <input className="mb-2 px-2 py-1 border border-gray-600 rounded w-full bg-[#10121a] text-white placeholder-gray-400" name="country" placeholder="Country" value={addressForm.country} onChange={handleAddressChange} />
              <input className="mb-2 px-2 py-1 border border-gray-600 rounded w-full bg-[#10121a] text-white placeholder-gray-400" name="phone" placeholder="Phone" value={addressForm.phone} onChange={handleAddressChange} />
              <label className="flex items-center mb-2 text-white">
                <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressChange} />
                <span className="ml-2">Set as default</span>
              </label>
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-1 bg-primary-navbar text-white rounded hover:bg-[#ff2525] transition" onClick={handleAddAddress}>Save</button>
                <button className="px-4 py-1 bg-gray-700 text-white rounded" onClick={() => setShowAddAddress(false)}>Cancel</button>
              </div>
            </div>
          )}
          <div className="text-primary-navbar cursor-pointer mt-4 font-semibold" onClick={() => setShowAddAddress(true)}>+ Add New Address</div>
        </div>
        {/* Right: Order Summary */}
        <div className="w-[350px] bg-[#242424] rounded-lg shadow p-8">
          <div className="mb-6">
            <div className="font-bold text-sm mb-2 text-primary-navbar">DELIVERY ESTIMATES</div>
            <div className="text-white text-sm mb-1">Estimated delivery by <span className="font-semibold">8 May 2025</span></div>
            <div className="text-white text-sm">Estimated delivery by <span className="font-semibold">11 May 2025</span></div>
          </div>
          <div className="mb-6">
            <div className="font-bold text-sm mb-2 text-primary-navbar">PRICE DETAILS ({cart.length} Items)</div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-200">Total MRP</span>
              <span className="text-white">₹{totalMRP}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-200">Discount on MRP</span>
              <span className="text-green-400">-₹{discount}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-200">Platform Fee <span className="text-primary-navbar cursor-pointer">Know More</span></span>
              <span className="text-white">₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-200">Shipping Fee <span className="text-primary-navbar cursor-pointer">Know More</span></span>
              <span className="text-green-400">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2">
              <span className="text-white">Total Amount</span>
              <span className="text-white">₹{totalAmount}</span>
            </div>
          </div>
          <button className="w-full bg-primary-navbar text-white py-3 rounded text-lg font-semibold hover:bg-[#ff2525] transition">CONTINUE</button>
        </div>
      </div>
      {/* Payment Icons Row */}
      <div className="flex gap-4 justify-center items-center mt-8">
        <img src="/images/ssl.png" alt="SSL" className="h-7" />
        <img src="/images/visa.png" alt="VISA" className="h-7" />
        <img src="/images/mastercard.png" alt="MasterCard" className="h-7" />
        <img src="/images/amex.png" alt="Amex" className="h-7" />
        <img src="/images/netbanking.png" alt="Net Banking" className="h-7" />
        <img src="/images/cod.png" alt="Cash on Delivery" className="h-7" />
        <img src="/images/rupay.png" alt="RuPay" className="h-7" />
        <img src="/images/paypal.png" alt="PayPal" className="h-7" />
        <img src="/images/bhim.png" alt="BHIM" className="h-7" />
      </div>
      {/* Help/Contact Row */}
      <div className="text-center text-gray-400 text-sm mt-4">Need Help ? Contact Us</div>
    </div>
  );
};

export default ContinueCheckout;
