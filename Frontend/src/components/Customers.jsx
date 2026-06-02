import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCustomers = () => {
    fetch(`${API_BASE}/customers/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load customers');
        return res.json();
      })
      .then(setCustomers)
      .catch(err => setError(err.message));
  };
  useEffect(fetchCustomers, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    fetch(`${API_BASE}/customers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || 'Could not add customer');
        }
        setMessage('Customer added!');
        setForm({ full_name: '', email: '', phone: '' });
        fetchCustomers();
      })
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer?')) {
      fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Delete failed');
          fetchCustomers();
          setMessage('Customer deleted');
        })
        .catch(err => setError(err.message));
    }
  };

  return (
    <div>
      <h2>Customers</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md">
            <input
              className="form-control"
              placeholder="Full name"
              value={form.full_name}
              onChange={e => setForm({...form, full_name: e.target.value})}
              required
            />
          </div>
          <div className="col-md">
            <input
              className="form-control"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>
          <div className="col-md">
            <input
              className="form-control"
              placeholder="Phone number"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              required
            />
          </div>
          <div className="col-md-auto">
            <button type="submit" className="btn btn-primary">Add Customer</button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c.id)}
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

export default Customers;