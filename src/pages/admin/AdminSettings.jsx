import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";

function AdminSettings() {
  return (
    <AdminLayout>
      <h2 className="mb-4">Settings</h2>
      <div className="card p-5 text-center shadow-sm" style={{ borderRadius: "16px", border: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚙️</div>
        <h4 className="fw-bold mb-2">System Settings</h4>
        <p className="text-muted mb-0">The administrator settings panel is currently under development. Here you will be able to customize store configurations, payment gateways, and system parameters.</p>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;
