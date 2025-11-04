import { useNavigate } from "react-router";
import "./Header.css";
import back from "../img/back.svg";
import user from "../img/user.svg";
import { useHeaderStore } from "../data/headerStore";

const Header = () => {
    const handleBack = () => {
        navigate("/");
    };
    const handleProfile = () => {
        navigate("/profile");
    };

    const headerText = useHeaderStore((state) => state.headerText);

    const navigate = useNavigate();
    return (
        <header>
            <button onClick={handleBack}>
                <img src={back} alt="" />
            </button>
            <h3>{headerText}</h3>
            <button onClick={handleProfile}>
                <img src={user} alt="" />
            </button>
        </header>
    );
};

export default Header;
