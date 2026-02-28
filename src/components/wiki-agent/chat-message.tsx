import React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Globe, User, Bot } from 'lucide-react';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources?: string[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] gap-3", isUser ? "flex-row-reverse" : "flex-row")}>

        {/* Avatar */}
        <div className="shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-500">
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
          </div>
        </div>

        {/* Message Content */}
        <div className={cn("flex flex-col gap-2 w-full", isUser ? "items-end" : "items-start")}>
          <div
            className={cn(
              'p-4 text-sm leading-relaxed shadow-sm rounded-2xl inline-block max-w-full',
              isUser
                ? 'bg-[#2998d6] text-white rounded-tr-sm'
                : 'bg-white text-slate-800 border rounded-tl-sm'
            )}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {message.content}
          </div>

          {message.sources && message.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {message.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source?.startsWith('https://') ? source : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <Globe className="h-3.5 w-3.5" />
                  @ Wikipedia Reference {idx + 1}
                  <ExternalLink className="h-3 w-3 opacity-70 ml-0.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}