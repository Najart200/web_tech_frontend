import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminData, deleteResource, deleteBooking, deleteUser, updateResource, updateBooking, updateUser, addResource } from '../api'; // 👈 we'll create these APIs

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

  if (error) return <div className="text-red-500 p-5">{error}</div>;
  if (loading) return <div className="text-white p-5 animate-pulse">Loading Admin Dashboard...</div>;

  return (
    <div className="p-5 space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* Add New Resource Button */}
      <div className="flex justify-end mb-6">
        {addingResource ? (
          <AddResourceForm onSave={handleAddResource} onCancel={() => setAddingResource(false)} />
        ) : (
          <button onClick={() => setAddingResource(true)} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-white">
            + Add Resource
          </button>
        )}
      </div>

      {/* Resources */}
      <Section
        title="Resources"
        items={data.resources}
        type="resource"
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* Bookings */}
      <Section
        title="Bookings"
        items={data.bookings}
        type="booking"
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* Users */}
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
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="p-4 bg-gray-800 rounded-xl space-y-2">
            {Object.entries(item).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
            <div className="flex gap-4 mt-2">
              <button className="text-blue-400 hover:underline" onClick={() => handleEdit(type, item)}>Edit</button>
              <button className="text-red-400 hover:underline" onClick={() => handleDelete(type, item.id)}>Delete</button>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-xl space-y-4 w-96">
        <h2 className="text-xl font-bold mb-4">Edit {type}</h2>
        {Object.keys(item).filter(key => key !== 'id').map((key) => (
          <div key={key}>
            <label className="block capitalize">{key}</label>
            <input
              className="w-full p-2 rounded bg-gray-700 text-white"
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="flex justify-end gap-4">
          <button className="bg-green-500 px-4 py-2 rounded-xl" onClick={() => onSave(type, formData)}>Save</button>
          <button className="bg-red-500 px-4 py-2 rounded-xl" onClick={onCancel}>Cancel</button>
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
    <div className="bg-gray-800 p-6 rounded-xl space-y-4 w-full">
      <h2 className="text-xl font-bold mb-4">Add New Resource</h2>
      <input
        className="w-full p-2 rounded bg-gray-700 text-white"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 rounded bg-gray-700 text-white"
        placeholder="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      <div className="flex justify-end gap-4">
        <button className="bg-green-500 px-4 py-2 rounded-xl" onClick={() => onSave(formData)}>Add</button>
        <button className="bg-red-500 px-4 py-2 rounded-xl" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
