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

interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'planned' | 'in_progress' | 'completed';
  cep: string;
  location: string;
}

interface ViaCepResponse {
  cep: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface EditProjectModalProps {
  open: boolean;
  project: Project;
  onClose: () => void;
  onSave: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  project,
  onClose,
  onSave,
}) => {
  const { token } = useAuth();
  const [editedProject, setEditedProject] = useState<Project>(project);
  const [error, setError] = useState('');

  const formatAddress = (data: ViaCepResponse): string => {
    if (data.erro) {
      return '';
    }
    
    return `${data.localidade}/${data.uf}`;
  };

  const handleCepChange = async (cep: string) => {
    setEditedProject(prev => ({ ...prev, cep }));

    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        setEditedProject(prev => ({ ...prev, location: '' }));
        return;
      }

      const formattedAddress = formatAddress(data);
      setEditedProject(prev => ({ ...prev, location: formattedAddress }));
      setError('');
      
    } catch (error) {
      setError('Erro ao buscar CEP');
      setEditedProject(prev => ({ ...prev, location: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/v1/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProject),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Projeto</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            required
            label="Nome"
            value={editedProject.name}
            onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
            margin="normal"
            inputProps={{ maxLength: 255 }}
          />
          <TextField
            fullWidth
            label="Descrição"
            value={editedProject.description}
            onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            required
            type="date"
            label="Data de Início"
            value={editedProject.start_date}
            onChange={(e) => setEditedProject({ ...editedProject, start_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            required
            type="date"
            label="Data de Término"
            value={editedProject.end_date}
            onChange={(e) => setEditedProject({ ...editedProject, end_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: editedProject.start_date }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={editedProject.status}
              label="Status"
              onChange={(e: SelectChangeEvent) => 
                setEditedProject({ 
                  ...editedProject, 
                  status: e.target.value as Project['status']
                })
              }
            >
              <MenuItem value="planned">Planejado</MenuItem>
              <MenuItem value="in_progress">Em Andamento</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="CEP"
            value={editedProject.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            margin="normal"
            inputProps={{ maxLength: 8 }}
            placeholder="Digite apenas números"
          />
          <TextField
            fullWidth
            label="Localização"
            value={editedProject.location}
            onChange={(e) => setEditedProject({ ...editedProject, location: e.target.value })}
            margin="normal"
            InputProps={{
              readOnly: false,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProjectModal; 