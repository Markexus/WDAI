import axiosInstance from "../../utils/axiosConfig";
import { useState } from "react";
import "./CartItem.css";

function CartItem({item, onRemoveItem, onUpdateCart}) {
    const [quantity, setQuantity] = useState(item.quantity);

    // Obługa zmiany ilości
    const handleQuantityChange = async(newQuantity) => {
        const token = localStorage.getItem("accessToken");
        if (newQuantity < 1) return;

        try {
            await axiosInstance.post("api/cart", {
                productId: item.productId,
                quantity: newQuantity,
            }, {
                headers: {
                    "x-auth-token": token,
                },
            });

            setQuantity(newQuantity);
            onUpdateCart();
        } catch(error) {
            console.error(console.error("Błąd podczas aktualizacji ilości:" + error.response?.data?.message || error.message));
        }
    };

    // Usuwanie produktu z koszyka
    const handleRemoveItem = async () => {
        const token = localStorage.getItem("accessToken");

        try {
            await axiosInstance.delete(`api/cart/${item.product.id}`, {
                headers: {
                    "x-auth-token": token
                }
            });

            onRemoveItem(item.product.id);
        } catch (error) {
            console.error("Błąd podczas usuwania produktu:", error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="cart-item">
            <img src={item.product.image} alt={item.product.title} className="cart-item-image" />
            <div className="cart-item-details">
                <h3>{item.product.title}</h3>
                <p>Cena: {(item.product.price * quantity).toFixed(2)} zł</p>
                <div className="cart-item-actions">
                    <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <span className="quantity">{quantity}</span>
                    <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= item.product.availableQuantity}
                    >
                        +
                    </button>
                </div>
                <button className="remove-btn" onClick={handleRemoveItem}>
                    Usuń
                </button>
            </div>
        </div>
    );
}

export default CartItem;