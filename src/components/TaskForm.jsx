import { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, initialData = {}, isEditing = false, user }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    user_id: user?.id || '',
  });

  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const isAdmin = user?.role === 'admin';

  // Load users if admin
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Populate form when editing
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        due_date: initialData.due_date ? initialData.due_date.split('T')[0] : '',
        user_id: initialData.user_id || user?.id || '',
      });
      setSelectedUser(initialData.user_id || '');
    }
  }, [initialData, user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserChange = (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUser(userId);
    setFormData(prev => ({
      ...prev,
      user_id: userId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submitData = {
      title: formData.title,
      description: formData.description || null,
      status: formData.status,
      priority: formData.priority,
      due_date: formData.due_date || null,
      user_id: isAdmin ? formData.user_id : user.id,
    };

    onSubmit(submitData);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
        user_id: user?.id || '',
      });
      setSelectedUser('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Update Task' : 'Create New Task'}
      </h2>

      {/* User selection - only for admin */}
      {isAdmin && !isEditing && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Assign to User
          </label>
          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Due Date
        </label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        {isEditing ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
}