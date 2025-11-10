import { useUserStore } from "../data/userStore";
import { useNavigate, useParams } from "react-router";
import "./Profile.css";
import { deleteUser, logOut } from "../data/login";
import { useState } from "react";

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = String(localStorage.getItem("userToken"));
    const [isDeleting, setIsDeleting] = useState(false);

    const user = {
        username: useUserStore((state) => state.username),
        accessLevel: useUserStore((state) => state.accessLevel),
        userId: useUserStore((state) => state.userId),
    };

    const handleDelete = async () => {
        const result = await deleteUser(user.userId, token);

        if (result.success) {
            logOut();
            navigate("/");
            console.log("Användaren raderades och du loggades ut.");
        } else {
            console.error("Kunde inte ta bort användare:", result.success);
        }
    };

    return (
        <div className="profile">
            {!isDeleting ? (
                <h3>
                    Var hälsad {user.username}... Här kan du ta bort ditt konto
                    eller logga ut
                </h3>
            ) : (
                <h3>⚠️ ÄR DU SÄKER PÅ ATT DU VILL TA BORT DITT KONTO?</h3>
            )}

            <div className="container">
                {!isDeleting ? (
                    <button onClick={() => setIsDeleting(true)}>
                        Ta bort konto med id {id}
                    </button>
                ) : (
                    <button onClick={handleDelete}>
                        Jag är säker, ta bort mitt konto
                    </button>
                )}

                <button>Logga ut</button>
            </div>
        </div>
    );
};

export default Profile;
