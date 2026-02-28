"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
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

    // SECURITY-013: Query Caching
    const queryCache = useRef<Map<string, { answer: string, sources: string[] }>>(new Map());

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
                console.error("Failed to parse and load chat history from local storage.");
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

        // SECURITY-013 Check cache
        const normalizedQuery = text.trim().toLowerCase();
        if (queryCache.current.has(normalizedQuery)) {
            const cachedResult = queryCache.current.get(normalizedQuery)!;

            setMessages((prev) => {
                const filtered = prev.filter(msg => msg.id !== loadingMessageId);
                return [
                    ...filtered,
                    {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: cachedResult.answer,
                        sources: cachedResult.sources
                    },
                ];
            });

            setQueries((prev) =>
                prev.map((q) => q.id === newQuery.id ? { ...q, status: 'Success' } : q)
            );
            setIsLoading(false);
            return;
        }

        // SECURITY-009: Add loading timeout
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            setMessages((prev) => {
                const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
                return [
                    ...newMessages,
                    {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: 'Request timed out. Please try again.',
                    },
                ];
            });
            setQueries((prev) =>
                prev.map((q) => q.id === newQuery.id ? { ...q, status: 'Failed' } : q)
            );
        }, 30000); // 30 second timeout

        try {
            const response = await answerQuestionWithWikipedia({ question: text });
            clearTimeout(timeoutId);

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

            // Cache the successful result
            queryCache.current.set(normalizedQuery, {
                answer: response.answer,
                sources: response.sources
            });

        } catch (error) {
            let errorContent = 'Sorry, I encountered an error while searching Wikipedia. Please try again.';
            if (error instanceof Error) {
                if (error.message.includes('rate limit')) {
                    errorContent = "Too many requests. Please wait a moment and try again.";
                } else if (error.message.includes('quota')) {
                    errorContent = "API quota exceeded. Please try again later.";
                } else if (error.message.includes('timeout')) {
                    errorContent = "Request timed out. Please try again.";
                } else if (error.message.includes('API key')) {
                    errorContent = "API configuration error. Please contact support.";
                }
            }

            setMessages((prev) => {
                const filtered = prev.filter(msg => msg.id !== loadingMessageId);
                return [
                    ...filtered,
                    {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: errorContent,
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
