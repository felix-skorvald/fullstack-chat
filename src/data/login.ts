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
        console.log("Användare skapad från token");

        return true;
    } catch (err) {
        console.error("Fel vid decoding av token:", err);
    }
};

export const logOut = () => {
    localStorage.removeItem("userToken");
};

interface DeleteResult {
    success: boolean;
}

export const deleteUser = async (
    userId: string,
    token: string
): Promise<DeleteResult> => {
    const authHeader = `Bearer: ${token}`;

    try {
        const response = await fetch("/api/users/" + userId, {
            method: "DELETE",
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            return { success: true };
        }

        console.error(
            "HTTP-fel vid borttagning:",
            response.status,
            response.statusText
        );
        return { success: false };
    } catch (error) {
        console.error("Nätverksfel eller okänt fel vid borttagning:", error);
        return { success: false };
    }
};
