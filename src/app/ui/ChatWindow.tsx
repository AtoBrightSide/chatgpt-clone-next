"use client"
import { useState, useEffect } from 'react';
import Chatbox from './Chatbox';
import MessageInput from './MessageInput';
import { createMessage, getBranchMessages, updateMessage } from '../../../lib/actions';
import { MessageType } from '../../../lib/definitions';
import { gptResponses } from '../../../lib/dummy-response';

const ChatWindow = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<MessageType | null>(null);
    const [currMessage, setCurrMessage] = useState<MessageType | null>(null);

    useEffect(() => {
        const fetchFollowUpMessages = async () => {
            setCurrMessage(selectedVersion);
            if (selectedVersion?.id) {
                const responses = await getBranchMessages(selectedVersion.branch_id, selectedVersion.created_at);
                
                if (responses) {
                    setMessages((prevMessages => {
                        if (selectedVersion.parent_id === null) {
                            return responses;
                        }
                        let branchMessages = [...prevMessages];
                        let stopIndex = 0;
                        for (let i = 0; i < prevMessages.length; i++) {
                            if (prevMessages[i].id === selectedVersion.parent_id) {
                                stopIndex = i;
                            }
                        }
                        branchMessages.splice(stopIndex + 1);

                        return [...branchMessages, ...responses];
                    }));
                }
            }
        };
        fetchFollowUpMessages();
    }, [selectedVersion]);

    const addMessage = async (message: Omit<MessageType, 'id' | 'created_at' | 'gpt_response'>) => {
        // simulateGpt response
        const gptResponse = gptResponses[Math.floor(Math.random() * gptResponses.length)];
        const userMessage = { ...message, gpt_response: gptResponse };

        const newMessage = await createMessage(userMessage);
        setCurrMessage(newMessage);

        if (newMessage) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    };

    const handleUpdateMessage = async (updatedMessage: Omit<MessageType, 'created_at' | 'updated_at'>) => {
        updatedMessage = { ...updatedMessage, gpt_response: gptResponses[Math.floor(Math.random() * gptResponses.length)] }

        const newMessage = await updateMessage(updatedMessage);
        setCurrMessage(newMessage);

        if (newMessage) {
            setMessages((prevMessages) => {
                let updatedPrevMessages = [...prevMessages];
                let stopIndex = 0;
                for (let i = 0; i < prevMessages.length; i++) {
                    if (prevMessages[i].parent_id === newMessage.parent_id) {
                        stopIndex = i;
                    }
                }
                updatedPrevMessages.splice(stopIndex);
                updatedPrevMessages.push(newMessage);
                return updatedPrevMessages;
            });
        }
    };

    return (
        <>
            <Chatbox messages={messages} onUpdateMessage={handleUpdateMessage} onSelectVersion={setSelectedVersion} />
            <MessageInput addMessage={addMessage} parentId={currMessage?.id} branch_id={currMessage?.branch_id} />
        </>
    );
};

export default ChatWindow;
