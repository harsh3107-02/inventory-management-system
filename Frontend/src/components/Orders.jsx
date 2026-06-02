import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: '1' }]
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/orders/`).then(r => r.json()).then(setOrders).catch(console.error);
    fetch(`${API_BASE}/customers/`).then(r => r.json()).then(setCustomers).catch(console.error);
    fetch(`${API_BASE}/products/`).then(r => r.json()).then(setProducts).catch(console.error);
  }, []);

  const addItem = () => setForm({
    ...form,
    items: [...form.items, { product_id: '', quantity: '1' }]
  });

  const removeItem = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items });
  };

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      customer_id: parseInt(form.customer_id),
      items: form.items.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity)
      }))
    };

    fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || 'Order creation failed');
        }
        setMessage('Order placed successfully!');
        setForm({ customer_id: '', items: [{ product_id: '', quantity: '1' }] });
        // refresh orders
        fetch(`${API_BASE}/orders/`).then(r => r.json()).then(setOrders);
      })
      .catch(err => setError(err.message));
  };

  const cancelOrder = (id) => {
    if (window.confirm('Cancel this order?')) {
      fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Cancellation failed');
          fetch(`${API_BASE}/orders/`).then(r => r.json()).then(setOrders);
          setMessage('Order cancelled and stock restored');
        })
        .catch(err => setError(err.message));
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-header">New Order</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Customer</label>
              <select
                className="form-select"
                value={form.customer_id}
                onChange={e => setForm({...form, customer_id: e.target.value})}
                required
              >
                <option value="">-- Select customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            {form.items.map((item, index) => (
              <div className="row mb-2" key={index}>
                <div className="col-7">
                  <select
                    className="form-select"
                    value={item.product_id}
                    onChange={e => updateItem(index, 'product_id', e.target.value)}
                    required
                  >
                    <option value="">-- Select product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)}, {p.quantity} in stock)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-3">
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateItem(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="col-2">
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mt-2"
              onClick={addItem}
            >
              + Add another product
            </button>

            <div className="mt-3">
              <button type="submit" className="btn btn-success">
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>

      <h4>Order History</h4>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div className="card mb-3" key={order.id}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>
                <strong>Order #{order.id}</strong> — {order.customer_name} —{' '}
                {new Date(order.created_at).toLocaleString()}
              </span>
              <span>
                <strong>Total: ${order.total_amount.toFixed(2)}</strong>
                <button
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              </span>
            </div>
            <ul className="list-group list-group-flush">
              {order.items.map(item => (
                <li key={item.id} className="list-group-item">
                  {item.product_name} × {item.quantity} @ ${item.unit_price.toFixed(2)} = $
                  {item.total_price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;