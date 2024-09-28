"use client"
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { MessageType } from '../../../lib/definitions';
import { PencilIcon } from '@heroicons/react/24/outline';
import EditMessage from './EditMessage';
import { getPreviousVersions } from '../../../lib/actions';

interface MessageProps {
    message: MessageType;
    onUpdateMessage: (updatedMessage: Omit<MessageType, 'created_at' | 'updated_at'>) => void;
}

const Message: React.FC<MessageProps> = ({ message, onUpdateMessage }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [previousVersions, setPreviousVersions] = useState<MessageType[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<MessageType>(message);

    useEffect(() => {
        const fetchPreviousVersions = async () => {
            if (selectedVersion.parent_id) {
                console.log("parent_id", selectedVersion.parent_id)
                const versions = await getPreviousVersions(selectedVersion.parent_id);
                setPreviousVersions(versions);
            }

        };
        console.log("prev versions: ", previousVersions)
        fetchPreviousVersions();
    }, [selectedVersion.parent_id]);

    const handleSave = (updatedMessage: Omit<MessageType, 'created_at' | 'updated_at'> | null) => {
        setIsEditing(false);
        if (updatedMessage) {
            console.log(updatedMessage);
            onUpdateMessage(updatedMessage);
        }
    };

    const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const versionId = event.target.value;
        const selected = previousVersions.find((version) => version.id === versionId);
        if (selected) {
            setSelectedVersion(selected);
        }
    };

    return (
        <div>
            <div className={clsx('chat', { 'chat-start': message.sender === 'gpt' }, { 'chat-end': message.sender === 'user' })}>
                <div className="chat-bubble">{selectedVersion ? selectedVersion.content : message.content}</div>
                <div className="chat-footer flex flex-col items-end mt-2">
                    {message.sender === 'user' && (
                        <div className='flex gap-x-4'>
                            {previousVersions.length > 0 && (
                                <>
                                    <select className="select select-ghost w-full max-w-xs" onChange={handleVersionChange}>
                                        <option disabled>Previous Versions</option>
                                        {previousVersions.map((version) => (
                                            <option key={version.id} value={version.id}>Version {version.version}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                            <PencilIcon onClick={() => setIsEditing(true)} className="w-6 opacity-50 hover:cursor-pointer hover:opacity-85" />
                        </div>
                    )}
                    {isEditing && <EditMessage message={message} onSave={handleSave} />}
                </div>
            </div>
        </div>
    );
};

export default Message;
