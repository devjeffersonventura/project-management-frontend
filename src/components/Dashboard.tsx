import React from 'react';
import ProjectTable from './ProjectTable';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>Meus Projetos</h2>
      <ProjectTable />
      {/* Adicionar mais componentes do dashboard conforme necessário */}
    </div>
  );
};

export default Dashboard; 