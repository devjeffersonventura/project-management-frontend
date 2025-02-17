import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import ProjectTable from './ProjectTable';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Projetos</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/project/new')}
          startIcon={<Add />}
        >
          Novo Projeto
        </Button>
      </Box>
      <ProjectTable />
      {/* Adicionar mais componentes do dashboard conforme necessário */}
    </Box>
  );
};

export default Dashboard; 