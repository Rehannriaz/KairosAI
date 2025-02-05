import { Chat } from '@/components/chatpage/chat';
import { Sidebar } from '@/components/chatpage/sidebar';

interface PageProps {
  params: {
    jobID: string;
    chatID: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar jobID={params.jobID} />
      <Chat jobID={params.jobID} chatID={params.chatID} />
    </div>
  );
}
