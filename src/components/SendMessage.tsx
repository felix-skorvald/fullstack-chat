import send from "../img/send.svg";
import "./SendMessage.css";

const SendMessage = () => {
    return (
        <div className="message-input">
            <textarea
                placeholder="Skriv ditt meddelande här..."
                rows={2}
                cols={40}
            />
            <button>
                <img src={send} alt="" />
            </button>
        </div>
    );
};

export default SendMessage;
