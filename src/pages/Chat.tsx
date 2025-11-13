import { useEffect, useState } from "react";
import "./Chat.css";
import { useUserStore } from "../data/userStore";
import { setUserFromToken } from "../data/login";
import { useParams, useNavigate } from "react-router";
import ChatView from "../components/ChatView";
import CreateNewChannel from "../components/CreateNewChannel";

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
    const { type, id } = useParams();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [channels, setChannels] = useState<ChannelResponse[]>([]);
    const token = localStorage.getItem("userToken");
    const [isCreating, setIsCreating] = useState(false);
    const user = {
        username: useUserStore((state) => state.username),
        accessLevel: useUserStore((state) => state.accessLevel),
    };

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
        let chatName = "";

        if (type === "channel") {
            const channel = channels.find((ch) => ch.channelId === id);
            chatName = channel ? channel.channelName : "Okänd kanal";
        } else if (type === "dm") {
            const dm = users.find((d) => d.userId === id);
            chatName = dm ? dm.username : "Okänd användare";
        }

        return <ChatView type={type} id={id} chatName={chatName} />;
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

                {isCreating ? (
                    <CreateNewChannel />
                ) : (
                    <button
                        disabled={user.accessLevel !== "user"}
                        onClick={() => setIsCreating(true)}
                    >
                        + Skapa ny kanal
                    </button>
                )}
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
