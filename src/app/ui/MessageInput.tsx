'use client';

import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { MessageType } from '../../../lib/definitions';

interface MessageInputProps {
    addMessage: (message: Omit<MessageType, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    parentId?: string | null;
}

const MessageInput: React.FC<MessageInputProps> = ({ addMessage, parentId = null }) => {
    const [value, setValue] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            await addMessage({
                content: value,
                parent_id: parentId,
                version: 1,
                sender: 'user',
            });
            setValue("");
        }
    };

    return (
        <div className="w-1/2 p-5 mb-5 bg-[#F4F4F4] rounded-full fixed bottom-0 shadow-lg">
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    placeholder="Message Clone"
                    className="bg-inherit w-full border-none text-gray-900 rounded-lg focus:outline-none"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button type="submit">
                    <ArrowUpCircleIcon className="h-8 text-gray-500 hover:cursor-pointer hover:text-gray-700 transition-all" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
