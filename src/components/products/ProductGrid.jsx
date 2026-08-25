import React from "react";
import ProductCard from "./ProductCard";
import "./products.css";

function ProductGrid({ productList = [] }) {
  const displayProducts = productList;

  return (
    <div className="row">
      {displayProducts.map((product) => (
        <div
          key={product.id}
          className="col-md-3 mb-4"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;