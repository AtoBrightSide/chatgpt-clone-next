// BranchView.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { MessageType } from '../../../lib/definitions';

interface BranchViewProps {
    messageId: string;
}

const BranchView: React.FC<BranchViewProps> = ({ messageId }) => {
    const [branches, setBranches] = useState<MessageType[]>([]);

    useEffect(() => {
        const fetchBranches = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('parent_id', messageId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching branches:', error);
            } else {
                setBranches(data);
            }
        };

        fetchBranches();
    }, [messageId]);

    return (
        <div>
            <h3>Message Branches</h3>
            <ul>
                {branches.map((branch) => (
                    <li key={branch.id}>
                        {branch.content}
                        <BranchView messageId={branch.id} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BranchView;
