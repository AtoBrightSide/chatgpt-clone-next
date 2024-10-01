"use client"
import { useState } from 'react';
import { MessageType } from '../../../lib/definitions';

interface EditPromptProps {
    message: MessageType;
    onSave: (updatedMessage: Omit<MessageType, 'created_at'> | null) => void;
}

const EditPrompt: React.FC<EditPromptProps> = ({ message, onSave }) => {
    const [content, setContent] = useState<string>(message.user_message);

    const handleSave = () => {
        if (!message) {
            console.error('Message is null or undefined');
            return;
        }
        const updatedMessage = {
            ...message,
            user_message: content,
        };
        onSave(updatedMessage);
    };

    const cancelSave = () => {
        onSave(null);
    };

    return (
        <div className='p-4 bg-[#F2F2F2] rounded-lg'>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="focus:outline-none bg-inherit"
            />
            <div className="flex gap-x-2">
                <button className="btn" onClick={handleSave} aria-label="Save">
                    Save
                </button>
                <button className="btn" onClick={cancelSave} aria-label="Cancel">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditPrompt;
