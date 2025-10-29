import send from "../img/send.svg";

const SendMessage = () => {
    return (
        <div>
            <input type="text" />
            <button>
                <img src={send} alt="" />
            </button>
        </div>
    );
};

export default SendMessage;
