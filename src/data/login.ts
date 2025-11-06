import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../data/userStore";

interface TokenPayload {
    userId: string;
    username: string;
    accessLevel: string;
    exp: number;
}

export const setUserFromToken = (token: string | null) => {
    const { setUsername, setAccessLevel, setUserId } = useUserStore.getState();
    const guestId = Math.floor(Math.random() * 1000);

    const createGuest = () => {
        const tempId = String(crypto.randomUUID);
        setUsername("Gäst" + guestId);
        setAccessLevel("guest");
        setUserId(tempId);
    };
    try {
        //VALIDERA TOEKEN?
        if (!token) {
            createGuest();
            console.log("finns ingen token" + guestId);
            return;
        }
        const decoded = jwtDecode<TokenPayload>(token);
        const nowInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < nowInSeconds) {
            console.warn("Token har gått ut, rensar");
            createGuest();
            localStorage.removeItem("userToken");
            return;
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
    } catch (err) {
        console.error("Fel vid decoding av token:", err);
    }
};
