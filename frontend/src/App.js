import React, { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleAddTask = () => {
    if (!title) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title,
        description,
        deadline,
      },
    ]);

    setTitle('');
    setDescription('');
    setDeadline('');
  };

  const calculateDaysLeft = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const deadlineDate = new Date(dateString);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 flex items-center">
        📝 <span className="ml-2">My To-Do List</span>
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl space-y-4">
        {tasks.map((task) => {
          const daysLeft = calculateDaysLeft(task.deadline);
          const isExpired = daysLeft < 0;

          return (
            <div
              key={task.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
            >
              <div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                {task.description && (
                  <p className="text-gray-600">{task.description}</p>
                )}
                {task.deadline && (
                  <p
                    className={`text-sm font-medium mt-2 ${
                      isExpired ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {isExpired
                      ? 'Expired!'
                      : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
