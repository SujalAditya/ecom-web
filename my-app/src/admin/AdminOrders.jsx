import React, { useState, useEffect } from "react";
import { formatPrice } from "../utils/helpers";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    // This would typically come from an API call
    setOrders([
      {
        id: "ORD001",
        customer: "John Doe",
        date: "2025-04-01",
        items: [
          { name: "T-Shirt", quantity: 2, price: 29.99 },
          { name: "Cap", quantity: 1, price: 19.99 }
        ],
        total: 79.97,
        status: "Completed",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001"
        }
      },
      {
        id: "ORD002",
        customer: "Jane Smith",
        date: "2025-04-02",
        items: [
          { name: "Hoodie", quantity: 1, price: 59.99 }
        ],
        total: 59.99,
        status: "Processing",
        shippingAddress: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zip: "90001"
        }
      },
      {
        id: "ORD003",
        customer: "Bob Johnson",
        date: "2025-04-03",
        items: [
          { name: "Sneakers", quantity: 1, price: 89.99 },
          { name: "T-Shirt", quantity: 1, price: 29.99 }
        ],
        total: 119.98,
        status: "Shipped",
        shippingAddress: {
          street: "789 Pine St",
          city: "Chicago",
          state: "IL",
          zip: "60601"
        }
      }
    ]);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "badge-success";
      case "Processing":
        return "badge-warning";
      case "Shipped":
        return "badge-primary";
      default:
        return "badge-secondary";
    }
  };

  return (
    <div className="admin-orders bg-admin-orders-bg min-h-screen p-8">
      <h1 className="admin-orders-title text-4xl font-bold mb-8 text-admin-orders-title">Manage Orders</h1>
      <div className="admin-orders-filters flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-orders-search px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-primary-navbar min-w-[250px]"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="admin-orders-status px-6 py-3 rounded bg-[#242424] text-white border border-gray-600 focus:outline-none focus:border-primary-navbar"
        >
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
        </select>
      </div>
      <div className="admin-orders-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredOrders.map((order) => (
          <div key={order.id} className="admin-order-card bg-admin-order-card-bg p-6 rounded-lg shadow flex flex-col">
            <div className="admin-order-info flex-1 flex flex-col">
              <h2 className="admin-order-id text-xl font-semibold mb-2 text-white">Order #{order.id}</h2>
              <p className="admin-order-customer text-lg text-primary-navbar font-bold mb-2">{order.customer}</p>
              <p className="admin-order-total text-sm text-gray-400 mb-4">Total: ${order.total}</p>
              <p className="admin-order-status text-sm text-gray-400 mb-4">Status: {order.status}</p>
              <div className="admin-order-actions mt-auto flex gap-2">
                <button className="admin-order-edit-btn bg-primary-navbar text-white px-4 py-2 rounded hover:bg-[#ff2525] transition-all">Edit</button>
                <button className="admin-order-delete-btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition-all">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders; 