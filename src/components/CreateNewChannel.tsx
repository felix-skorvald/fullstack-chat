import { createChannel } from "../data/channel";
import { useUserStore } from "../data/userStore";
import "./CreateNewChannel.css";

const CreateNewChannel = () => {
    const user = {
        username: useUserStore((state) => state.username),
        accessLevel: useUserStore((state) => state.accessLevel),
    };

    const handleCreate = () => {};
    return (
        <div className="new-channel">
            <label htmlFor="">Kanalnamn</label>
            <input type="text" />
            <label htmlFor="">Privat?</label>
            <div className="radios">
                <label htmlFor="">Ja</label>
                <input type="radio" name="isPrivate" id="yes" checked />
                <label htmlFor="">Nej</label>
                <input type="radio" name="isPrivate" id="no" />
            </div>
            <button onClick={() => handleCreate}>Skapa Kanal</button>
        </div>
    );
};

export default CreateNewChannel;
