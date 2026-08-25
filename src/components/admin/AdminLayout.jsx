import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="admin-layout">

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main-content">

        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="p-4">

          {children}

        </div>

      </div>

    </div>

  );
};

export default AdminLayout;