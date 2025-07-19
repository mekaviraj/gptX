import React from 'react';

const EnhancedInputFields: React.FC = () => {
    const [inputValue, setInputValue] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle the submission of the input value
        console.log('Submitted:', inputValue);
        setInputValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex">
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                className="flex-grow p-2 border rounded"
                placeholder="Type your message..."
            />
            <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
                Send
            </button>
        </form>
    );
};

export default EnhancedInputFields;