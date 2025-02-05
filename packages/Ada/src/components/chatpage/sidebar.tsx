'use client';
import chatServiceInstance from '@/api/chatService';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatHistory {
  id: string;
  company: string;
  position: string;
  date: string;
  lastMessage: string;
}

// Mock data - in a real app this would come from your database
const chatHistory: ChatHistory[] = [
  {
    id: '1',
    company: 'Tech Corp',
    position: 'Senior Frontend Developer',
    date: '2024-02-05',
    lastMessage: 'Tell me about your experience with React...',
  },
  {
    id: '2',
    company: 'Startup Inc',
    position: 'Full Stack Engineer',
    date: '2024-02-04',
    lastMessage: 'How do you handle state management?',
  },
  // Add more mock data as needed
];

export function Sidebar({ jobID }: { jobID: string }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const chat = await chatServiceInstance.getAllChatsForSpecificJob(jobID);
        console.log('jobs', chat);
      } catch (error) {
        console.error('Error fetching chat:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [jobID]);

  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-4 border-b">
        <Button className="w-full justify-start" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Interview
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-4">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              className="w-full text-left p-4 rounded-lg hover:bg-muted transition-colors border"
            >
              <div className="font-semibold">{chat.company}</div>
              <div className="text-sm text-muted-foreground">
                {chat.position}
              </div>
              <div className="text-xs text-muted-foreground mt-2 truncate">
                {chat.lastMessage}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
