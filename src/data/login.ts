import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../data/userStore";


interface DeleteResult {
    success: boolean;
}

interface TokenPayload {
    userId: string;
    username: string;
    accessLevel: string;
    exp: number;
}

type AuthResponse = {
    success: boolean;
    token?: string;
    message?: string;
};

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
            return false;
        }
        const decoded = jwtDecode<TokenPayload>(token);
        const nowInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < nowInSeconds) {
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

        return true;
    } catch (err) {
        console.error("Fel vid decoding av token:", err);
    }
};

export const logOut = () => {
    localStorage.removeItem("userToken");
};

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


export const authFetch = async (
    endpoint: "login" | "register",
    username: string,
    password: string
): Promise<AuthResponse> => {
    const res = await fetch(`/api/${endpoint}`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
            "Content-type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(`HTTP error! ${res.status}`);
    }

    return await res.json();
};