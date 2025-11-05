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
    const response: Response = await fetch("/api/message/channel/" + channelId);
    const data = await response.json();

    const messages: Message[] = data;
    return messages;
};
