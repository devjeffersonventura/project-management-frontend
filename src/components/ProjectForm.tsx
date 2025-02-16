import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  SelectChangeEvent,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface ProjectData {
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

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [error, setError] = useState('');
  const [project, setProject] = useState<ProjectData>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planned',
    cep: '',
    location: '',
  });

  const formatAddress = (data: ViaCepResponse): string => {
    if (data.erro) {
      return '';
    }
    
    return `${data.localidade}/${data.uf}`;
  };

  const handleCepChange = async (cep: string) => {
    setProject(prev => ({ ...prev, cep }));

    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        setProject(prev => ({ ...prev, location: '' }));
        return;
      }

      const formattedAddress = formatAddress(data);
      setProject(prev => ({ ...prev, location: formattedAddress }));
      setError('');
      
    } catch (error) {
      setError('Erro ao buscar CEP');
      setProject(prev => ({ ...prev, location: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project.name || !project.start_date || !project.end_date) {
      setError('Please fill in all required fields');
      return;
    }

    if (project.end_date < project.start_date) {
      setError('End date must be after start date');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/v1/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error creating project');
      }

      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating project');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Novo Projeto
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Nome"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            margin="normal"
            inputProps={{ maxLength: 255 }}
          />
          <TextField
            fullWidth
            label="Descrição"
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            required
            type="date"
            label="Data de Início"
            value={project.start_date}
            onChange={(e) => setProject({ ...project, start_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            required
            type="date"
            label="Data de Término"
            value={project.end_date}
            onChange={(e) => setProject({ ...project, end_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: project.start_date }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status *</InputLabel>
            <Select
              labelId="status-label"
              value={project.status}
              label="Status"
              onChange={(e: SelectChangeEvent) => 
                setProject({ 
                  ...project, 
                  status: e.target.value as ProjectData['status']
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
            value={project.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            margin="normal"
            inputProps={{ maxLength: 8 }}
            placeholder="Digite apenas números"
          />
          <TextField
            fullWidth
            label="Localização"
            value={project.location}
            onChange={(e) => setProject({ ...project, location: e.target.value })}
            margin="normal"
            InputProps={{
              readOnly: false,
            }}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Criar Projeto
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectForm; 