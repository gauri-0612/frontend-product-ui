import { useState } from 'react';

export default function TaskList({ tasks, user, onEdit, onDelete, onStatusChange }) {
  const [filter, setFilter] = useState('all');
  const isAdmin = user?.role === 'admin';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        
        {/* Filter */}
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Admin/User info */}
      {isAdmin && (
        <div className="bg-blue-50 px-4 py-2 rounded mb-4">
          <p className="text-blue-700 text-sm">
            👑 Admin: You can see all tasks
          </p>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tasks found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Priority</th>
                {isAdmin && <th className="px-4 py-2 text-left">User</th>}
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="px-4 py-3 font-medium">{task.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{task.priority}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">User #{task.user_id}</td>
                  )}
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => onStatusChange(task.id, 'completed')}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}