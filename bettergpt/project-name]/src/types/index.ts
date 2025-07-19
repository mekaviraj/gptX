// This file exports TypeScript types and interfaces used throughout the project for type safety.

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
}

export interface Message {
    id: string;
    userId: string;
    content: string;
    timestamp: Date;
}

export interface ChatProps {
    messages: Message[];
    currentUser: User;
}

export interface InputFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}