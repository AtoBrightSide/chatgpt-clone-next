// PreviousVersions.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { MessageType } from '../../../lib/definitions';

interface PreviousVersionsProps {
    messageId: string;
}

const PreviousVersions: React.FC<PreviousVersionsProps> = ({ messageId }) => {
    const [versions, setVersions] = useState<MessageType[]>([]);

    useEffect(() => {
        const fetchVersions = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('parent_id', messageId)
                .order('version', { ascending: true });

            if (error) {
                console.error('Error fetching versions:', error);
            } else {
                setVersions(data);
            }
        };

        fetchVersions();
    }, [messageId]);

    return (
        <div>
            <h3>Previous Versions</h3>
            <ul>
                {versions.map((version) => (
                    <li key={version.id}>{version.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default PreviousVersions;
