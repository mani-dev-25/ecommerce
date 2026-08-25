import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar({
  placeholder = "Search products..."
}) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) {
      navigate("/products");
      return;
    }
    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />

      <button
        className="search-btn"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;