import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import EditTaskModal from './EditTaskModal';
import AddTaskModal from './AddTaskModal';

interface ProjectResponse {
  project: string;
  tasks: Task[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'planned' | 'in_progress' | 'completed';
  cep: string;
  location: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  creation_date: string;
  completion_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  project_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Mapeamento de status para português
const statusTranslations = {
  'planned': 'Planejado',
  'in_progress': 'Em Andamento',
  'completed': 'Concluído',
  'pending': 'Pendente'
} as const;

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>('');
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const fetchProject = useCallback(async () => {
    if (!id || !token) return;

    try {
      console.log('Fetching project with id:', id);
      
      const response = await fetch(`http://localhost:8000/v1/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Raw API Response:', result);

      const projectData = result.data || result;
      console.log('Project data to be set:', projectData);

      setProject(projectData);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Erro ao carregar projeto');
    }
  }, [id, token]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/v1/projects/${id}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data: ProjectResponse = await response.json();
        setTasks(data.tasks || []);
      } else {
        setError('Erro ao carregar tarefas');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Erro ao carregar tarefas');
      setTasks([]);
    }
  }, [id, token]);

  useEffect(() => {
    console.log('Effect running with id:', id);
    if (id) {
      fetchProject();
      fetchTasks();
    }
  }, [id, fetchProject, fetchTasks]);

  console.log('Current project state:', project);

  if (!project) {
    return <Typography>Carregando projeto...</Typography>;
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {project.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Descrição
            </Typography>
            <Typography paragraph>
              {project.description}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Data de Início
            </Typography>
            <Typography>
              {project.start_date}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Data de Término
            </Typography>
            <Typography>
              {project.end_date}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip 
              label={statusTranslations[project.status as keyof typeof statusTranslations]} 
              color={
                project.status === 'completed' ? 'success' : 
                project.status === 'in_progress' ? 'primary' : 
                'default'
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              CEP
            </Typography>
            <Typography>
              {project.cep}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Localização
            </Typography>
            <Typography>
              {project.location}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Tarefas</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddTaskModalOpen(true)}
        >
          Adicionar Tarefa
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Data de Conclusão</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{new Date(task.creation_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(task.completion_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={statusTranslations[task.status as keyof typeof statusTranslations]} 
                      color={
                        task.status === 'completed' ? 'success' : 
                        task.status === 'in_progress' ? 'primary' : 
                        'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedTask(task);
                        setIsEditTaskModalOpen(true);
                      }}
                      title="Editar"
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedTask(task);
                        setIsDeleteDialogOpen(true);
                      }}
                      title="Excluir"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma tarefa encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddTaskModal
        open={isAddTaskModalOpen}
        projectId={Number(id)}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSave={() => {
          fetchTasks();
          setIsAddTaskModalOpen(false);
        }}
      />

      {selectedTask && (
        <EditTaskModal
          open={isEditTaskModalOpen}
          task={selectedTask}
          onClose={() => {
            setIsEditTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={() => {
            fetchTasks();
            setIsEditTaskModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}

      {selectedTask && (
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            Tem certeza que deseja excluir esta tarefa?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={() => handleDeleteTask(selectedTask.id)}
              color="error"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ProjectDetails; 