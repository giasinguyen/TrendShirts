import React from 'react';

const ProductFilters = () => {
  return (
    <div className="product-filters">
      <h2>Filter Products</h2>
      <form>
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select id="category" name="category">
            <option value="all">All</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="price">Price Range:</label>
          <input type="range" id="price" name="price" min="0" max="1000" />
        </div>
        <div className="filter-group">
          <label htmlFor="brand">Brand:</label>
          <select id="brand" name="brand">
            <option value="all">All</option>
            <option value="brand1">Brand 1</option>
            <option value="brand2">Brand 2</option>
          </select>
        </div>
        <button type="submit">Apply Filters</button>
      </form>
    </div>
  );
};

export default ProductFilters;