import { useNavigate } from "react-router";
import "./Header.css";
import back from "../img/back.svg";
import userIcon from "../img/user.svg";
import locked from "../img/locked.svg";
import { useHeaderStore } from "../data/headerStore";
import { useUserStore } from "../data/userStore";

const Header = () => {
    const handleBack = () => {
        navigate("/chat");
    };
    const handleProfile = () => {
        navigate("/profile");
    };

    const user = {
        username: useUserStore((state) => state.username),
        accessLevel: useUserStore((state) => state.accessLevel),
    };

    const headerText = useHeaderStore((state) => state.headerText);

    //TODO en delad state för att BACKA!

    const navigate = useNavigate();
    return (
        <header>
            <button onClick={handleBack}>
                <img src={back} alt="" />
            </button>
            <h3>{headerText}</h3>
            <button
                disabled={user.accessLevel === "guest"}
                onClick={handleProfile}
            >
                {user.accessLevel === "guest" ? (
                    <img src={locked} alt="" />
                ) : (
                    <img src={userIcon} alt="" />
                )}
            </button>
        </header>
    );
};

export default Header;
