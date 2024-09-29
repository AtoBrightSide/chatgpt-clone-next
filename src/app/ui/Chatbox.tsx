import { MessageType } from "../../../lib/definitions";
import Message from "./Message";

interface ChatboxProps {
    messages: MessageType[];
    onUpdateMessage: (updatedMessage: Omit<MessageType, 'created_at' | 'updated_at'>) => void;
    onSelectVersion: (version: MessageType) => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ messages, onUpdateMessage, onSelectVersion }) => {
    return (
        <div className="py-32 px-20 w-full">
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} onUpdateMessage={onUpdateMessage} onSelectVersion={onSelectVersion} />
            ))}
        </div>
    );
};

export default Chatbox;
