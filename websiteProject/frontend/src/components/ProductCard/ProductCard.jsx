import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
    return (
        <Link to={`/product/${product.id}`} className="product-card"> {/* Przeniesienie Link na cały box */}
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p className="price">{product.price.toFixed(2)} zł</p> {/* Formatowanie ceny */}
        </Link>
    );
}

export default ProductCard;
