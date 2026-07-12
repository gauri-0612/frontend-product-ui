import { useState, useEffect } from 'react';
import { authService } from './services/authService';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import api from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks/');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser({
      id: userData.user_id,
      username: userData.username,
      role: userData.role,
    });
    loadTasks();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setTasks([]);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const data = {
        ...taskData,
        user_id: user.id,
      };
      const response = await api.post('/tasks/', data);
      setTasks([...tasks, response.data]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task');
      console.error(err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await api.put(`/tasks/${editingTask.id}`, taskData);
      setTasks(tasks.map(t => t.id === response.data.id ? response.data : t));
      setEditingTask(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete task');
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status });
      setTasks(tasks.map(t => t.id === response.data.id ? response.data : t));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Task Management</h1>
            <p className="text-gray-600">
              Welcome, {user.username} {isAdmin && '(Admin)'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              initialData={editingTask || {}}
              isEditing={!!editingTask}
              user={user}
            />
            {editingTask && (
              <button
                onClick={() => setEditingTask(null)}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <div>
            {loading ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-center text-gray-500">Loading tasks...</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                user={user}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;