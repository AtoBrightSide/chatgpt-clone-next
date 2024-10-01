import { MessageType } from "../../../lib/definitions";
import Message from "./Message";

interface ChatboxProps {
    messages: MessageType[];
    onUpdateMessage: (updatedMessage: Omit<MessageType, 'created_at'>) => void;
    onSelectVersion: (version: MessageType) => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ messages, onUpdateMessage, onSelectVersion }) => {
    return (
        <>
            {
                messages.length !== 0 ?
                    (
                        <div className="py-5 md:py-32 px-5 md:px-20 w-full">
                            {messages.map((msg) => (
                                <Message key={msg.id} message={msg} onUpdateMessage={onUpdateMessage} onSelectVersion={onSelectVersion} />
                            ))}
                        </div>
                    ) : (
                        <div className="hero bg-inherit min-h-screen">
                            <div className="hero-content text-center">
                                <div className="max-w-md">
                                    <h1 className="text-5xl font-bold">Hello 👋🏾</h1>
                                    <p className="py-6">
                                        This is a simplified ChatGPT clone web application built using NextJS and Supabase. To get started, type in the input field below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
            }
        </>
    );
};

export default Chatbox;
