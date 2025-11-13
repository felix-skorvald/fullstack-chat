export const createChannel = async (
    channelName: string,
    createdBy: string,
    isPrivate: string
): Promise<void> => {
    try {
        const res = await fetch("/api/message", {
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
            console.error("Kunde inte skicka meddelande");
        }

        console.log("Kanal Skapad" + channelName);
    } catch (error) {
        console.error("Kunde inte skapa kanal", error);
    }
};
