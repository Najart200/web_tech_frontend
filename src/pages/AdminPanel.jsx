import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminData, deleteResource, deleteBooking, deleteUser, updateResource, updateBooking, updateUser, addResource } from '../api'; // 👈 we'll create these APIs
import '../Adminpanel.css'; // Importing the CSS file

export default function AdminDashboard() {
  const [data, setData] = useState({ users: [], bookings: [], resources: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null); // { type, item }
  const [addingResource, setAddingResource] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'admin') {
      setError('Unauthorized: Admins only');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    fetchData();
  }, [navigate, role]);

  const fetchData = () => {
    fetchAdminData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      if (type === 'resource') await deleteResource(id);
      if (type === 'booking') await deleteBooking(id);
      if (type === 'user') await deleteUser(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(`Failed to delete ${type}.`);
    }
  };

  const handleEdit = (type, item) => {
    setEditingItem({ type, item });
  };

  const handleEditSave = async (type, updatedItem) => {
    try {
      if (type === 'resource') await updateResource(updatedItem);
      if (type === 'booking') await updateBooking(updatedItem);
      if (type === 'user') await updateUser(updatedItem);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(`Failed to update ${type}.`);
    }
  };

  const handleAddResource = async (resource) => {
    try {
      await addResource(resource);
      setAddingResource(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add resource.');
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (loading) return <div className="loading-message">Loading Admin Dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h1 className="header">Admin Dashboard</h1>

      {/* Add New Resource Button */}
      <div className="add-resource-container">
        {addingResource ? (
          <AddResourceForm onSave={handleAddResource} onCancel={() => setAddingResource(false)} />
        ) : (
          <button onClick={() => setAddingResource(true)} className="btn add-resource-btn">
            + Add Resource
          </button>
        )}
      </div>

      {/* Resources Section */}
      <Section
        title="Resources"
        items={data.resources}
        type="resource"
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* Bookings Section */}
      <Section
        title="Bookings"
        items={data.bookings}
        type="booking"
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* Users Section */}
      <Section
        title="Users"
        items={data.users}
        type="user"
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* Edit Form Modal */}
      {editingItem && (
        <EditForm
          type={editingItem.type}
          item={editingItem.item}
          onSave={handleEditSave}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

// Section component
function Section({ title, items, type, handleDelete, handleEdit }) {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      <ul className="section-list">
        {items.map((item) => (
          <li key={item.id} className="section-item">
            {Object.entries(item).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
            <div className="item-actions">
              <button className="btn edit-btn" onClick={() => handleEdit(type, item)}>Edit</button>
              <button className="btn delete-btn" onClick={() => handleDelete(type, item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// EditForm component
function EditForm({ type, item, onSave, onCancel }) {
  const [formData, setFormData] = useState(item);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit {type}</h2>
        {Object.keys(item).filter(key => key !== 'id').map((key) => (
          <div key={key}>
            <label className="input-label">{key}</label>
            <input
              className="input-field"
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="modal-actions">
          <button className="btn save-btn" onClick={() => onSave(type, formData)}>Save</button>
          <button className="btn cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// AddResourceForm component
function AddResourceForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-resource-form">
      <h2>Add New Resource</h2>
      <input
        className="input-field"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        className="input-field"
        placeholder="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      <div className="form-actions">
        <button className="btn add-btn" onClick={() => onSave(formData)}>Add</button>
        <button className="btn cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
