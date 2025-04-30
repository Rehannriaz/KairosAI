import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';

type FeedbackProps = {
  feedback: {
    strengths: string[];
    improvements: string[];
    tips: string[];
  };
};

export default function FeedbackSection({ feedback }: FeedbackProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ThumbsUp className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Strengths</h3>
        </div>
        <ul className="space-y-2">
          {feedback.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                +
              </Badge>
              <span className="text-sm">{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ThumbsDown className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold">Areas for Improvement</h3>
        </div>
        <ul className="space-y-2">
          {feedback.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-2">
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
              >
                -
              </Badge>
              <span className="text-sm">{improvement}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Tips & Tricks</h3>
        </div>
        <ul className="space-y-2">
          {feedback.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200"
              >
                {index + 1}
              </Badge>
              <span className="text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
