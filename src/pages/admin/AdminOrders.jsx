import AdminLayout from "../../components/admin/AdminLayout";

import OrdersTable from "../../components/admin/OrdersTable";

function AdminOrders() {

  return (

    <AdminLayout>

      <h2 className="mb-4">
        Orders
      </h2>

      <OrdersTable />

    </AdminLayout>

  );
}

export default AdminOrders;