import { useState } from "react";
import { createChannel } from "../data/channel";
import { useUserStore } from "../data/userStore";
import "./CreateNewChannel.css";

type Props = {
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
    getAllChannels: () => Promise<void>;
};

const CreateNewChannel = ({ setIsCreating, getAllChannels }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const user = {
        userId: useUserStore((state) => state.userId),
    };

    const [newChannel, setNewChannel] = useState({
        channelName: "",
        createdBy: user.userId,
        isPrivate: true,
    });

    const handleCreate = async () => {
        if (newChannel.channelName.length < 1) return;

        try {
            setIsLoading(true);

            await createChannel(
                newChannel.channelName,
                newChannel.createdBy,
                newChannel.isPrivate
            );

            await getAllChannels();

            setIsCreating(false);
        } catch (error) {
            console.error("Error creating channel:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="new-channel">
            <label htmlFor="channelName">Kanalnamn</label>
            <input
                id="channelName"
                type="text"
                value={newChannel.channelName}
                onChange={(e) =>
                    setNewChannel({
                        ...newChannel,
                        channelName: e.target.value,
                    })
                }
                disabled={isLoading}
            />

            <div className="checkbox">
                <input
                    type="checkbox"
                    id="isPrivate"
                    checked={newChannel.isPrivate}
                    onChange={(e) =>
                        setNewChannel({
                            ...newChannel,
                            isPrivate: e.target.checked,
                        })
                    }
                    disabled={isLoading}
                />
                <label htmlFor="isPrivate">Gör kanalen privat</label>
            </div>

            <button
                onClick={handleCreate}
                disabled={isLoading || newChannel.channelName.length < 1}
            >
                {isLoading ? "Skapar..." : "Skapa kanal"}
            </button>
            <button onClick={() => setIsCreating(false)} disabled={isLoading}>
                Avbryt
            </button>
        </div>
    );
};

export default CreateNewChannel;
