import React from 'react';

interface ChatAvatarProps {
    src: string;
    alt: string;
    size?: number;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ src, alt, size = 40 }) => {
    return (
        <img
            src={src}
            alt={alt}
            className={`rounded-full`}
            style={{ width: size, height: size }}
        />
    );
};

export default ChatAvatar;