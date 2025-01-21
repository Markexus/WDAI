import { useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
    const [formData, setFormData] = useState({
        street: "",
        apartmentNumber: "",
        city: "",
        postalCode: "",
        country: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("accessToken");

        if (!token) {
            setError("Musisz być zalogowany, aby złożyć zamówienie.");
            return;
        }

        try {
            await axiosInstance.post(
                "api/orders/createOrder",
                { shippingAddress: formData },
                {
                    headers: {
                        "x-auth-token": token,
                    },
                }
            );

            // Po złożeniu zamówienia przeniesienie na stronę podziękowania
            navigate("/thank-you");
        } catch (err) {
            setError(err.response?.data?.message || "Nie udało się złożyć zamówienia.");
        }
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="Checkout">
            <h2>Wypełnij dane adresowe</h2>
            <form onSubmit={handleOrderSubmit} className="checkout-form">
                <label className='checkout-label'>
                    Ulica:
                    <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="Wpisz nazwę ulicy"
                        required
                        className="checkout-input"
                    />
                </label>
                <label className='checkout-label'>
                    Numer mieszkania:
                    <input
                        type="text"
                        name="apartmentNumber"
                        value={formData.apartmentNumber}
                        onChange={handleInputChange}
                        placeholder="Wpisz numer mieszkania"
                        required
                        className="checkout-input"
                    />
                </label>
                <label className="checkout-label">
                    Miasto:
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Wpisz nazwę miasta"
                        required
                        className="checkout-input"
                    />
                </label>
                <label className='checkout-label'>
                    Państwo:
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Wpisz nazwę państwa"
                        required
                        className="checkout-input"
                    />
                </label>
                <label className='checkout-label'>
                    Kod pocztowy:
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Wpisz kod pocztowy"
                        required
                        className="checkout-input"
                    />
                </label>
                <button type="submit" className="checkout-button">
                    Złóż zamówienie
                </button>
            </form>
        </div>
    );
}

export default Checkout;