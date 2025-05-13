import React, { useEffect, useState } from 'react';

export default function SalesReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders/admin/total-sales', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profit / Sales Report</h2>
      {loading ? (
        <div>Loading sales report...</div>
      ) : (
        <div className="text-lg">
          <div className="mb-2">Total Sales: <span className="font-bold">${report?.totalSales || 0}</span></div>
          {/* You can add more analytics here, e.g., monthly breakdown, charts, etc. */}
        </div>
      )}
    </div>
  );
}
