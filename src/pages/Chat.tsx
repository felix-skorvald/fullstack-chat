import { useEffect, useState } from "react";
import "./Chat.css";
import { useUserStore } from "../data/userStore";
import { setUserFromToken } from "../data/login";
import { useParams, useNavigate } from "react-router";

const Chat = () => {
    interface UserResponse {
        username: string;
        userId: string;
    }
    interface ChannelResponse {
        channelName: string;
        channelId: string;
        createdBy: string;
        isPrivate: boolean;
    }

    const navigate = useNavigate();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [channels, setChannels] = useState<ChannelResponse[]>([]);

    const getAllUsers = async () => {
        const response: Response = await fetch("/api/users");
        const data = await response.json();

        const userResponse: UserResponse[] = data;
        setUsers(userResponse);
    };
    const getAllChannels = async () => {
        const response: Response = await fetch("/api/channel");
        const data = await response.json();

        const channelResponse: ChannelResponse[] = data;
        setChannels(channelResponse);
    };

    const token = localStorage.getItem("userToken");
    const user = {
        username: useUserStore((state) => state.username),
        accessLevel: useUserStore((state) => state.accessLevel),
    };

    const { type, id } = useParams();

    const openChat = (type: "channel" | "dm", id: string) => {
        navigate(`/chat/${type}/${id}`);
    };

    useEffect(() => {
        setUserFromToken(token);
        if (!type && !id) {
            getAllUsers();
            getAllChannels();
        }
    }, [type, id]);

    if (type && id) {
        return (
            <div className="chat-view">
                <button onClick={() => navigate("/chat")}>⬅ Tillbaka</button>
                {type === "channel" ? (
                    <>
                        <h2>Kanalchatt</h2>
                        <p>Kanal-ID: {id}</p>
                    </>
                ) : (
                    <>
                        <h2>Direktmeddelande</h2>
                        <p>Användar-ID: {id}</p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="chat">
            <div>
                <div className="container">
                    {user.accessLevel === "guest" ? (
                        <div>
                            <h2>Inlogggad som {user.username}</h2>
                            <a href="#">
                                🆘 Logga in eller registrera dig för att skriva
                                i låsta grupper eller skicka DMs
                            </a>
                        </div>
                    ) : (
                        <h2>Välkommen {user.username}</h2>
                    )}
                </div>
            </div>
            <h3>Kanaler</h3>
            <div className="groups container">
                {channels.map((ch) => (
                    <button
                        key={ch.channelId}
                        disabled={ch.isPrivate && user.accessLevel !== "user"}
                        onClick={() => openChat("channel", ch.channelId)}
                    >
                        {ch.channelName}
                    </button>
                ))}
                <button disabled={user.accessLevel !== "user"}>
                    + Skapa ny kanal
                </button>
            </div>

            <h3>DMs</h3>
            <div className="dm container">
                {users.map(
                    (u) =>
                        u.username !== user.username && (
                            <button
                                key={u.userId}
                                disabled={user.accessLevel === "guest"}
                                onClick={() => openChat("dm", u.userId)}
                            >
                                {u.username}
                            </button>
                        )
                )}
            </div>
        </div>
    );
};

export default Chat;
