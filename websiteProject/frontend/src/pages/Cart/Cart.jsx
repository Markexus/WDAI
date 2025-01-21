import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import CartItem from "../../components/CartItem/CartItem";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState("");
    const [error, setError] = useState(null);

    // Pobranie koszyka danego użytkownika
    const fetchCart = async() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setError("Musisz się zalogować, aby zobaczyć swój koszyk.");
            return;
        }

        try {
            const res = await axiosInstance.get("api/cart/", {
                headers: {
                    "x-auth-token": token,
                },
            });

            setCart(res.data.cart);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Nie udało się pobrać koszyka.");
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateCart = () => {
        fetchCart();
    };

    const handleRemoveItem = (productId) => {
        setCart(cart.cartItems.filter((item) => {
            return item.product.id !== productId
        }));
        fetchCart();
    };

    // Funkcja do obliczania łącznej ceny w koszyku
    const calculateTotalPrice = () => {
        if (!cart || !cart.cartItems) return 0;
        return cart.cartItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    };

    const handleCheckout = () => {
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            setError("Nie możesz przejść do wypełnienia danych, koszyk jest pusty.");
            return;
        }
        navigate("/checkout"); // Przeniesienie na stronę checkout
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="Cart">
            {error && <p className="error">{error}</p>}
            <h2>Twój Koszyk</h2>
            {!cart || !cart.cartItems || cart.cartItems.length === 0 ? (
                <p>Koszyk jest pusty.</p>
            ) : (
                <ul>
                    {cart.cartItems.map((item) => (
                        <CartItem key={item.id} item={item} onUpdateCart={handleUpdateCart} onRemoveItem={handleRemoveItem}/>
                    ))}
                </ul>
            )}

                    <div className="cart-total">
                        <h3>Łączna cena: {calculateTotalPrice().toFixed(2)} zł</h3>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Przejdź do wypełnienia danych
                        </button>
                    </div>
        </div>
    );
}

export default Cart;