export type MessageType = {
    id: string;
    user_message: string;
    gpt_response: string;
    parent_id: string | null;
    branch_id: string | null;
    version: number;
    created_at: string;
}

export type VersionType = {
    id: string;
    parent_id: string;
    no_of_versions: number;
}