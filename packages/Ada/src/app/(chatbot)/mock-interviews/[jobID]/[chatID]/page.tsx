import { Chat } from '@/components/chatpage/chat';
import { Sidebar } from '@/components/chatpage/sidebar';
import BaseHeader from '@/components/global/BaseHeader';

interface PageProps {
  params: {
    jobID: string;
    chatID: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <>
      <BaseHeader />
      <div className="flex justify-center align-top bg-background">
        <Sidebar jobID={params.jobID} chatID={params.chatID} />
        <Chat jobID={params.jobID} chatID={params.chatID} />
      </div>
    </>
  );
}
