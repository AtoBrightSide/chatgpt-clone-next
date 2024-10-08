'use server'

import { MessageType, VersionType } from "./definitions";
import { supabase } from "./supabaseClient";

export async function createMessage(message: Omit<MessageType, 'id' | 'created_at'>): Promise<MessageType | null> {
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
        parent_id: data.parent_id,
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

export async function updateMessage(message: Omit<MessageType, 'created_at'>): Promise<MessageType | null> {
    // Find the original message
    const originalMessage = await getMessage(message.id);

    // Increment the no_of_versions for the original message in the versions table
    let query = supabase.from('versions').select('*');
    if (originalMessage?.parent_id === null) {
        query = query.is('parent_id', null); // Use .is() to check for null
    } else {
        query = query.eq('parent_id', originalMessage?.parent_id);
    }
    
    const { data: versionData, error: versionFetchError } = await query.single();
    if (versionFetchError || !versionData) {
        console.error('Error fetching version data:', versionFetchError);
        return null;
    }

    // update no_of_versions for message being updated
    let query_ = supabase.from('versions').update({
        no_of_versions: versionData.no_of_versions + 1,
    });

    if (originalMessage?.parent_id === null) {
        query_ = query_.is('parent_id', null); // Handle the null case
    } else {
        query_ = query_.eq('parent_id', originalMessage?.parent_id);
    }

    const { error: versionUpdateError } = await query_;

    if (versionUpdateError) {
        console.error('Error updating no_of_versions:', versionUpdateError);
        return null;
    }

    // Create the new version of the message without id and branch_id
    const { id, branch_id, ...messageWithoutId } = message;
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            ...messageWithoutId,
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
    let query = supabase
        .from('messages')
        .select('*')
        .order('version', { ascending: true });

    if (parentId === null) {
        query = query.is('parent_id', null); // Handle the case where parentId is null
    } else {
        query = query.eq('parent_id', parentId); // Handle non-null parentId
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching previous versions:', error);
        return [];
    }


    return data
}

export async function getBranchMessages(branchId: string | null, startMessageCreatedAt: string | null) {
    let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

    // Handle null branchId cases
    if (branchId === null) {
        query = query.is('branch_id', null);
    } else {
        query = query.eq('branch_id', branchId);
    }

    // Add a filter to get messages created on or after the startMessage's created_at
    if (startMessageCreatedAt !== null) {
        query = query.gte('created_at', startMessageCreatedAt);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching branch messages:', error);
        return [];
    }

    return data;
}
