import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  updatedAt?: string;
}

const Checklist: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');

 // Загрузка задач из localStorage при монтировании компонента
  useEffect(() => {
    const savedTasks = localStorage.getItem('checklistTasks');
    const savedNextId = localStorage.getItem('checklistNextId');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedNextId) {
      setNextId(parseInt(savedNextId));
    }
  }, []);

  // Сохранение задач в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('checklistTasks', JSON.stringify(tasks));
    localStorage.setItem('checklistNextId', nextId.toString());
  }, [tasks, nextId]);

  const addTask = () => {
    if (!inputValue.trim()) {
      alert('Пожалуйста, введите текст дела!');
      return;
    }

    const newTask: Task = {
      id: nextId,
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setNextId(nextId + 1);
    setInputValue('');
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined
        };
      }
      return task;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="container">
      <h1>📝 Мой чеклист</h1>
      
      {/* Форма для добавления новых задач */}
      <div className="add-task">
        <input
          type="text"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Добавьте новое дело..."
          maxLength={200}
        />
        <button onClick={addTask}>Добавить</button>
      </div>

      {/* Статистика выполнения задач */}
      <div className="task-stats">
        <span>Всего дел: {totalCount}</span>
        <span>Выполнено: {completedCount}</span>
      </div>

      {/* Список задач */}
      <ul id="taskList" className="task-list">
        {tasks.map((task: Task) => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className="task-text">{task.text}</span>
            <div className="task-actions">
              <button className="task-btn delete-btn" onClick={() => deleteTask(task.id)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Сообщение при пустом списке задач */}
      {tasks.length === 0 && (
        <div id="emptyState" className="empty-state">
          <p>🎯 Пока нет дел. Добавьте первое дело!</p>
        </div>
      )}
    </div>
  );
};

export default Checklist;