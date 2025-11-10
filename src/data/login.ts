import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../data/userStore";

interface TokenPayload {
    userId: string;
    username: string;
    accessLevel: string;
    exp: number;
}

export const setUserFromToken = (token: string | null) => {
    const { setUsername, setAccessLevel, setUserId, accessLevel } =
        useUserStore.getState();

    const createGuest = () => {
        if (accessLevel != "guest") {
            const guestId = Math.floor(Math.random() * 1000);
            const tempId = String(crypto.randomUUID());
            setUsername("Gäst" + guestId);
            setUserId(tempId);
        }
        setAccessLevel("guest");
    };

    try {
        //VALIDERA TOEKEN?
        if (!token) {
            createGuest();
            console.log("finns ingen token");
            return false;
        }
        const decoded = jwtDecode<TokenPayload>(token);
        const nowInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < nowInSeconds) {
            console.warn("Token har gått ut, rensar");
            createGuest();
            localStorage.removeItem("userToken");
            return false;
        }

        if (decoded.username) {
            setUsername(decoded.username);
        }

        if (decoded.accessLevel) {
            setAccessLevel(decoded.accessLevel);
        }
        if (decoded.userId) {
            setUserId(decoded.userId);
        }

        console.log("Användare satt från token:", decoded);

        return true;
    } catch (err) {
        console.error("Fel vid decoding av token:", err);
    }
};

export const logOut = () => {
    localStorage.removeItem("userToken");
};

export const deleteUser = async (userId: string, token: string) => {
    try {
        const response = await fetch("/api/user/" + userId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer: ${token}`,
                "Content-Type": "application/json",
            },
        });

        const message = await response.json();
        return message;
    } catch (error) {
        console.error("Kunde inte hämta meddelanden:", error);
        return error;
    }
};
