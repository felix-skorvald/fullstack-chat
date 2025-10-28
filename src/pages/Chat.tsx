import { useState } from "react";
import "./Chat.css";

const Chat = () => {
    interface UserResponse {
        username: string;
        userId: string;
    }
    interface ChannelResponse {
        username: string;
        userId: string;
    }
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [channels, setChannels] = useState<ChannelResponse[]>([]);

    const getAllUsers = async () => {
        // Obs! Response i frontend är inte samma sak som Response i Express!
        const response: Response = await fetch("/api/users");
        const data = await response.json();

        // TODO: validera datan

        console.log("Data from server:", data);
        const userResponse: UserResponse[] = data;
        setUsers(userResponse);
    };

    return (
        <div className="chat">
            <button onClick={getAllUsers}>hämta användanre</button>
            <button>Skapa ny kanal</button>
            <h2>Inloggad som Gäst</h2>
            <h3>Kanaler</h3>
            <div className="grups container">
                {users.map((u) => (
                    <button key={u.userId}>
                        <div> {u.username} </div>
                    </button>
                ))}
            </div>
            <h3>DM</h3>
            <div className="dm container">
                {users.map((u) => (
                    <button key={u.userId}>
                        <div> {u.username} </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Chat;
