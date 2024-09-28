// Chatbox.tsx
import { MessageType } from "../../../lib/definitions";
import Message from "./Message";

interface ChatboxProps {
    messages: MessageType[];
}

const Chatbox: React.FC<ChatboxProps> = ({ messages }) => {
    return (
        <div className="py-32 px-20 w-full">
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} />
            ))}
        </div>
    );
};

export default Chatbox;
