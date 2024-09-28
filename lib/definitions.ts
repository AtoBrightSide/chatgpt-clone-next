export type MessageType = {
    id: string;
    content: string;
    parent_id: string | null;
    version: number;
    created_at: string;
    updated_at: string;
    sender: string;
}

export type VersionType = {
    id: string;
    parent_id: string;
    no_of_versions: number;
}