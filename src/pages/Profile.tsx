import { useUserStore } from "../data/userStore";
import { useParams } from "react-router";
import "./Profile.css";
import { deleteUser, logOut } from "../data/login";

const Profile = () => {
    const { id } = useParams();
    const token = String(localStorage.getItem("userToken"));

    const user = {
        username: useUserStore((state) => state.username),
        accessLevel: useUserStore((state) => state.accessLevel),
        userId: useUserStore((state) => state.userId),
    };

    const handleDelete = async () => {
        const result = await deleteUser(user.userId, token);
        if (result.success) {
            logOut();
        } else {
            console.log("Kunde inte ta bort användare.");
        }
    };
    return (
        <div className="profile">
            <h3>Här kan du ta bort ditt konto eller logga ut</h3>
            <div className="container">
                {/* popup ÄR DU SÄKER DU KOMMER LOGGAS UT */}
                <button onClick={handleDelete}>Ta bort konto</button>
                <button>Logga ut</button>
            </div>
        </div>
    );
};

export default Profile;
