import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
} from '@mui/material';
import { Edit, Delete, AddTask } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import EditProjectModal from './EditProjectModal';
import AddTaskModal from './AddTaskModal';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'planned' | 'in_progress' | 'completed';
  cep: string;
  location: string;
  user: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

// Mapeamento de status para português
const statusTranslations = {
  'planned': 'Planejado',
  'in_progress': 'Em Andamento',
  'completed': 'Concluído'
} as const;

const ProjectTable: React.FC = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/v1/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const projectsList = result.data || [];
        setProjects(projectsList);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (projectId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== projectId));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data de Início</TableCell>
              <TableCell>Data de Término</TableCell>
              <TableCell>Status</TableCell>
              {user?.role === 'admin' && (
                <TableCell>Criado por</TableCell>
              )}
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Typography
                      onClick={() => navigate(`/project/${project.id}`)}
                      sx={{ 
                        textDecoration: 'none', 
                        cursor: 'pointer',
                        color: 'primary.main',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {project.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={statusTranslations[project.status]} 
                      color={
                        project.status === 'completed' ? 'success' : 
                        project.status === 'in_progress' ? 'primary' : 
                        'default'
                      }
                    />
                  </TableCell>
                  {user?.role === 'admin' && (
                    <TableCell>{project.user?.name || 'N/A'}</TableCell>
                  )}
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedProject(project);
                        setIsEditModalOpen(true);
                      }}
                      title="Editar"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedProject(project);
                        setIsTaskModalOpen(true);
                      }}
                      title="Adicionar Tarefa"
                    >
                      <AddTask />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedProject(project);
                        setIsDeleteDialogOpen(true);
                      }}
                      title="Excluir"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={user?.role === 'admin' ? 7 : 6} align="center">
                  Nenhum projeto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedProject && (
        <>
          <EditProjectModal
            open={isEditModalOpen}
            project={selectedProject}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
            onSave={() => {
              fetchProjects();
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
          />

          <AddTaskModal
            open={isTaskModalOpen}
            projectId={selectedProject.id}
            onClose={() => {
              setIsTaskModalOpen(false);
              setSelectedProject(null);
            }}
            onSave={() => {
              setIsTaskModalOpen(false);
              setSelectedProject(null);
            }}
          />

          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Project</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this project?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => handleDelete(selectedProject.id)}
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ProjectTable; 