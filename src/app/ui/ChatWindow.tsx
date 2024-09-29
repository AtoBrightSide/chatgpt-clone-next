"use client"
import { useState, useEffect } from 'react';
import Chatbox from './Chatbox';
import MessageInput from './MessageInput';
import { createMessage, getGptResponse, updateMessage } from '../../../lib/actions';
import { MessageType } from '../../../lib/definitions';
import { gptResponses } from '../../../lib/dummy-response';

const ChatWindow = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<MessageType | null>(null);

    useEffect(() => {
        const fetchGptResponses = async () => {
            if (selectedVersion?.id) {
                const response = await getGptResponse(selectedVersion.id);
                if (response)
                    setMessages((prevMessages) => [...prevMessages.slice(0, -1), response])
            }

        };
        fetchGptResponses();
    }, [selectedVersion]);

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

            if (updatedGptMessage) {
                setMessages((prevMessages) => [...prevMessages.slice(0, -1), updatedGptMessage]);
            }
        }
    };

    return (
        <>
            <Chatbox messages={messages} onUpdateMessage={handleUpdateMessage} onSelectVersion={setSelectedVersion} />
            <MessageInput addMessage={addMessage} />
        </>
    );
};

export default ChatWindow;
