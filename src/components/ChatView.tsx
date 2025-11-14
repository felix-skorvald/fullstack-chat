import { useEffect, useRef, useState } from "react";
import { getChannelMessages, getUserMessages } from "../data/getMessages";
import "./ChatView.css";
import SendMessage from "./SendMessage";
import { useHeaderStore } from "../data/headerStore";

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
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const setHeaderText = useHeaderStore((state) => state.setHeaderText);

    const fetchMessages = async () => {
        try {
            let data: Message[] = [];

            setLoading(true);
            if (type === "dm") {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    console.error("Ingen token hittad");
                    setLoading(false);
                    return;
                }
                data = await getUserMessages(id, token);
            } else if (type === "channel") {
                data = await getChannelMessages(id);
            }
            const sorted = data.sort((a, b) =>
                a.timestamp.localeCompare(b.timestamp)
            );
            setHeaderText(chatName)
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

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-view">
            {loading ? (
                <p>
                    Laddar meddelanden...
                </p>
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
                    <div ref={bottomRef} />
                </div>
            )}
            <SendMessage receiver={id} update={fetchMessages} />
        </div>
    );
};

export default ChatView;
