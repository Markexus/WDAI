import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import "./Register.css";

function Register( { setIsLogged } ) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username , setUsername] = useState("");
    const [error, setError] = useState("");

    // Funckja do obsługi rejestracji
    const handleRegister = async (e) => {
        e.preventDefault();

        // Sprawdzenie hasła
        if (password !== confirmPassword) {
            setError("Hasła nie są takie same");
            return;
        }

        try {
            // Wysyłanie zapytania do API
            const res = await axiosInstance.post("/api/auth/register", {
                name: username,
                email,
                password,
            });

            const {accessToken, refrehToken} = res.data

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refrehToken);
            
            setIsLogged(true);
            navigate("/profile");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Rejestracja nie powiodła się");
        }
    };

    return (
        <div className="register-page">
            <h2>Zarejestruj się</h2>
            <form onSubmit={handleRegister} className="register-form">
                {error && <div className="error">{error}</div>}

                <div className="form-group">
                    <label className="register-label" htmlFor="username">Nazwa użytkownika</label>
                    <input className="register-input" type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label className="register-label" htmlFor="email">Eamil</label>
                    <input className="register-input" type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label className="register-label" htmlFor="password">Hasło</label>
                    <input className="register-input" type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label className="register-label" htmlFor="confirmPassword">Potwierdź hasło</label>
                    <input className="register-input" type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/>
                </div>

                <button className="register-button" type="submit">Zarejestruj się</button>
            </form>
        </div>
    );
}

export default Register;