import React from "react";
import "./products.css";

function FiltersSidebar({
  showCategory = true,
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
  selectedSize,
  setSelectedSize
}) {
  const handleCategory = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setSelectedCategory([
        ...selectedCategory,
        value
      ]);
    } else {
      setSelectedCategory(
        selectedCategory.filter(
          (item) => item !== value
        )
      );
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow-sm">
      <h4 className="mb-4">
        Filters
      </h4>

      {/* Category */}
      {showCategory && (
        <div className="mb-4">
          <h6>Category</h6>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value="Men"
              checked={selectedCategory.includes("Men")}
              onChange={handleCategory}
            />
            <label className="form-check-label">
              Men
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value="Women"
              checked={selectedCategory.includes("Women")}
              onChange={handleCategory}
            />
            <label className="form-check-label">
              Women
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value="Electronics"
              checked={selectedCategory.includes("Electronics")}
              onChange={handleCategory}
            />
            <label className="form-check-label">
              Electronics
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value="Sports"
              checked={selectedCategory.includes("Sports")}
              onChange={handleCategory}
            />
            <label className="form-check-label">
              Sports
            </label>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="mb-4">
        <h6>Price Range</h6>

        <input
          type="range"
          className="form-range"
          min="500"
          max="50000"
          step="500"
          value={selectedPrice}
          onChange={(e) =>
            setSelectedPrice(Number(e.target.value))
          }
        />

        <p className="mt-2">
          Up To: ₹{selectedPrice.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Size */}
      <div className="mb-4">
        <h6>Size</h6>

        <button
          className={`btn btn-sm me-2 ${
            selectedSize === "S"
              ? "btn-dark"
              : "btn-outline-dark"
          }`}
          onClick={() => setSelectedSize("S")}
        >
          S
        </button>

        <button
          className={`btn btn-sm me-2 ${
            selectedSize === "M"
              ? "btn-dark"
              : "btn-outline-dark"
          }`}
          onClick={() => setSelectedSize("M")}
        >
          M
        </button>

        <button
          className={`btn btn-sm ${
            selectedSize === "L"
              ? "btn-dark"
              : "btn-outline-dark"
          }`}
          onClick={() => setSelectedSize("L")}
        >
          L
        </button>

        <button
          className="btn btn-danger btn-sm ms-2"
          onClick={() => setSelectedSize("")}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default FiltersSidebar;