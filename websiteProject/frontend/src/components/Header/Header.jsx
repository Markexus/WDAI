import { useNavigate } from "react-router-dom";
import "./Header.css";


function Header({ isLogged }) {
    const navigate = useNavigate();

    const handleLogin = () => {
        if (isLogged) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    };

    return (
        <header className="header">
            <a href="/" className="logo">Strona główna</a>
            <div className="actions">
                <button onClick={() => navigate("/cart")}>Koszyk</button>
                <button onClick={handleLogin}>
                    {isLogged ? "Profil" : "Zaloguj"}
                </button>
            </div>
        </header>
    );
}

export default Header;
