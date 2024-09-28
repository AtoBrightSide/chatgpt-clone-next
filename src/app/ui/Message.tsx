import clsx from "clsx";
import { MessageType } from "../../../lib/definitions";
import { PencilIcon } from "@heroicons/react/24/outline";

const Message = ({ message }: { message: MessageType }) => {
    return (
        <div>

            <div className={clsx("chat", { "chat-start": message.sender === 'gpt' }, { "chat-end": message.sender === 'user' })}>
                <div className="chat-bubble">{message.content}</div>
                {message.sender === 'user' && <div className="chat-footer opacity-50 flex justify-start gap-x-2 hover:cursor-pointer hover:opacity-85">
                    <div className="">Edit prompt</div>
                    <PencilIcon className="w-4" />
                </div>}
            </div>
        </div>
    );
}

export default Message;