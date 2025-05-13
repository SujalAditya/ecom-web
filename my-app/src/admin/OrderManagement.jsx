import React, { useEffect, useState } from 'react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders/admin/all', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-t">
                <td className="py-2 px-4">{order._id}</td>
                <td className="py-2 px-4">{order.user?.username || order.user?.email || 'Unknown'}</td>
                <td className="py-2 px-4">${order.total}</td>
                <td className="py-2 px-4">{order.status}</td>
                <td className="py-2 px-4">
                  {/* Add status update or view actions here */}
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                  <button className="bg-green-500 text-white px-2 py-1 rounded">Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
