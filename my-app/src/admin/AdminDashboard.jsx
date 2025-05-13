import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/helpers";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token from localStorage or context
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch total sales
        const salesRes = await fetch('/api/orders/admin/total-sales', { headers });
        const salesData = await salesRes.json();

        // Fetch all orders
        const ordersRes = await fetch('/api/orders/admin/all', { headers });
        const ordersData = await ordersRes.json();

        // Fetch top products
        const topProductsRes = await fetch('/api/orders/admin/top-products', { headers });
        const topProductsData = await topProductsRes.json();

        // Fetch all products (for count)
        const productsRes = await fetch('/api/products', { headers });
        const productsData = await productsRes.json();

        // Fetch all users (for customer count)
        const usersRes = await fetch('/api/users', { headers });
        const usersData = await usersRes.json();

        setStats({
          totalSales: salesData.totalSales || 0,
          totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
          totalProducts: Array.isArray(productsData) ? productsData.length : 0,
          totalCustomers: Array.isArray(usersData) ? usersData.length : 0
        });
        setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(-5).reverse() : []);
        setTopProducts(Array.isArray(topProductsData) ? topProductsData.map(item => ({
          name: item.product?.name || 'Unknown',
          sales: item.totalSold || 0,
          revenue: item.totalRevenue || 0
        })) : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="admin-dashboard bg-admin-dashboard-bg min-h-screen p-8">
      <h1 className="admin-dashboard-title text-4xl font-bold mb-8 text-admin-dashboard-title">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="admin-dashboard-stats grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="admin-dashboard-stat bg-admin-dashboard-stat-bg p-6 rounded-lg shadow text-center">
          <h2 className="admin-dashboard-stat-title text-lg font-semibold mb-2">Total Sales</h2>
          <p className="admin-dashboard-stat-value text-2xl font-bold">{formatPrice(stats.totalSales)}</p>
        </div>
        <div className="admin-dashboard-stat bg-admin-dashboard-stat-bg p-6 rounded-lg shadow text-center">
          <h2 className="admin-dashboard-stat-title text-lg font-semibold mb-2">Orders</h2>
          <p className="admin-dashboard-stat-value text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="admin-dashboard-stat bg-admin-dashboard-stat-bg p-6 rounded-lg shadow text-center">
          <h2 className="admin-dashboard-stat-title text-lg font-semibold mb-2">Products</h2>
          <p className="admin-dashboard-stat-value text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="admin-dashboard-stat bg-admin-dashboard-stat-bg p-6 rounded-lg shadow text-center">
          <h2 className="admin-dashboard-stat-title text-lg font-semibold mb-2">Customers</h2>
          <p className="admin-dashboard-stat-value text-2xl font-bold">{stats.totalCustomers}</p>
        </div>
      </div>

      <div className="admin-dashboard-content grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="admin-dashboard-recent-orders bg-admin-dashboard-section-bg p-6 rounded-lg shadow">
          <h3 className="admin-dashboard-section-title text-xl font-semibold mb-4">Recent Orders</h3>
          <table className="admin-dashboard-recent-orders-table w-full">
            <thead>
              <tr>
                <th className="admin-dashboard-recent-orders-th">Order ID</th>
                <th className="admin-dashboard-recent-orders-th">Customer</th>
                <th className="admin-dashboard-recent-orders-th">Amount</th>
                <th className="admin-dashboard-recent-orders-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id} className="admin-dashboard-recent-order">
                  <td className="admin-dashboard-recent-orders-td">{order._id}</td>
                  <td className="admin-dashboard-recent-orders-td">{order.user?.username || 'Unknown'}</td>
                  <td className="admin-dashboard-recent-orders-td">{formatPrice(order.total)}</td>
                  <td className="admin-dashboard-recent-orders-td">
                    <span className={`admin-dashboard-order-status badge ${
                      order.status === "Delivered" ? "badge-success" :
                      order.status === "Processing" ? "badge-warning" :
                      order.status === "Shipped" ? "badge-primary" :
                      "badge-secondary"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="admin-dashboard-top-products bg-admin-dashboard-section-bg p-6 rounded-lg shadow">
          <h3 className="admin-dashboard-section-title text-xl font-semibold mb-4">Top Products</h3>
          <div className="admin-dashboard-top-products-list space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="admin-dashboard-top-product flex justify-between items-center">
                <div>
                  <p className="admin-dashboard-product-name font-semibold">{product.name}</p>
                  <p className="admin-dashboard-product-sales text-sm text-gray-600">Sales: {product.sales}</p>
                </div>
                <p className="admin-dashboard-product-revenue font-semibold">{formatPrice(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;