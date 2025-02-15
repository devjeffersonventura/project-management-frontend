import React from 'react';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Dashboard />
      </Box>
    </Box>
  );
};

export default DashboardPage; 