import React, { useState } from 'react';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import SalesReport from './SalesReport';

export default function AdminDashboardV2() {
  const [tab, setTab] = useState('products');

  return (
    <div className="admin-dashboard min-h-screen p-8 bg-home-bg text-home-text">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${tab === 'products' ? 'bg-primary-navbar text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('products')}
        >
          Product Management
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-primary-navbar text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('orders')}
        >
          Order Management
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'sales' ? 'bg-primary-navbar text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('sales')}
        >
          Profit / Sales Report
        </button>
      </div>
      <div className="bg-[#242424] rounded-lg shadow p-6">
        {tab === 'products' && <ProductManagement />}
        {tab === 'orders' && <OrderManagement />}
        {tab === 'sales' && <SalesReport />}
      </div>
    </div>
  );
}
