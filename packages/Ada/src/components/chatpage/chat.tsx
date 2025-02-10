'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import chatServiceInstance from '@/api/chatService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface JobDetails {
  title: string;
  company: string;
  location: string;
  salary: string;
}

// Skeleton components
const ChatHeaderSkeleton = () => (
  <div className="border-b p-4 space-y-2">
    <Skeleton className="h-6 w-48" /> {/* Title */}
    <Skeleton className="h-4 w-36" /> {/* Subtitle */}
  </div>
);

const MessageSkeleton = ({ isUser = false }: { isUser?: boolean }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
    <Skeleton
      className={`rounded-lg h-[40px] w-[60%] ${
        isUser ? 'ml-auto' : 'mr-auto'
      }`}
    />
  </div>
);

const ChatInputSkeleton = () => (
  <div className="border-t p-4 flex gap-4">
    <Skeleton className="h-10 flex-1" /> {/* Input field */}
    <Skeleton className="h-10 w-10" /> {/* Send button */}
  </div>
);

export function Chat({ jobID, chatID }: { jobID: string; chatID: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setInitialLoading(true);
        const chat = await chatServiceInstance.getChatForSpecificJob(
          jobID,
          chatID
        );
        setMessages(chat.interview_data);
        setJobDetails({
          title: chat.title,
          company: chat.company,
          location: chat.location,
          salary: chat.salary,
        });
      } catch (error) {
        console.error('Error fetching chat:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchChat();
  }, [jobID, chatID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    // Instantly add user message without any delay or loading animation
    setMessages((prev) => [...(prev || []), userMessage]);
    setInput('');
    setLoading(true);
    setLoadingMessageId(userMessage.id);
    try {
      const data = await chatServiceInstance.postChat(input, chatID, jobID);
      if (data.res) {
        const newMessages = data.res.map((msg: any, index: number) => ({
          id: `${Date.now()}-${index}`,
          role: msg.role,
          content: msg.content,
        }));
        setMessages(newMessages);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setLoading(false);
      setLoadingMessageId(null);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (initialLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeaderSkeleton />
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <MessageSkeleton />
            <MessageSkeleton isUser />
            <MessageSkeleton />
            <MessageSkeleton isUser />
            <MessageSkeleton />
          </div>
        </ScrollArea>
        <ChatInputSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">
          {jobDetails?.title} role at {jobDetails?.company}{' '}
        </h1>
        <p className="text-sm text-muted-foreground">AI Interview Assistant</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {loadingMessageId === message.id ? (
                  <div className="flex justify-center items-center p-2">
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {loading && loadingMessageId === null && (
            <MessageSkeleton /> // Show typing indicator for AI response
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-4">
        <Input
          placeholder="Type your response..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Skeleton className="h-2 w-2" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
