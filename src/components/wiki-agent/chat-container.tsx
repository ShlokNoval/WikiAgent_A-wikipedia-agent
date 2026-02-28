'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './chat-message';
import { useChat } from './chat-context';
import { BookOpen, Send, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const MAX_INPUT_LENGTH = 500;
const MIN_REQUEST_INTERVAL = 2000;

export default function ChatContainer() {
    const { messages, isLoading, input, setInput, sendMessage, clearChat } = useChat();
    const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // SECURITY-011: Rate limiting
        const now = Date.now();
        if (now - lastSubmitTime < MIN_REQUEST_INTERVAL) {
            return; // Silently ignore rapid submissions
        }
        setLastSubmitTime(now);

        // SECURITY-010: Input length validation
        if (input.trim().length > MAX_INPUT_LENGTH) {
            // Can handle this gracefully in UI instead of sending a message, but keeping consistent with audit for now
            alert(`Question is too long. Please keep it under ${MAX_INPUT_LENGTH} characters.`);
            return;
        }

        const currentInput = input;
        setInput('');
        await sendMessage(currentInput);
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto bg-white rounded-xl shadow border overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b bg-slate-50/50 justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-slate-700">Wiki Agent</h2>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Clear</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your chat history with the WikiAgent.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={clearChat}>
                                Yes, delete chat
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex flex-col gap-6 p-6 overflow-y-auto min-h-[400px] max-h-[600px] bg-[#f4fbfc]">
                {messages.map((msg) => {
                    if (msg.content === 'Thinking...') {
                        return (
                            <div key={msg.id} className="flex justify-start w-full gap-3">
                                <div className="flex bg-white text-slate-800 p-4 border shadow-sm rounded-2xl rounded-tl-sm w-48 flex-col gap-2">
                                    <span className="text-sm font-medium animate-pulse text-primary">Thinking...</span>
                                    <Progress value={45} className="h-1 animate-pulse" />
                                </div>
                            </div>
                        )
                    }
                    return <ChatMessage key={msg.id} message={msg} />
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
                <div className="flex items-end gap-2 bg-slate-100 rounded-2xl px-3 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Textarea
                        className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-700 resize-none min-h-[44px] max-h-[120px] py-3 px-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type your message... (Shift+Enter for new line)"
                        disabled={isLoading}
                        rows={1}
                    />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-[#2998d6] hover:bg-sky-600 rounded-full h-10 w-10 p-0 shrink-0 mb-1 flex items-center justify-center text-white"
                            >
                                <Send className="w-4 h-4 ml-[-2px]" />
                                <span className="sr-only">Send message</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Send message</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}