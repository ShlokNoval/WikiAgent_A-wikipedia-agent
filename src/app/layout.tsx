import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'WikiAgent - AI-Powered Wikipedia Assistant',
  description: 'Factual answers powered by Wikipedia and GenAI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}