import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import "./OrderDetails.css";

function OrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState("");
    const [error, setError] = useState("");

    // Pobranie szczegółów zamówienia
    useEffect(() => {
        const fetchOrderDetails = async() => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await axiosInstance.get(`/api/orders/${id}`, {
                    headers: {
                        "x-auth-token": token
                    }
                });

                setOrder(res.data.order2);
            } catch (err) {
                console.error(err);
                setError("Nie udało się pobrać szczegółów zamówienia");
            }
        }

        fetchOrderDetails();
    }, [id, navigate])

    if (error) return <p className="error">{error}</p>;

    if (!order) return <p className="wating">Ładowanie...</p>;

    return (
        <div className="order-details">
            <div className="order-details-header">
                <h2>Numer zamówienia: {order._id}</h2>
                <p>Data złożenia: <span className="bold">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                <p>Status: <span className="bold">{order.status}</span></p>

                <h3 className="underline">Adres dostawy</h3>
                <p>{order.shippingAddress.street} {order.shippingAddress.apartmentNumber}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>

                <h3 className="underline">Łączna kwota: {order.totalPrice} PLN</h3>
            </div>

            <div className="order-items-container">
                <h3 className="order-items-header">Produkty</h3>
                <ul className="order-items">
                    {order.OrderItems.map((item, index) => (
                        <li key={index}>
                            {item.Product.title} - {item.quantity} szt.
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default OrderDetails;