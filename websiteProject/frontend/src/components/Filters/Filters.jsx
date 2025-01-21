import "./Filters.css";
import { useState } from "react";

function Filters({ categories, setCategory, setSortOrder, setMinPrice, setMaxPrice }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value === selectedCategory ? null : value);
    setCategory(value === selectedCategory ? null : value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="filters">
      <h2>Filters</h2>

      <div className="category-filter">
        <h3>Category</h3>
        {categories.map((category, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="category"
              value={category}
              onChange={handleCategoryChange}
              checked={selectedCategory === category}
            />
            {category}
          </label>
        ))}
      </div>

      <div className="price-filter">
        <h3>Price</h3>
        <label>
          Min: <input type="number" onChange={(event) => setMinPrice(event.target.value)} />
        </label>
        <label>
          Max: <input type="number" onChange={(event) => setMaxPrice(event.target.value)} />
        </label>
      </div>

      <div className="sort-filter">
        <h3>Sortowanie</h3>
        <select onChange={handleSortChange} defaultValue={""}>
          <option value="" disabled hidden>
            Sortuj
          </option>
          <option value="Rosnąco">Rosnąco</option>
          <option value="Malejąco">Malejąco</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
