import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import "./ReviewPage.css";

function ReviewPage() {
    const { productId } = useParams(); // ID produktu z URL
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
    const [message, setMessage] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/reviews/${productId}`);
                setReviews(data.reviews);
            } catch (err) {
                console.error("Błąd podczas pobierania opinii:", err);
                setMessage("Nie udało się załadować opinii.");
            }
        };

const fetchUser = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.log("Brak tokenu JWT w localStorage.");
            return;
        }

        console.log("Pobieranie danych użytkownika z tokenem:", token);

        // Wykonanie żądania do nowego endpointu
        const { data } = await axiosInstance.get("/api/auth/profile", {
            headers: { "x-auth-token": token },
        });

        console.log("Pełne dane użytkownika pobrane z backendu:", data);

        // Ustawienie ID i roli użytkownika
        setUserRole(data.role);
        setUserId(data.id);
    } catch (err) {
        console.error("Błąd podczas pobierania pełnych danych użytkownika:", err.response?.data || err.message);
    }
};

        fetchReviews();
        fetchUser();
    }, [productId]);

    const handleAddReview = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setMessage("Musisz być zalogowany, aby dodać opinię.");
                return;
            }

            await axiosInstance.post(`/api/reviews/${productId}`, newReview, {
                headers: { "x-auth-token": token },
            });

            setMessage("Opinia została dodana.");
            setNewReview({ rating: 0, comment: "" });
            setReviews([...reviews, { ...newReview, productId, userId }]);
        } catch (err) {
            setMessage(err.response?.data?.message || "Błąd podczas dodawania opinii.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            if (!reviewId) {
                console.error("ID recenzji jest nieprawidłowe:", reviewId);
                setMessage("Nie można usunąć opinii. ID recenzji jest nieprawidłowe.");
                return;
            }
    
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setMessage("Musisz być zalogowany, aby usunąć opinię.");
                return;
            }
    
            console.log("Usuwanie recenzji o ID:", reviewId);
    
            await axiosInstance.delete(`/api/reviews/${reviewId}`, {
                headers: { "x-auth-token": token },
            });
    
            setMessage("Opinia została usunięta.");
            setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
        } catch (err) {
            console.error("Błąd podczas usuwania opinii:", err.response?.data || err.message);
            setMessage(err.response?.data?.message || "Błąd podczas usuwania opinii.");
        }
    };

    return (
        <div className="review-page">
            <h1>Opinie dla produktu</h1>
            <div className="review-form">
                <h3>Dodaj opinię</h3>
                <textarea
                    placeholder="Twoja opinia"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
                <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Ocena (1-5)"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })}
                />
                <button onClick={handleAddReview}>Dodaj opinię</button>
                {message && <p>{message}</p>}
            </div>
            <div className="review-list">
                <h3>Lista opinii</h3>
                {reviews.length > 0 ? (
                    reviews.map((review) => {
                        // Logowanie danych do debugowania
                        console.log("Warunek widoczności przycisku:", {
                            reviewUserId: review.userId,
                            loggedUserId: userId,
                            loggedUserRole: userRole,
                            przyciskWidoczny: review.userId === userId || userRole === "admin",
                        });

                        return (
                            <div key={review.id} className="review-item">
                                <p>Ocena: {review.rating}</p>
                                <p>Komentarz: {review.comment}</p>
                                {(Number(review.userId) === Number(userId) || userRole === "admin") && (
                                    <button onClick={() => handleDeleteReview(review.id)}>Usuń opinię</button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>Brak opinii dla tego produktu.</p>
                )}
            </div>
        </div>
    );
}

export default ReviewPage;
