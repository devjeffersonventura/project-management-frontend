import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Task } from './ProjectDetails';

interface EditTaskModalProps {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSave: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  open,
  task,
  onClose,
  onSave,
}) => {
  const { token } = useAuth();
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/v1/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTask),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Erro ao atualizar tarefa. Por favor, tente novamente.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            required
            label="Título"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição"
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            required
            type="date"
            label="Data de Criação"
            value={editedTask.creation_date}
            onChange={(e) => setEditedTask({ ...editedTask, creation_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            required
            type="date"
            label="Data de Conclusão"
            value={editedTask.completion_date}
            onChange={(e) => setEditedTask({ ...editedTask, completion_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: editedTask.creation_date }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={editedTask.status}
              label="Status"
              onChange={(e: SelectChangeEvent) => 
                setEditedTask({ 
                  ...editedTask, 
                  status: e.target.value as Task['status']
                })
              }
            >
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="in_progress">Em Andamento</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTaskModal; 