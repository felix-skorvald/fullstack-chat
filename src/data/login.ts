import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../data/userStore";

interface TokenPayload {
    userId: string;
    username: string;
    accessLevel: string;
    exp: number;
}

export const setUserFromToken = (token: string | null) => {
    const { setUsername, setAccessLevel } = useUserStore.getState();
    const guestId = Math.floor(Math.random() * 1000);
    try {
        //VALIDERA TOEKEN?
        if (!token) {
            setUsername("Gäst" + guestId);
            setAccessLevel("guest");
            console.log("finns ingen token");
            return;
        }
        const decoded = jwtDecode<TokenPayload>(token);
        const nowInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < nowInSeconds) {
            console.warn("Token har gått ut, rensar");
            setUsername("Gäst" + guestId);
            setAccessLevel("guest");
            localStorage.removeItem("userToken");
            console.log(token);
            return;
        }

        if (decoded.username) {
            setUsername(decoded.username);
        }

        if (decoded.accessLevel) {
            setAccessLevel(decoded.accessLevel);
        }

        console.log("Användare satt från token:", decoded);
    } catch (err) {
        console.error("Fel vid decoding av token:", err);
    }
};
