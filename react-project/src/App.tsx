import React, { useState } from 'react';
import Checklist from './components/Checklist';
import Notebook from './components/Notebook';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'checklist' | 'notebook'>('checklist');

  return (
    <div className="App">
      <header className="app-header">
        <h1>React Проект</h1>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'checklist' ? 'active' : ''}
            onClick={() => setActiveTab('checklist')}
          >
            Чеклист
          </button>
          <button 
            className={activeTab === 'notebook' ? 'active' : ''}
            onClick={() => setActiveTab('notebook')}
          >
            Блокнот
          </button>
        </div>
      </header>
      
      <main className="app-main">
        {activeTab === 'checklist' ? <Checklist /> : <Notebook />}
      </main>
    </div>
  );
}

export default App;