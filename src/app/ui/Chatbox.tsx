import { MessageType } from "../../../lib/definitions";
import Message from "./Message";

interface ChatboxProps {
    messages: MessageType[];
    onUpdateMessage: (updatedMessage: Omit<MessageType, 'created_at' | 'updated_at'>) => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ messages, onUpdateMessage }) => {
    return (
        <div className="py-32 px-20 w-full">
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} onUpdateMessage={onUpdateMessage} />
            ))}
        </div>
    );
};

export default Chatbox;
