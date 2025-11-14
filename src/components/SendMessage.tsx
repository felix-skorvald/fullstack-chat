import send from "../img/send.svg";
import "./SendMessage.css";
import { sendMessage } from "../data/getMessages";
import { useState } from "react";
import { useUserStore } from "../data/userStore";

interface SendMessageProps {
    receiver: string;
    update: () => void;
}

const SendMessage = ({ receiver, update }: SendMessageProps) => {
    const [message, setMessage] = useState("");
    const user = {
        username: useUserStore((state) => state.username),
        accessLevel: useUserStore((state) => state.accessLevel),
        userId: useUserStore((state) => state.userId),
    };

    const handleSend = async () => {
        await sendMessage(message, user.userId, receiver, user.username);
        setMessage("");
        update();
    };

    return (
        <div className="message-input">
            <textarea
                placeholder="Skriv ditt meddelande här..."
                rows={2}
                cols={40}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <button onClick={handleSend} disabled={message.length < 1}>
                <img src={send} alt="" />
            </button>
        </div>
    );
};

export default SendMessage;
