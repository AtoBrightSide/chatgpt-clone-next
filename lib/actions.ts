'use server'

import { MessageType, VersionType } from "./definitions";
import { supabase } from "./supabaseClient";

export async function createMessage(message: Omit<MessageType, 'id' | 'created_at' | 'updated_at'>): Promise<MessageType | null> {
    const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select()
        .single();

    if (error) {
        console.error('Error creating message:', error);
        return null;
    }

    // Insert an entry into the versions table
    const versionEntry: Omit<VersionType, 'id'> = {
        parent_id: data.id,
        no_of_versions: 1,
    };

    const { error: versionError } = await supabase
        .from('versions')
        .insert([versionEntry]);

    if (versionError) {
        console.error('Error creating version entry:', versionError);
        return null;
    }

    return data;
}

export async function getMessage(id: string): Promise<MessageType | null> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching message:', error);
        return null;
    }

    return data;
}

export async function updateMessage(message: Omit<MessageType, 'created_at' | 'updated_at'>): Promise<MessageType | null> {
    // Find the original message
    const { data: originalMessage, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', (message.parent_id === null ? message.id : message.parent_id))
        .single();

    if (fetchError || !originalMessage) {
        console.error('Error fetching original message:', fetchError);
        return null;
    }

    // Increment the no_of_versions for the original message in the versions table
    const { data: versionData, error: versionFetchError } = await supabase
        .from('versions')
        .select('*')
        .eq('parent_id', originalMessage.id)
        .single();

    if (versionFetchError || !versionData) {
        console.error('Error fetching version data:', versionFetchError);
        return null;
    }

    const { error: versionUpdateError } = await supabase
        .from('versions')
        .update({ no_of_versions: versionData.no_of_versions + 1 })
        .eq('parent_id', originalMessage.id);

    if (versionUpdateError) {
        console.error('Error updating no_of_versions:', versionUpdateError);
        return null;
    }


    // Create the new version of the message without the id
    const { id, ...messageWithoutId } = message;
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            ...messageWithoutId,
            parent_id: originalMessage.id, // Use the original message's id as parent_id
            version: versionData.no_of_versions + 1,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error updating message:', error);
        return null;
    }

    return data;
}

export async function getPreviousVersions(parentId: string | null): Promise<MessageType[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('parent_id', parentId)
        .eq('sender', 'user')
        .order('version', { ascending: true });

    if (error) {
        console.error('Error fetching previous versions:', error);
        return [];
    }

    if (parentId) {
        const originalMessage = await getMessage(parentId);
        console.log("originalMessage: ", data, originalMessage);
        return [...data, originalMessage];
    }

    return data
}