import React from 'react';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import ChatAvatar from './chat-avatar';

const ChatLayout = () => {
    return (
        <div className="chat-layout">
            <div className="chat-header">
                <ChatAvatar />
            </div>
            <div className="chat-messages-container">
                <ChatMessages />
            </div>
            <div className="chat-input-container">
                <ChatInput />
            </div>
        </div>
    );
};

export default ChatLayout;