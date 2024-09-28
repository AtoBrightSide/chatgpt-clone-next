"use client"
import { useState, useEffect } from 'react';
import Chatbox from './Chatbox';
import MessageInput from './MessageInput';

import { createMessage } from '../../../lib/actions';
import { MessageType } from '../../../lib/definitions';
import { gptResponses } from '../../../lib/dummy-response';

const ChatWindow = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        // Fetch initial messages from the server if needed
    }, []);

    const addMessage = async (message: Omit<MessageType, 'created_at' | 'updated_at'>) => {
        // Add user message
        const newMessages = await createMessage(message);
        setMessages(newMessages);

        // Simulate GPT response
        const gptResponse = gptResponses[Math.floor(Math.random() * gptResponses.length)];
        const updatedMessages = await createMessage({
            id: Date.now().toString(),
            content: gptResponse,
            parent_id: null,
            version: 1,
            sender: 'gpt',
        });
        setMessages(updatedMessages);
    };

    return (
        <>
            <Chatbox messages={messages} />
            <MessageInput addMessage={addMessage} />
        </>
    );
};

export default ChatWindow;
