import React, { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Notebook: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // Загрузка записей из localStorage при монтировании компонента
  useEffect(() => {
    const savedNotes = localStorage.getItem('notebookNotes');
    const savedNextId = localStorage.getItem('notebookNextId');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedNextId) {
      setNextId(parseInt(savedNextId));
    }
  }, []);

  // Сохранение записей в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('notebookNotes', JSON.stringify(notes));
    localStorage.setItem('notebookNextId', nextId.toString());
  }, [notes, nextId]);

  // Загрузка текущей заметки при изменении currentNoteId
  useEffect(() => {
    if (currentNoteId !== null) {
      const note = notes.find(note => note.id === currentNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    } else {
      setTitle('');
      setContent('');
    }
 }, [currentNoteId, notes]);

  const createNewNote = () => {
    const newId = nextId;
    const newNote: Note = {
      id: newId,
      title: 'Новая запись',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes([newNote, ...notes]);
    setNextId(newId + 1);
    setCurrentNoteId(newNote.id);
    setTitle(newNote.title);
    setContent(newNote.content);
  };

  const saveCurrentNote = () => {
    if (currentNoteId === null) {
      alert('Нет активной записи для сохранения!');
      return;
    }

    if (!title.trim()) {
      alert('Заголовок не может быть пустым!');
      return;
    }

    setNotes(notes.map(note => {
      if (note.id === currentNoteId) {
        return {
          ...note,
          title,
          content,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    }));
  };

  const deleteCurrentNote = () => {
    if (currentNoteId === null) {
      alert('Нет активной записи для удаления!');
      return;
    }

    const note = notes.find(note => note.id === currentNoteId);
    if (note && confirm(`Вы уверены, что хотите удалить запись "${note.title}"?`)) {
      setNotes(notes.filter(note => note.id !== currentNoteId));
      setCurrentNoteId(null);
      setTitle('');
      setContent('');
    }
  };

  const loadNoteToEditor = (id: number) => {
    setCurrentNoteId(id);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 24));

    if (diffDays === 1) {
      return 'Сегодня';
    } else if (diffDays === 2) {
      return 'Вчера';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} дн. назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="notebook-container">
      {/* Левое меню со списком записей */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>📝 Мой блокнот</h2>
        </div>
        
        {/* Поисковая строка */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по записям..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Список записей */}
        <div className="notes-list" id="notesList">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note: Note) => (
              <div
                key={note.id}
                className={`note-item ${currentNoteId === note.id ? 'active' : ''}`}
                onClick={() => loadNoteToEditor(note.id)}
              >
                <div className="note-title">{note.title}</div>
                <div className="note-preview">
                  {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                </div>
                <div className="note-date">{formatDate(note.updatedAt)}</div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              {searchTerm ? 'Ничего не найдено' : 'Записей пока нет'}
            </div>
          )}
        </div>
        
        {/* Кнопка создания новой записи */}
        <button
          className="add-note-btn"
          onClick={createNewNote}
          title="Создать новую запись"
        >
          +
        </button>
      </div>
      
      {/* Основная область редактирования */}
      <div className="main-content">
        {/* Заголовок редактора с действиями */}
        <div className="editor-header">
          <div className="editor-title">
            <span id="editorTitle">{currentNoteId !== null ? title : 'Редактор записей'}</span>
          </div>
          <div className="editor-actions">
            <button className="action-btn new-btn" onClick={createNewNote}>
              📄 Новая
            </button>
            <button className="action-btn save-btn" onClick={saveCurrentNote}>
              💾 Сохранить
            </button>
            <button className="action-btn delete-btn" onClick={deleteCurrentNote}>
              🗑️ Удалить
            </button>
          </div>
        </div>
        
        {/* Поле ввода заголовка */}
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Введите заголовок записи..."
        />
        
        {/* Поле для текста записи */}
        <textarea
          className="content-textarea"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          placeholder="Начните писать вашу запись..."
        />
        
        {/* Состояние пустого блокнота */}
        {currentNoteId === null && notes.length === 0 && (
          <div className="empty-state" id="emptyState">
            <div className="empty-state-icon">📖</div>
            <h3>Ваш блокнот пуст</h3>
            <p>Создайте первую запись, чтобы начать работу с блокнотом</p>
            <button className="action-btn new-btn" onClick={createNewNote}>
              Создать запись
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notebook;