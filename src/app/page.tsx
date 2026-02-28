import { Dashboard } from '@/components/wiki-agent/dashboard';
import { ChatProvider } from '@/components/wiki-agent/chat-context';

export default function Home() {
    return (
        <ChatProvider>
            <Dashboard />
        </ChatProvider>
    );
}