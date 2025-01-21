
import SearchBar from "../../components/SearchBar/SearchBar";
import Filters from "../../components/Filters/Filters";
import ProductStage from "../../components/ProductStage/ProductStage";
import "./Home.css";

import axiosInstance from "../../utils/axiosConfig";
import { useEffect, useState } from "react";

function Home() {
  // Tworzenie statów
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchValue, setSearchValue] = useState(""); 
  const [categories, setCategories] = useState([]); 
  const [category, setCategory] = useState(""); 
  const [sortOrder, setSortOrder] = useState(""); 
  const [minPrice, setMinPrice] = useState(""); 
  const [maxPrice, setMaxPrice] = useState(""); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/api/products");
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (err) {
        console.error("Błąd pobierania danych z API: ", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let updatedProducts = products;

    if (searchValue) {
      updatedProducts = updatedProducts.filter((product) =>
        product.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (category) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (minPrice) {
      updatedProducts = updatedProducts.filter(
        (product) => product.price >= minPrice
      );
    }

    if (maxPrice) {
      updatedProducts = updatedProducts.filter(
        (product) => product.price <= maxPrice
      );
    }

    if (sortOrder === "Malejąco") {
      updatedProducts = updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "Rosnąco") {
      updatedProducts = updatedProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchValue, category, products, sortOrder, minPrice, maxPrice]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/api/products/categories");
        setCategories(data.categories);
      } catch (err) {
        console.error("Błąd pobierania kategorii z API: ", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let updatedProducts = [...filteredProducts];

    if (sortOrder === "Malejąco") {
      updatedProducts = updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "Rosnąco") {
      updatedProducts = updatedProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(updatedProducts);
  }, [sortOrder]);

  return (
    <div className="home-container">
      <SearchBar setSearchValue={setSearchValue} />
      <div className="hero">
        <Filters
          categories={categories}
          setCategory={setCategory}
          setSortOrder={setSortOrder}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
        <ProductStage products={filteredProducts} />
      </div>
    </div>
  );
}

export default Home;
