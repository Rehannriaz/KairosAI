'use client';

import feedbackService from '@/api/feedbackService';
import ChatHistory from '@/components/Mockinterviews/feedback/chat-history';
import FeedbackSection from '@/components/Mockinterviews/feedback/feedback-section';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

interface FeedbackData {
  title: string;
  date: string;
  rating: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    tips: string[];
  };
  chatHistory: Message[];
}

interface PageProps {
  params: {
    interviewID: string;
  };
}

export default function FeedbackPage({ params }: PageProps) {
  const { interviewID } = params;
  const router = useRouter();

  const [interviewData, setInterviewData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await feedbackService.getInterviewWithFeedback(
          interviewID
        );
        console.log('data', data);
        if (!data) {
          // router.replace('/404');
          return;
        }
        setInterviewData(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        router.replace('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [interviewID, router]);

  if (loading) {
    return <div className="p-8 text-center">Loading feedback...</div>;
  }

  if (!interviewData) {
    return null; // Already redirected to 404
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {interviewData.title}
            </h1>
            <p className="text-muted-foreground">{interviewData.date}</p>
          </div>

          <div className="flex items-center gap-2 bg-card p-3 rounded-lg">
            <div className="text-right">
              <p className="text-sm font-medium">Overall Rating</p>
              <p className="text-3xl font-bold">{interviewData.rating}/10</p>
            </div>
            <RatingIndicator rating={interviewData.rating} />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat History Section */}
          <div className="lg:col-span-2">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                Interview Transcript
              </h2>
              <ChatHistory messages={interviewData.chatHistory} />
            </Card>
          </div>

          {/* Feedback Section */}
          <div className="lg:col-span-1">
            <FeedbackSection feedback={interviewData.feedback} />
          </div>
        </div>
      </div>
    </main>
  );
}

function RatingIndicator({ rating }: { rating: number }) {
  let gradient = 'from-red-400 to-red-600';

  if (rating >= 8) {
    gradient = 'from-green-400 to-green-600';
  } else if (rating >= 6) {
    gradient = 'from-yellow-300 to-yellow-500';
  } else if (rating >= 4) {
    gradient = 'from-orange-400 to-orange-600';
  }

  return (
    <div
      className={`w-4 h-16 bg-gradient-to-b ${gradient} rounded-xl shadow-md transition-all duration-300`}
    />
  );
}
