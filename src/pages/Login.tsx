import { useNavigate } from "react-router";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/chat");
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="title">
                    <h2>CHAPPY</h2>
                </div>
            </div>
            <div className="container">
                <div className="tabs">
                    <button disabled className="tab-button">
                        LOGGA IN
                    </button>
                    <button className="tab-button">REGISTRERA</button>
                </div>
                <div className="login container">
                    <input type="text" placeholder="Användarnamn" />
                    <input type="password" placeholder="Lösenord" />
                    <button disabled>LOGGA IN</button>

                    <button onClick={handleLogin}>Fortsätt som Gäst</button>
                </div>
            </div>
        </div>
    );
}
