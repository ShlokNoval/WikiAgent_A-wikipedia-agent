'use client';

import React, { useState } from 'react';
import { ChatMessage, Message } from './chat-message';

export default function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! Ask me anything about Wikipedia.',
        },
    ]);

    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput('');

        // Temporary placeholder for AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: 'AI response will appear here.',
                },
            ]);
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto p-6">
            <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 border rounded-md px-3 py-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about anything..."
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-primary text-white rounded-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
}