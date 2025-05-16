import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('http://127.0.0.1:8000/api/todos/')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Error fetching todos:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    const todoData = {
      title: newTodo,
      completed: false,
    };

    fetch('http://127.0.0.1:8000/api/todos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    })
      .then((response) => {
        if (response.ok) {
          setNewTodo('');
          fetchTodos();
        } else {
          console.error('Failed to add todo');
        }
      })
      .catch((error) => console.error('Error posting todo:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
      method: 'DELETE',
    })
      .then(() => fetchTodos())
      .catch((error) => console.error('Error deleting todo:', error));
  };

  const handleToggle = (todo) => {
    fetch(`http://127.0.0.1:8000/api/todos/${todo.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...todo,
        completed: !todo.completed,
      }),
    })
      .then(() => fetchTodos())
      .catch((error) => console.error('Error toggling todo:', error));
  };

  const handleEdit = (todo) => {
    fetch(`http://127.0.0.1:8000/api/todos/${todo.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...todo,
        title: editText,
      }),
    })
      .then(() => {
        setEditId(null);
        setEditText('');
        fetchTodos();
      })
      .catch((error) => console.error('Error editing todo:', error));
  };

  return (
    <div className="container">
      <h1>My To-Do List</h1>

      {/* Add Todo Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          style={{
            padding: '10px',
            width: '80%',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </form>

      {/* Todo List */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEdit(todo);
                    }
                  }}
                />
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  onClick={() => handleToggle(todo)}
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => {
                    setEditId(todo.id);
                    setEditText(todo.title);
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  style={{ marginLeft: '10px' }}
                >
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
