import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardCards from '../../components/admin/DashboardCards';

const Dashboard = () => {
  return (
    <AdminLayout>
      <DashboardCards />
    </AdminLayout>
  );
};

export default Dashboard;