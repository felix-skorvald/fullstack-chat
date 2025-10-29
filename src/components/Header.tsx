import { useNavigate } from "react-router";
import "./Header.css";
import back from "../img/back.svg";

const Header = () => {
    const handleBack = () => {
        navigate("/");
    };

    const navigate = useNavigate();
    return (
        <header>
            <button onClick={handleBack}>
                <img src={back} alt="" />
            </button>
            <h1>Chappy</h1>
            <button>O</button>
        </header>
    );
};

export default Header;
