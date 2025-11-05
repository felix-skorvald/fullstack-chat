interface Message {
    pk: string;
    sk: string;
    message: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    timestamp: string;
    messageId: string;
}

export const getChannelMessages = async (channelId: String) => {
    try {
        const response: Response = await fetch("/api/message/channel/" + channelId);
        const data = await response.json();

        const messages: Message[] = data;
        return messages;

    } catch (error) {
        console.error("Kunde inte hämta meddelanden:", error);
        return [];
    }
};

export const getUserMessages = async (receiverId: string, token: string) => {
    try {
        const response = await fetch("/api/message/user/" + receiverId, {
            method: "GET",
            headers: {
                "Authorization": `Bearer: ${token}`,
                "Content-Type": "application/json",
            },
        });

        const messages = await response.json();
        return messages;
    } catch (error) {
        console.error("Kunde inte hämta meddelanden:", error);
        return [];
    }
}
