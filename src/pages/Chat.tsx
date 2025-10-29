import { useEffect, useState } from "react";
import "./Chat.css";

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

    useEffect(() => {
        getAllUsers();
        getAllChannels();
    }, []);

    return (
        <div className="chat">
            <div>
                <div className="container">
                    <h2>Inloggad som Gäst</h2>
                    <a href="#">
                        🆘 Logga in eller registrera dig för att skriva i låsta
                        grupper eller skicka DMs
                    </a>
                </div>
            </div>
            <h3>Kanaler</h3>
            <div className="groups container">
                {channels.map((ch) => (
                    <button disabled={ch.isPrivate} key={ch.channelId}>
                        <div> {ch.channelName} </div>
                    </button>
                ))}
                <button disabled>+ Skapa ny kanal</button>
            </div>
            <h3>DM</h3>
            <div className="dm container">
                {users.map((u) => (
                    <button disabled key={u.userId}>
                        <div> {u.username} </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Chat;
