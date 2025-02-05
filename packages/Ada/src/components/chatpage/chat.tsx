'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import chatServiceInstance from '@/api/chatService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Chat({ jobID, chatID }: { jobID: string; chatID: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference for auto-scrolling

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const chat = await chatServiceInstance.getChatForSpecificJob(
          jobID,
          chatID
        );
        setMessages(chat.interview_data);
      } catch (error) {
        console.error('Error fetching chat:', error);
      } finally {
        setLoading(false);
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

    setMessages((prev) => [...prev, userMessage]);
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

  // Auto-scroll to the latest message whenever the messages array changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">Tech Corp - Mock Interview</h1>
        <p className="text-sm text-muted-foreground">AI Interview Assistant</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
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
                  <div className="flex justify-center items-center">
                    <div className="w-5 h-5 border-t-2 border-primary border-solid rounded-full animate-spin" />
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />{' '}
        {/* Invisible div to help scroll to the bottom */}
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
          {loading ? '...' : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
