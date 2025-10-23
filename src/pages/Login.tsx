import { useNavigate } from "react-router";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/chat");
    };

    return (
        <div className="login-page">
            <h1>Logga in</h1>
            <button onClick={handleLogin}>Logga in</button>
        </div>
    );
}
