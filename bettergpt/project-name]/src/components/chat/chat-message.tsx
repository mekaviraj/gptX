import React from 'react';

interface ChatMessageProps {
    username: string;
    message: string;
    timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ username, message, timestamp }) => {
    return (
        <div className="chat-message">
            <div className="chat-message-header">
                <span className="chat-message-username">{username}</span>
                <span className="chat-message-timestamp">{timestamp}</span>
            </div>
            <div className="chat-message-content">
                {message}
            </div>
        </div>
    );
};

export default ChatMessage;