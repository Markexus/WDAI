import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import "./ProductPage.css";

function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [cartMessage, setCartMessage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/products/${id}`);
                setProduct(data.product);
            } catch (err) {
                console.error("Błąd pobierania szczegółów produktu:", err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return <h1>Ładowanie produktu...</h1>;
    }

    // Obsługa dodania przedmiotu do koszyka
    const addToCart = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setCartMessage("Zaloguj się, aby dodać produkt do koszyka");
            return;
        }
        try {
            const res = await axiosInstance.post(`/api/cart`,
                {productId: id, quantity: 1},
                {headers: {"x-auth-token": token}})
            
            setCartMessage("Produkt został dodany do koszyka");
        } catch (err) {
            setCartMessage("Błąd podczas dodawania do koszyka");
            console.error("Błąd podczas dodawania do koszyka", err.response?.data?.message);
        }
    };

    return (
        <div className="product-page">
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-details">
                <h1>{product.title}</h1>
                <p className="price">Cena: {product.price?.toFixed(2)} zł</p>
                <p className="category">Kategoria: {product.category}</p>
                <p className="description">{product.description}</p>
                <p className="average-rating">Ocena produktu: <span className="bold">{product.rating.toFixed(2)}</span></p>
                <p className="rating">
                    <Link to={`/reviews/${id}`}>
                        Opinie o produkcie
                    </Link>
                </p>
                <p className="availability">
                    Dostępność:{" "}
                    {product.availableQuantity > 0
                        ? `W magazynie (${product.availableQuantity} szt.)`
                        : "Brak w magazynie"}
                </p>
                <button
                    className="add-to-cart"
                    disabled={product.availableQuantity <= 0}
                    onClick={addToCart}
                >
                    {product.availableQuantity > 0 ? "Dodaj do koszyka" : "Wyprzedane"}
                </button>
                <p className="cart-message">{cartMessage}</p>
            </div>
        </div>
    );
}

export default ProductPage;
