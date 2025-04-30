'use client';

import chatServiceInstance from '@/api/chatService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChatHistory {
  id: string;
  company: string;
  position: string;
  date: string;
  lastMessage: string;
}

export function Sidebar({
  jobID,
  chatID,
  onSelectChat,
}: {
  jobID: string;
  chatID: string;
  onSelectChat?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const chatData = await chatServiceInstance.getAllChatsForSpecificJob(
          jobID
        );
        const processedChats: ChatHistory[] = chatData.map((chat: any) => ({
          id: chat.interview_id,
          company: chat.company,
          position: chat.title,
          date: chat.date,
          lastMessage: `${
            chat?.interview_data?.[
              chat.interview_data.length - 1
            ]?.content?.slice(0, 10) || 'No messages'
          }...`,
        }));
        const sortedChats = processedChats.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setChatHistory(sortedChats);
      } catch (error) {
        console.error('Error fetching chat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatID, jobID]);

  const handleNewInterview = async () => {
    try {
      const newChat = await chatServiceInstance.initateChatForSpecificJob(
        jobID
      );
      router.push(`/mock-interviews/${jobID}/${newChat.interview_id}`);
      if (onSelectChat) onSelectChat();
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await chatServiceInstance.deleteChatForSpecificJob(chatId);
      setChatHistory(chatHistory.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const SkeletonItem = () => (
    <div className="w-full p-4 rounded-lg border">
      <div className="flex justify-between items-center">
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-40 mt-2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );

  return (
    <div className="w-full md:w-80 h-full border-l bg-muted/10">
      <div className="p-4">
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={handleNewInterview}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Interview
        </Button>
      </div>
      <ScrollArea className="bg-card-50/2  h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-4">
          {loading ? (
            <>
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </>
          ) : (
            chatHistory.map((chat) => (
              <div
                onClick={() => {
                  router.push(`/mock-interviews/${jobID}/${chat.id}`);
                  if (onSelectChat) onSelectChat();
                }}
                key={chat.id}
                className={`cursor-pointer bg-black sm:w-full w-[98%] text-left p-4 rounded-lg hover:bg-muted transition-colors border ${
                  chatID === chat.id ? 'border-black' : 'bg-transparent'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{chat.company}</div>
                    <div className="text-sm text-muted-foreground">
                      {chat.position}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 truncate">
                      {chat?.lastMessage || 'No messages'}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your interview history and remove your data
                          from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.id);
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
