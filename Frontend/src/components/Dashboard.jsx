import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/dashboard`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="text-center mt-5">Loading dashboard...</div>;

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Total Products</div>
            <div className="card-body">
              <h3 className="card-title">{data.total_products}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Total Customers</div>
            <div className="card-body">
              <h3 className="card-title">{data.total_customers}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Total Orders</div>
            <div className="card-body">
              <h3 className="card-title">{data.total_orders}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Low Stock Products</div>
            <div className="card-body">
              <h3 className="card-title">{data.low_stock_products.length}</h3>
              {data.low_stock_products.length > 0 && (
                <small>{data.low_stock_products.join(', ')}</small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;