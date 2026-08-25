import AdminLayout from "../../components/admin/AdminLayout";

import ProductTable from "../../components/admin/ProductTable";

function AdminProducts() {

  return (

    <AdminLayout>

      <h2 className="mb-4">
        Products
      </h2>

      <ProductTable />

    </AdminLayout>

  );
}

export default AdminProducts;