import { useEffect, useRef, useState } from "react";
import { getChannelMessages, getUserMessages } from "../data/getMessages";
import "./ChatView.css";
import SendMessage from "./SendMessage";
import { useHeaderStore } from "../data/headerStore";
import { deleteChannel, getChannel } from "../data/channel";
import { useUserStore } from "../data/userStore";
import { useNavigate } from "react-router";

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

interface Channel {
    channelName: string;
    channelId: string;
    createdBy: string;
    isPrivate: boolean;
}

interface ChatViewProps {
    type: string;
    id: string;
    chatName: string;
}

const ChatView = ({ type, id, chatName }: ChatViewProps) => {
    const [channelInfo, setChannelInfo] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const setHeaderText = useHeaderStore((state) => state.setHeaderText);
    const token = localStorage.getItem("userToken");
    const user = {
        username: useUserStore((state) => state.username),
        userId: useUserStore((state) => state.userId),
    };
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            let data: Message[] = [];
            let channel: Channel | null = null;

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
                channel = await getChannel(id);
                setChannelInfo(channel);
            }
            const sorted = data.sort((a, b) =>
                a.timestamp.localeCompare(b.timestamp)
            );
            setHeaderText(chatName);
            setMessages(sorted);
        } catch (error) {
            console.error("Fel vid hämtning av meddelanden:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (chatID: string) => {
        deleteChannel(chatID, String(token));
        navigate("/");
    };

    useEffect(() => {
        fetchMessages();
    }, [id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }, [messages]);

    return (
        <div className="chat-view">
            {loading ? (
                <p>Laddar meddelanden...</p>
            ) : (
                <div>
                    {type === "channel" &&
                        channelInfo &&
                        channelInfo.createdBy === user.userId && (
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(id)}
                            >
                                Radera kanalen?
                            </button>
                        )}

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
