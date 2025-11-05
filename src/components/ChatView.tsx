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
            const sorted = data.sort((a, b) =>
                a.timestamp.localeCompare(b.timestamp)
            );
            setMessages(sorted);
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
            {loading ? (
                <p>Laddar meddelanden...</p>
            ) : (
                <div>
                    {messages.map((msg) => (
                        <div className="message" key={msg.messageId}>
                            <p>
                                <strong>{msg.senderName}:</strong>
                            </p>
                            <p>{msg.message}</p>
                            <p>
                                <i>{msg.timestamp}</i>
                            </p>
                        </div>
                    ))}
                </div>
            )}
            <SendMessage />
        </div>
    );
};

export default ChatView;
