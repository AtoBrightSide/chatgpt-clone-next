'use server'

import { MessageType } from "./definitions";

const messages: MessageType[] = [];

export async function createMessage(message: Omit<MessageType, 'created_at' | 'updated_at'>): Promise<MessageType[]> {
    const newMessage: MessageType = {
        ...message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    messages.push(newMessage);
    return messages;
}