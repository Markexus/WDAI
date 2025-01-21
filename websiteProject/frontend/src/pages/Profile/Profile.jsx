import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import SingleOrder from "../../components/SingleOrder/SingleOrder";
import "./Profile.css";

function Profile( { setIsLogged } ) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [user , setUser] = useState(null);

    // Funkcja pobierająca dene o użytkownika
    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem("accessToken");

            // Jeżeli token został usunięty
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                // Zapytanie o dane użytkownika
                const res2 = await axiosInstance.get("/api/auth/profile", {
                    headers: {
                        "x-auth-token": token,
                    },
                });

                setUser(res2.data.name);

                // Zapytanie o zamówienia
                const res = await axiosInstance.get("/api/orders/", {
                    headers: {
                        "x-auth-token": token,
                    },
                });

                setOrders(res.data.orders);

            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Nie udało się pobrać danych użytkownika"); 
            }
        };

        fetchProfileData();
    }, [navigate]);

    // Funkcja do wylogowania
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLogged(false);
        navigate("/login");
    };

    return (
        <div className="profile-page">
            <h2>Witaj {user}!</h2>
            <button onClick={handleLogout}>Wyloguj</button>
            <ul>
              {orders.length === 0 ? <h2>Brak zamówień</h2> : orders.map((order) => (
                <SingleOrder key={order.id} order={order} />
              ))}
            </ul>

            {error && <p>{error}</p>}
        </div>
    );
}

export default Profile; 