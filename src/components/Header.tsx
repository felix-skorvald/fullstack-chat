import { useNavigate, useLocation } from "react-router";
import "./Header.css";
import back from "../img/back.svg";
import userIcon from "../img/user.svg";
import locked from "../img/locked.svg";
import logout from "../img/logout.svg";

import { useHeaderStore } from "../data/headerStore";
import { useUserStore } from "../data/userStore";
import { logOut } from "../data/login";

const Header = () => {
    const location = useLocation();
    const user = {
        username: useUserStore((state) => state.username),
        accessLevel: useUserStore((state) => state.accessLevel),
        userId: useUserStore((state) => state.userId),
    };
    const handleBack = () => {
        navigate("/chat");
    };
    const handleProfile = () => {
        navigate("/profile/" + user.userId);
    };
    const handleLogOut = () => {
        logOut();
        navigate("/");
    };

    const headerText = useHeaderStore((state) => state.headerText);

    //TODO en delad state för att BACKA!

    const navigate = useNavigate();
    return (
        <header>
            {location.pathname.startsWith("/chat/dm") ||
            location.pathname.startsWith("/chat/channel") ||
            location.pathname.startsWith("/profile/") ? (
                <button onClick={handleBack}>
                    <img src={back} alt="" />
                </button>
            ) : (
                <button onClick={handleLogOut}>
                    <img src={logout} alt="" />
                </button>
            )}

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
