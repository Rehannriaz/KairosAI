import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Bot } from 'lucide-react';

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

export default function ChatHistory({ messages }: { messages: Message[] }) {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 bg-card flex justify-center align-middle items-center border border-white bg-white">
                <Bot className="h-4 w-4 text-black" />
              </Avatar>
            )}

            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-popover-foreground text-popover'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>

            {message.role === 'user' && (
              <Avatar className="h-8 w-8 bg-primary flex justify-center align-middle items-center border border-white bg-white">
                <User className="h-4 w-4  text-black" />
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
