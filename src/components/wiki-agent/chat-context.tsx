"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Message } from './chat-message';
import { answerQuestionWithWikipedia } from '@/ai/flows/answer-question-with-wikipedia';

export interface QueryLog {
    id: string;
    query: string;
    timestamp: Date;
    status: 'Success' | 'Failed' | 'Pending';
}

interface ChatContextType {
    messages: Message[];
    queries: QueryLog[];
    isLoading: boolean;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: (text: string) => Promise<void>;
    clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'wiki-agent-chat-data';

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! Ask me anything about Wikipedia.',
        },
    ]);
    const [queries, setQueries] = useState<QueryLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');

    // Load from LocalStorage
    useEffect(() => {
        setIsClient(true);
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.messages && parsed.messages.length > 0) {
                    setMessages(parsed.messages);
                }
                if (parsed.queries && parsed.queries.length > 0) {
                    // Revive dates
                    const revivedQueries = parsed.queries.map((q: any) => ({
                        ...q,
                        timestamp: new Date(q.timestamp)
                    }));
                    setQueries(revivedQueries);
                }
            } catch (error) {
                console.error("Failed to load chat history from local storage", error);
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (isClient) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                messages,
                queries
            }));
        }
    }, [messages, queries, isClient]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
        };

        const newQuery: QueryLog = {
            id: Date.now().toString(),
            query: text,
            timestamp: new Date(),
            status: 'Pending',
        };

        setMessages((prev) => [...prev, newMessage]);
        setQueries((prev) => [newQuery, ...prev]);
        setIsLoading(true);

        const loadingMessageId = (Date.now() + 1).toString();
        setMessages((prev) => [
            ...prev,
            {
                id: loadingMessageId,
                role: 'assistant',
                content: 'Thinking...',
            },
        ]);

        try {
            const response = await answerQuestionWithWikipedia({ question: text });

            setMessages((prev) => {
                const filtered = prev.filter(msg => msg.id !== loadingMessageId);
                return [
                    ...filtered,
                    {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: response.answer,
                        sources: response.sources
                    },
                ];
            });

            setQueries((prev) =>
                prev.map((q) => q.id === newQuery.id ? { ...q, status: 'Success' } : q)
            );
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setMessages((prev) => {
                const filtered = prev.filter(msg => msg.id !== loadingMessageId);
                return [
                    ...filtered,
                    {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: 'Sorry, I encountered an error while processing your request.',
                    },
                ];
            });
            setQueries((prev) =>
                prev.map((q) => q.id === newQuery.id ? { ...q, status: 'Failed' } : q)
            );
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Chat cleared. Ask me anything about Wikipedia.',
            },
        ]);
        setInput('');
    };

    return (
        <ChatContext.Provider value={{ messages, queries, isLoading, input, setInput, sendMessage, clearChat }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
