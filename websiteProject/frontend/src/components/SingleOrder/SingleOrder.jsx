import "./SingleOrder.css";
import { useNavigate } from "react-router-dom";

function SingleOrder({ order }) {
    const orderDate = new Date(order.createdAt);
    const navigate = useNavigate();

    return (
        <div className="single-order">
            <div className="order-info">
                <p>Numer zamówienia: <span className="bold">{order._id}</span></p>
                <p>Data złożenia: <span className="bold">{orderDate.toISOString().split('T')[0]}</span></p>
            </div>

            <div>
                <p>Status: <span className="bold">{order.status}</span></p>
                <button onClick={() => navigate(`/order/${order.id}`)}>Szczegóły zamówienia</button>
            </div>
        </div>
    );
}

export default SingleOrder;