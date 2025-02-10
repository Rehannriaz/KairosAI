import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
}

export function PricingCard({
  title,
  price,
  period,
  features,
  ctaText,
  highlighted = false,
}: PricingCardProps) {
  return (
    <Card
      className={`bg-black w-full h-[400px] flex flex-col ${
        highlighted
          ? 'border-purple-500 shadow-lg shadow-purple-500/20'
          : 'border-gray-800'
      } backdrop-blur-sm`}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-400 ml-2">{period}</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <Check className="w-5 h-5 mr-2 text-purple-400" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className={`w-full ${
            highlighted
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}
