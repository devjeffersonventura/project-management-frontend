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

interface TaskData {
  title: string;
  description: string;
  creation_date: string;
  completion_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  project_id: number;
}

interface AddTaskModalProps {
  open: boolean;
  projectId: number;
  onClose: () => void;
  onSave: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  projectId,
  onClose,
  onSave,
}) => {
  const { token } = useAuth();
  const [task, setTask] = useState<TaskData>({
    title: '',
    description: '',
    creation_date: '',
    completion_date: '',
    status: 'pending',
    project_id: projectId,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.title || !task.creation_date || !task.completion_date) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/v1/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Erro ao criar a tarefa. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
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
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            margin="normal"
            inputProps={{ maxLength: 255 }}
          />
          <TextField
            fullWidth
            label="Descrição"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            required
            type="date"
            label="Data de Criação"
            value={task.creation_date}
            onChange={(e) => setTask({ ...task, creation_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            required
            type="date"
            label="Data de Conclusão"
            value={task.completion_date}
            onChange={(e) => setTask({ ...task, completion_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: task.creation_date }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={task.status}
              label="Status"
              onChange={(e: SelectChangeEvent) => 
                setTask({ 
                  ...task, 
                  status: e.target.value as TaskData['status']
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

export default AddTaskModal; 