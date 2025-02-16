import React from 'react';
import { Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjectDetails from '../components/ProjectDetails';
import ProjectForm from '../components/ProjectForm';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {id ? <ProjectDetails /> : <ProjectForm />}
      </Container>
    </Box>
  );
};

export default ProjectPage; 