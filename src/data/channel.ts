export const createChannel = async (
    channelName: string,
    createdBy: string,
    isPrivate: boolean
): Promise<void> => {
    try {
        const res = await fetch("/api/channel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                channelName,
                createdBy,
                isPrivate,
            }),
        });

        if (!res.ok) {
            console.error("Kunde inte skapa kanal");
        }
    } catch (error) {
        console.error("Kunde inte skapa kanal", error);
    }
};

export const getChannel = async (channelId: string) => {
    try {
        const res = await fetch(`/api/channel/${channelId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            console.error("Kunde inte hämta kanal");
            return null;
        }

        const channel = await res.json();
        return channel;
    } catch (error) {
        console.error("Kunde inte hämta kanal", error);
        return null;
    }
};

export const deleteChannel = async (
    channelId: string,
    token: string
): Promise<void> => {
    try {
        const res = await fetch(`/api/channel/${channelId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer: ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            console.error("Kunde inte ta bort kanal");
            return;
        }
    } catch (error) {
        console.error("Kunde inte ta bort kanal", error);
    }
};
