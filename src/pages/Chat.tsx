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

        console.log("Data from server:", data);
        const userResponse: UserResponse[] = data;
        setUsers(userResponse);
    };
    const getAllChannels = async () => {
        const response: Response = await fetch("/api/channel");
        const data = await response.json();

        //  validera datan

        console.log("Data from server:", data);
        const channelResponse: ChannelResponse[] = data;
        setChannels(channelResponse);
    };

    useEffect(() => {
        getAllUsers();
        getAllChannels();
    }, []);

    return (
        <div className="chat">
            <button>Skapa ny kanal</button>
            <a href="#">Logga in eller registrera dig.OBS</a>
            <h2>Inloggad som Gäst</h2>
            <h3>Kanaler</h3>
            <div className="groups container">
                {channels.map((ch) => (
                    <button disabled={ch.isPrivate} key={ch.channelId}>
                        <div> {ch.channelName} </div>
                    </button>
                ))}
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
