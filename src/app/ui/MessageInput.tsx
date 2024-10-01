'use client';

import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { MessageType } from '../../../lib/definitions';

interface MessageInputProps {
    addMessage: (message: Omit<MessageType, 'id' | 'created_at' | 'gpt_response'>) => Promise<void>;
    parentId?: string | null;
    branch_id?: string | null;
}

const MessageInput: React.FC<MessageInputProps> = ({ addMessage, parentId = null, branch_id = null }) => {
    const [value, setValue] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            await addMessage({
                user_message: value,
                parent_id: parentId,
                branch_id: branch_id,
                version: 1,
            });
            setValue("");
        }
    };

    return (
        <div className="w-4/5 md:w-1/2 p-3 md:p-5 mb-5 bg-[#F4F4F4] rounded-full fixed bottom-0 shadow-lg">
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    placeholder="Message Clone"
                    className="bg-inherit w-full border-none text-gray-900 rounded-lg focus:outline-none"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button type="submit">
                    <ArrowUpCircleIcon className="h-7 md:h-8 text-gray-500 hover:cursor-pointer hover:text-gray-700 transition-all" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
