"use client"
import { useState, useEffect } from 'react';
import Chatbox from './Chatbox';
import MessageInput from './MessageInput';
import { createMessage, updateMessage } from '../../../lib/actions';
import { MessageType } from '../../../lib/definitions';
import { gptResponses } from '../../../lib/dummy-response';

const ChatWindow = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        // Fetch initial messages if needed
    }, []);

    const addMessage = async (message: Omit<MessageType, 'id' | 'created_at' | 'updated_at'>) => {
        const userMessage = { ...message, sender: 'user', updated_at: new Date().toISOString() };
        const newMessage = await createMessage(userMessage);
        console.log('New user message:', newMessage);
        if (newMessage) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            const gptResponse = gptResponses[Math.floor(Math.random() * gptResponses.length)];
            const gptMessage = {
                content: gptResponse,
                parent_id: newMessage.id,
                version: 1,
                sender: 'gpt',
            };
            const updatedMessage = await createMessage(gptMessage);
            console.log('New GPT message:', updatedMessage);
            if (updatedMessage) {
                setMessages((prevMessages) => [...prevMessages, updatedMessage]);
            }
        }
    };

    const handleUpdateMessage = async (updatedMessage: Omit<MessageType, 'created_at' | 'updated_at'>) => {
        const newMessage = await updateMessage(updatedMessage);
        console.log('Updated message:', newMessage);
        if (newMessage) {
            setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.id === newMessage.parent_id ? newMessage : msg))
            );

            // Generate a new response from ChatGPT
            const gptResponse = gptResponses[Math.floor(Math.random() * gptResponses.length)];
            const gptMessage = {
                content: gptResponse,
                parent_id: newMessage.id,
                version: 1,
                sender: 'gpt',
            };
            const updatedGptMessage = await createMessage(gptMessage);
            console.log('New GPT message:', updatedGptMessage);
            if (updatedGptMessage) {
                setMessages((prevMessages) => [...prevMessages, updatedGptMessage]);
            }
        }
    };

    return (
        <>
            <Chatbox messages={messages} onUpdateMessage={handleUpdateMessage} />
            <MessageInput addMessage={addMessage} />
        </>
    );
};

export default ChatWindow;
