import { useEffect, useState } from "react";
import { getChannelMessages } from "../data/getMessages";
import "./ChatView.css";
import SendMessage from "./SendMessage";

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

interface ChatViewProps {
    type: string;
    id: string;
    chatName: string;
}

const ChatView = ({ type, id, chatName }: ChatViewProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await getChannelMessages(id);
            setMessages(data);
        } catch (error) {
            console.error("Fel vid hämtning av meddelanden:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [id]);

    return (
        <div className="chat-view">
            {type === "channel" ? (
                <>
                    <h2>{chatName}</h2>
                </>
            ) : (
                <>
                    <h2>{chatName}</h2>
                    <p>Användar-ID: {id}</p>
                </>
            )}
            {loading ? (
                <p>Laddar meddelanden...</p>
            ) : (
                <div>
                    {messages.map((msg) => (
                        <div className="message" key={msg.messageId}>
                            <strong>{msg.senderName}:</strong> {msg.message}{" "}
                            {msg.timestamp}
                        </div>
                    ))}
                </div>
            )}
            <SendMessage />
        </div>
    );
};

export default ChatView;
