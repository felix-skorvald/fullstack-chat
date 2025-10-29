import { useNavigate } from "react-router";
import "./Header.css";
import back from "../img/back.svg";
import user from "../img/user.svg";
import { useHeaderStore } from "../data/headerStore";

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
            <h3>ChappyTM</h3>
            <button>
                <img src={user} alt="" />
            </button>
        </header>
    );
};

export default Header;
