import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../data/userStore";

interface TokenPayload {
    userId: string;
    username: string;
    accessLevel: string;
    exp: number;
}

export const setUserFromToken = (token: string | null) => {
    try {
        if (token) {
            const decoded = jwtDecode<TokenPayload>(token);

            const { setUsername, setAccessLevel } = useUserStore.getState();

            if (decoded.username) {
                setUsername(decoded.username);
            }

            if (decoded.accessLevel) {
                setAccessLevel(decoded.accessLevel);
            }

            console.log("Användare satt från token:", decoded);
        }
    } catch (err) {
        console.error("Fel vid decoding av token:", err);
    }
};
