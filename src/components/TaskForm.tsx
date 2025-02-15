import React, { useState } from 'react';

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de criação de tarefa
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Título da Tarefa:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Descrição:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Adicionar Tarefa</button>
    </form>
  );
};

export default TaskForm; 