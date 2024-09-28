export type MessageType = {
    id: string;
    content:  number | string;
    parent_id: string | null;
    version: number;
    created_at: string;
    updated_at: string;
    sender: 'user' | 'gpt';
}