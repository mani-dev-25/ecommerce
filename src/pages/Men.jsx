import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProductGrid from "../components/products/ProductGrid";
import FiltersSidebar from "../components/products/FiltersSidebar";
import { api } from "../utils/api";
import { toast } from "react-toastify";

function Men() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPrice, setSelectedPrice] = useState(50000);
  const [selectedSize, setSelectedSize] = useState("");

  const page = parseInt(searchParams.get("page") || "1", 10);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `?category=Men&page=${page}&limit=12`;
      if (selectedSize) query += `&size=${encodeURIComponent(selectedSize)}`;
      if (selectedPrice < 50000) query += `&maxPrice=${selectedPrice}`;

      const data = await api.getProductsCustom(query);
      setProductsList(data.products);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to load Men's products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [selectedPrice, selectedSize, page]);

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set("page", newPage);
      return prev;
    });
  };

  return (
    <Layout>
      <section className="container-fluid py-4">
        <div className="row">
          <div className="col-md-3">
            <FiltersSidebar
              showCategory={false}
              selectedCategory={[]}
              setSelectedCategory={() => {}}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>

          <div className="col-md-9">
            <h2 className="mb-4">Men's Collection</h2>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : productsList.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h4>No products found matching your filters.</h4>
              </div>
            ) : (
              <ProductGrid productList={productsList} />
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5 mb-4">
                <button
                  className="btn btn-outline-dark me-2"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </button>
                <span className="align-self-center mx-3 fw-bold">Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  className="btn btn-outline-dark ms-2"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Men;