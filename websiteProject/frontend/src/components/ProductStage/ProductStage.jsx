import ProductCard from "../ProductCard/ProductCard";
import "./ProductStage.css";

function ProductStage( { products } ) {
  return (
    <div className="product-stage">
        {products.length > 0 ? products.map(product =>
          (<ProductCard key={product.id} product={product} />)
        ) : <h1>Brak produktów</h1>}
    </div>
  );
}

export default ProductStage;