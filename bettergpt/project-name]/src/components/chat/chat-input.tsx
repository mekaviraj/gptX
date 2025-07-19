import React, { useState } from 'react';

const ChatInput = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <input
                type="text"
                value={message}
                onChange={handleChange}
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded"
            />
            <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
                Send
            </button>
        </form>
    );
};

export default ChatInput;