import React, { useState } from "react";
import { formatPrice } from "../utils/helpers";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);

  // This would typically come from an API call
  const mockOrder = {
    id: "123456",
    status: "In Transit",
    estimatedDelivery: "April 10, 2025",
    items: [
      {
        name: "T-Shirt",
        quantity: 1,
        price: 29.99
      },
      {
        name: "Hoodie",
        quantity: 1,
        price: 59.99
      }
    ],
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001"
    },
    trackingHistory: [
      {
        date: "April 1, 2025",
        status: "Order Placed",
        location: "New York, NY"
      },
      {
        date: "April 2, 2025",
        status: "Processing",
        location: "New York, NY"
      },
      {
        date: "April 3, 2025",
        status: "Shipped",
        location: "New York, NY"
      },
      {
        date: "April 5, 2025",
        status: "In Transit",
        location: "Chicago, IL"
      }
    ]
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call
    setTrackedOrder(mockOrder);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>

      <form onSubmit={handleTrackOrder} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your order ID"
            className="input"
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Track Order
          </button>
        </div>
      </form>

      {trackedOrder && (
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <p>Order ID: {trackedOrder.id}</p>
                  <p>Status: <span className="font-semibold">{trackedOrder.status}</span></p>
                  <p>Estimated Delivery: {trackedOrder.estimatedDelivery}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p>{trackedOrder.shippingAddress.name}</p>
                  <p>{trackedOrder.shippingAddress.street}</p>
                  <p>{trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} {trackedOrder.shippingAddress.zip}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking History */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Tracking History</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {trackedOrder.trackingHistory.map((entry, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-black"></div>
                    <div>
                      <p className="font-semibold">{entry.status}</p>
                      <p className="text-sm text-gray-600">{entry.date}</p>
                      <p className="text-sm text-gray-600">{entry.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {trackedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p>{formatPrice(item.price)}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(trackedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking; 