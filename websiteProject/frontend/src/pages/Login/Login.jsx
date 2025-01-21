import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import "./Login.css";

function Login( { setIsLogged } ) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Obługa logowania
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post("/api/auth/login", {
                    email,
                    password,
                },
            );

            const {accessToken, refreshToken} = res.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            setIsLogged(true);
            navigate("/profile");
        } catch (error) {
            console.error("Login errror: " + error);
            setError(error.response?.data?.message || "Wystąpił błąd podczas logowania");
        }
    };

    return (
        <div className="login-page">
            <h2>Logowanie</h2>
            <form onSubmit={handleLogin}>
                {error && <div className="error">{error}</div>}
                <div className="form-group">
                    <label className="login-label" htmlFor="email">Email</label>
                    <input className="login-input" type="email" id="email" value={email} onChange={e => setEmail(e.target.value)}  required/>
                </div>

                <div className="form-group">
                    <label className="login-label" htmlFor="password">Hasło</label>
                    <input className="login-input" type="password" id="password" value={password} onChange={e => setPassword(e.target.value)}  required/>
                </div>

                <button className="login-button" type="submit">Zaloguj się</button>
            </form>

            <div className="register">
                <p>Nie masz konta?</p>
                <button className="login-button" onClick={() => navigate("/register")}>Zarejestruj się</button>
            </div>
        </div>
    );
}

export default Login;