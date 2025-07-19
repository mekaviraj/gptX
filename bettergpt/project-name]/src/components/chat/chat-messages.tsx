import React from 'react';
import ChatMessage from './chat-message';

interface ChatMessagesProps {
    messages: { id: string; text: string; sender: string; }[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
    return (
        <div className="chat-messages">
            {messages.map(message => (
                <ChatMessage key={message.id} text={message.text} sender={message.sender} />
            ))}
        </div>
    );
};

export default ChatMessages;