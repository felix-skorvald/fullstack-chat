import { useState } from "react";
import { createChannel } from "../data/channel";
import { useUserStore } from "../data/userStore";
import "./CreateNewChannel.css";

type Props = {
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateNewChannel = ({ setIsCreating }: Props) => {
    const user = {
        userId: useUserStore((state) => state.userId),
    };

    const [newChannel, setNewChannel] = useState({
        channelName: "",
        createdBy: user.userId,
        isPrivate: true
    })

    const handleCreate = () => {
        if (newChannel.channelName.length >= 1) {
            createChannel(newChannel.channelName, newChannel.createdBy, newChannel.isPrivate)
            console.log(newChannel)
        }
    };
    return (
        <div className="new-channel">
            <label htmlFor="channelName">Kanalnamn</label>
            <input
                id="channelName"
                type="text"
                value={newChannel.channelName}
                onChange={(e) => setNewChannel({ ...newChannel, channelName: e.target.value })}
            />

            <div className="checkbox">
                <input
                    type="checkbox"
                    id="isPrivate"
                    checked={newChannel.isPrivate}
                    onChange={(e) => setNewChannel({ ...newChannel, isPrivate: e.target.checked })}
                />
                <label htmlFor="isPrivate">Gör kanalen privat</label>
            </div>

            <button onClick={handleCreate}>Skapa kanal</button>
            <button onClick={() => setIsCreating(false)}>Avbryt</button>
        </div>
    );
}

export default CreateNewChannel;
