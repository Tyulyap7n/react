import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]); // Список задач
  const [inputValue, setInputValue] = useState(''); // Текст новой задачи

  // URL бэкенда. При переносе на хостинг адрес нужно будет поменять.
  const API_URL = 'http://localhost:8000/tasks';

  // Загрузить задачи с бэкенда при первом запуске компонента
  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setTasks(data));
  }, [API_URL]);

  // Отправить новую задачу на бэкенд
  const addTask = () => {
    if (inputValue.trim() === '') return;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputValue }),
    })
      .then(response => response.json())
      .then(newTask => setTasks([...tasks, newTask]));
    setInputValue('');
  };

  // Удалить задачу
  const deleteTask = (taskId) => {
    fetch(`${API_URL}/${taskId}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task.id !== taskId)));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Список задач</h1>
      <input 
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Новая задача..."
        style={{ padding: '10px', fontSize: '16px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={addTask} style={{ padding: '10px', fontSize: '16px' }}>Добавить</button>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '18px', marginRight: '20px' }}>{task.text}</span>
            <button onClick={() => deleteTask(task.id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
