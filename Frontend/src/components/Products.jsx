import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = () => {
    fetch(`${API_BASE}/products/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then(setProducts)
      .catch(err => setError(err.message));
  };
  useEffect(fetchProducts, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name,
      sku: form.sku,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity)
    };
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_BASE}/products/${editId}` : `${API_BASE}/products/`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || 'Operation failed');
        }
        setMessage(editId ? 'Product updated!' : 'Product added!');
        setForm({ name: '', sku: '', price: '', quantity: '' });
        setEditId(null);
        fetchProducts();
      })
      .catch(err => setError(err.message));
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setEditId(product.id);
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ name: '', sku: '', price: '', quantity: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Delete failed');
          fetchProducts();
          setMessage('Product deleted');
        })
        .catch(err => setError(err.message));
    }
  };

  return (
    <div>
      <h2>Products</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md">
            <input
              className="form-control"
              placeholder="Product name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
          </div>
          <div className="col-md">
            <input
              className="form-control"
              placeholder="SKU / Code"
              value={form.sku}
              onChange={e => setForm({...form, sku: e.target.value})}
              required
            />
          </div>
          <div className="col-md">
            <input
              className="form-control"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Price"
              value={form.price}
              onChange={e => setForm({...form, price: e.target.value})}
              required
            />
          </div>
          <div className="col-md">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Quantity"
              value={form.quantity}
              onChange={e => setForm({...form, quantity: e.target.value})}
              required
            />
          </div>
          <div className="col-md-auto">
            <button type="submit" className="btn btn-primary me-1">
              {editId ? 'Update' : 'Add'}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.quantity}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;