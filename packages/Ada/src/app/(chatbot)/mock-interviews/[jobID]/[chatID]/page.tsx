import { Chat } from '@/components/chatpage/chat';
import { Sidebar } from '@/components/chatpage/sidebar';
import BaseHeader from '@/components/global/BaseHeader';
import { Header } from '@/components/header';

interface PageProps {
  params: {
    jobID: string;
    chatID: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <>
      <div className="bg-background flex-1">
        <Header />
      </div>
      <div className="flex justify-center align-top bg-background">
        <Sidebar jobID={params.jobID} chatID={params.chatID} />
        <Chat jobID={params.jobID} chatID={params.chatID} />
      </div>
    </>
  );
}
