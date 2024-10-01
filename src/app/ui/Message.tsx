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
    onSelectVersion: (version: MessageType) => void;
}

const Message: React.FC<MessageProps> = ({ message, onUpdateMessage, onSelectVersion }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [previousVersions, setPreviousVersions] = useState<MessageType[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<MessageType>(message);

    useEffect(() => {
        const fetchPreviousVersions = async () => {
            const versions = await getPreviousVersions(selectedVersion.parent_id);
            setPreviousVersions(versions);

        };
        fetchPreviousVersions();
    }, [selectedVersion]);

    const handleSave = async (updatedMessage: Omit<MessageType, 'created_at' | 'updated_at'> | null) => {
        setIsEditing(false);
        if (updatedMessage) {
            await onUpdateMessage(updatedMessage);

            const versions = await getPreviousVersions(message.parent_id);
            console.log("versions: ", versions);
            setPreviousVersions(versions);
        }
    };

    const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const curr_version = Number(event.target.value);
        const selected = previousVersions.find((version) => version.version === curr_version);
        if (selected) {
            setSelectedVersion(selected);
            onSelectVersion(selected);
        }
    };

    return (
        <div>
            <div className='chat chat-end'>
                <div className="chat-bubble">
                    {selectedVersion ? selectedVersion.user_message : message.user_message}
                </div>
                <div className="chat-footer flex flex-col items-end mt-2">
                    <div className='flex gap-x-4'>
                        {previousVersions.length > 1 && (
                            <>
                                <select className="select select-ghost w-full max-w-xs" value={selectedVersion.version} onChange={handleVersionChange}>
                                    <option disabled>Previous Versions</option>
                                    {previousVersions.map((version) => (
                                        <option key={version.id} value={version.version}>Version {version.version}</option>
                                    ))}
                                </select>
                            </>
                        )}
                        <PencilIcon onClick={() => setIsEditing(true)} className="w-6 opacity-50 hover:cursor-pointer hover:opacity-85" />
                    </div>
                    {isEditing && <EditMessage message={selectedVersion} onSave={handleSave} />}
                </div>
            </div>

            <div className='chat chat-start'>
                <div className="chat-bubble">
                    {selectedVersion ? selectedVersion.gpt_response : message.gpt_response}
                </div>
            </div>
        </div>
    );
};

export default Message;
