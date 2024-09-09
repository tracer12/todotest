import React, { useState } from 'react';

function TodoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const baseUrl = `https://driving-steadily-leopard.ngrok-free.app`;

  const handleInputChange = (e) => setTask(e.target.value);

  const addTodo = () => {
    const newTodo = task.trim();
    if (!newTodo) {
      alert('내용을 입력하세요.');
      return;
    }
    setTasks((prevTasks) => [...prevTasks, newTodo]);
    setTask('');
  };

  const deleteTodo = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const saveTodos = () => {
    if (tasks.length === 0) {
      alert('저장할 항목이 없습니다.');
      return;
    }

    fetch(`${baseUrl}/todolist/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '00000'
      },
      body: JSON.stringify(tasks),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error('저장 중 문제가 발생했습니다. 다시 시도해주세요.');
      })
      .then((data) => alert(`저장 완료! 코드: ${data.code}`))
      .catch((error) => alert(error.message));
  };

  const loadTodos = async () => {
    const code = prompt('코드 6자리를 입력하세요: ');

    if (!code || code.length !== 6) {
      alert('올바른 코드를 입력하세요.');
      return;
    }

    await fetch(`${baseUrl}/todolist/load/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '00000'
      },
    })
      .then(response => response.json())
      .then(response => setTasks(response.todos))
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Todo List</h2>

        <div className="flex mb-4">
          <input
            type="text"
            value={task}
            onChange={handleInputChange}
            placeholder="할 일 입력"
            className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            +
          </button>
        </div>

        <ul className="space-y-2 mb-4">
          {tasks.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 bg-gray-100 rounded-md shadow-sm"
            >
              <span>{todo}</span>
              <button
                onClick={() => deleteTodo(index)}
                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
              >
                x
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between">
          <button
            onClick={saveTodos}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            저장
          </button>
          <button
            onClick={loadTodos}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            불러오기
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
