'use client';

import chatServiceInstance from '@/api/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Send } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

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

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0s]" />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.15s]" />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
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
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setInitialLoading(true);
        const chat = await chatServiceInstance.getChatForSpecificJob(
          jobID,
          chatID
        );
        const initialWelcomeMessage: Message = {
          id: '1',
          role: 'assistant',
          content: `Hello and Welcome to your AI Mock Interview at ${chat.company} ! I'm here to help you prepare for your actual interview. Please start off by introducing yourself!`,
        };
        const loadedMessages = chat?.interview_data?.length
          ? [initialWelcomeMessage, ...chat.interview_data]
          : [initialWelcomeMessage];

        setMessages(loadedMessages);
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

    // Add user message to the chat
    setMessages((prev) => [...(prev || []), userMessage]);
    setInput('');
    setLoading(true);
    setIsStreaming(true);

    // Create a placeholder message for the assistant response
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Start streaming the response
      await chatServiceInstance.streamChat(input, chatID, jobID, (chunk) => {
        // Update the assistant message with each new chunk
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg.id === assistantMessageId) {
              return {
                ...msg,
                content: msg.content + chunk,
              };
            }
            return msg;
          });
        });
      });
    } catch (error) {
      console.error('Error fetching response:', error);

      // Handle error in UI
      setMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content:
                'Sorry, there was an error processing your request. Please try again.',
            };
          }
          return msg;
        });
      });
    } finally {
      setLoading(false);
      setIsStreaming(false);
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
                {message.content}
                {message.id === messages[messages.length - 1].id &&
                  message.role === 'assistant' &&
                  isStreaming && (
                    <span className="inline-block animate-pulse">▋</span>
                  )}
              </div>
            </div>
          ))}
          {loading && !isStreaming && <TypingIndicator />}
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
            <Skeleton className="h-4 w-4 rounded-full" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
