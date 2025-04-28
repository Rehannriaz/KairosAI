'use client';

import additionalQuestionsService from '@/api/additionalQuestionsService';
import resumeServiceInstance from '@/api/resumeService';
import ResumeReviewSkeleton from '@/components/resume/ResumeReviewSkeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getUserId } from '@/lib';
import { Address, Answer, Question } from '@/types/additional-questions';
import { Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const sampleQuestions: Question[] = [
  {
    id: 'q1',
    question: 'Name of current organization',
    type: 'text',
    required: true,
  },
  {
    id: 'q2',
    question: 'Years of corporate experience',
    type: 'number',
    required: true,
  },
  {
    id: 'q3',
    question: 'How many years of experience do you have in this field?',
    type: 'number',
    required: true,
  },
  {
    id: 'q4',
    question: 'Describe your relevant experience.',
    type: 'textarea',
    required: true,
  },
  {
    id: 'q5',
    question: 'Which skills from the following list do you possess?',
    type: 'checkbox',
    options: [
      'Project Management',
      'Team Leadership',
      'Communication',
      'Problem Solving',
      'Technical Writing',
    ],
    required: false,
  },
  {
    id: 'q6',
    question: 'Are you available to start immediately?',
    type: 'radio',
    options: ['Yes', 'No'],
    required: true,
  },
  {
    id: 'q7',
    question: `Expected date of joining once you've received an offer`,
    type: 'select',
    options: ['Under 1 month', '1-2 Months', '3-4 Months', 'N/A'],
    required: true,
  },
  {
    id: 'q8',
    question: 'Select your preferred work arrangement:',
    type: 'select',
    options: ['On-site', 'Remote', 'Hybrid'],
    required: true,
  },
  {
    id: 'q9',
    question: 'What salary range are you expecting?',
    type: 'select',
    options: [
      '40,000 PKR - 60,000 PKR',
      '60,000 PKR - 80,000 PKR',
      '80,000 PKR - 100,000 PKR',
      '100,000 PKR+',
    ],
    required: true,
  },
  {
    id: 'q10',
    question: 'Marital status',
    type: 'select',
    options: ['Single', 'Married', 'Divorced', 'Widowed'],
    required: true,
  },
  {
    id: 'q11',
    question: 'Residential Address',
    type: 'address',
    required: true,
  },
  {
    id: 'q12',
    question: 'Permanent Address',
    type: 'address',
    required: true,
  },
  {
    id: 'q13',
    question: "Additional comments or information you'd like to share:",
    type: 'textarea',
    required: false,
  },
];

export default function AdditionalQuestions() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [user_id, setUserId] = useState<string | null>(null);
  useEffect(() => {
    return setUserId(getUserId() ?? null);
  }, []);
  useEffect(() => {
    const fetchQuestions = async () => {
      if (user_id) {
        try {
          setIsLoading(true);
          const questionsData =
            await additionalQuestionsService.getAdditionalQuestions();
          setQuestions(questionsData);

          // Try to load existing answers if any
          try {
            const existingAnswers =
              await additionalQuestionsService.getUsersPreviousResponse(
                user_id
              );
            console.log('existingAnswers', existingAnswers);
            if (
              existingAnswers &&
              Array.isArray(existingAnswers) &&
              existingAnswers.length > 0
            ) {
              // Make sure we're getting the right structure
              const formattedAnswers = existingAnswers.map((answer) => ({
                question_id: answer.question_id,
                answer: answer.answer,
              }));
              setAnswers(formattedAnswers);
              console.log('Formatted and set answers:', formattedAnswers);
              setAnswers(existingAnswers);
            } else {
              // Initialize answers with empty values
              const initialAnswers = sampleQuestions.map((q) => ({
                question_id: q.id,
                answer:
                  q.type === 'checkbox'
                    ? []
                    : q.type === 'address'
                    ? ({
                        street: '',
                        city: '',
                        state: '',
                        country: '',
                        postalCode: '',
                      } as Address)
                    : '',
              }));
              setAnswers(initialAnswers);
            }
          } catch (error) {
            console.log('No existing answers found, creating empty answers');
            // Initialize answers with empty values
            const initialAnswers = sampleQuestions.map((q) => ({
              question_id: q.id,
              answer:
                q.type === 'checkbox'
                  ? []
                  : q.type === 'address'
                  ? ({
                      street: '',
                      city: '',
                      state: '',
                      country: '',
                      postalCode: '',
                    } as Address)
                  : '',
            }));
            setAnswers(initialAnswers);
          }
        } catch (error) {
          console.error('Error fetching questions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [user_id]);

  // Effect to handle copying residential address to permanent address when checkbox is checked
  useEffect(() => {
    if (sameAsPermanent) {
      const residentialAddressAnswer = answers.find(
        (a) => a.question_id === 'q11'
      );
      if (
        residentialAddressAnswer &&
        typeof residentialAddressAnswer.answer === 'object' &&
        residentialAddressAnswer.answer !== null &&
        !Array.isArray(residentialAddressAnswer.answer)
      ) {
        setAnswers((prev) => {
          const newAnswers = [...prev];
          const permanentAddressIndex = newAnswers.findIndex(
            (a) => a.question_id === 'q12'
          );
          if (permanentAddressIndex >= 0) {
            // Make sure we're spreading an object
            const addressObject = residentialAddressAnswer.answer as Address;
            newAnswers[permanentAddressIndex].answer = { ...addressObject };
          }
          return newAnswers;
        });
      }
    }
  }, [sameAsPermanent, answers.find((a) => a.question_id === 'q11')?.answer]);

  const handleAnswerChange = (
    question_id: string,
    value: string | string[] | number | Address
  ) => {
    setAnswers((prev) => {
      const index = prev.findIndex((a) => a.question_id === question_id);
      if (index >= 0) {
        const newAnswers = [...prev];
        newAnswers[index].answer = value;
        return newAnswers;
      } else {
        return [...prev, { question_id, answer: value }];
      }
    });
  };

  const handleAddressChange = (
    question_id: string,
    field: keyof Address,
    value: string
  ) => {
    setAnswers((prev) => {
      const index = prev.findIndex((a) => a.question_id === question_id);
      if (index >= 0) {
        const newAnswers = [...prev];
        const currentAddress = newAnswers[index].answer as Address;
        newAnswers[index].answer = {
          ...currentAddress,
          [field]: value,
        };
        return newAnswers;
      } else {
        return [
          ...prev,
          {
            question_id,
            answer: {
              street: '',
              city: '',
              state: '',
              country: '',
              postalCode: '',
              [field]: value,
            } as Address,
          },
        ];
      }
    });
  };

  const handleCheckboxChange = (
    question_id: string,
    option: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const index = prev.findIndex((a) => a.question_id === question_id);

      if (index >= 0) {
        const newAnswers = [...prev];
        const currentAnswers = Array.isArray(newAnswers[index].answer)
          ? (newAnswers[index].answer as string[])
          : [];

        if (checked) {
          newAnswers[index].answer = [...currentAnswers, option];
        } else {
          newAnswers[index].answer = currentAnswers.filter(
            (item) => item !== option
          );
        }

        return newAnswers;
      } else {
        return [
          ...prev,
          {
            question_id,
            answer: checked ? [option] : [],
          },
        ];
      }
    });
  };

  const isOptionChecked = (questionId: string, option: string): boolean => {
    const answer = answers.find((a) => a.question_id === questionId);
    if (!answer) return false;

    return (
      Array.isArray(answer.answer) &&
      (answer.answer as string[]).includes(option)
    );
  };

  const getAnswerValue = (questionId: string): any => {
    const answer = answers.find((a) => a.question_id === questionId);
    return answer ? answer.answer : '';
  };

  const getAddressField = (
    questionId: string,
    field: keyof Address
  ): string => {
    const answer = answers.find((a) => a.question_id === questionId);
    if (!answer) return '';

    const addressAnswer = answer.answer as Address;
    return addressAnswer?.[field] || '';
  };

  // Function to check if a question has been answered
  const isQuestionAnswered = (questionId: string): boolean => {
    const answer = answers.find((a) => a.question_id === questionId);
    if (!answer) return false;

    if (typeof answer.answer === 'string') {
      return answer.answer.trim() !== '';
    } else if (typeof answer.answer === 'number') {
      return true; // A number value is present
    } else if (Array.isArray(answer.answer)) {
      return answer.answer.length > 0;
    } else if (typeof answer.answer === 'object' && answer.answer !== null) {
      // For address type, check if any field has value
      const addressValues = Object.values(answer.answer);
      return addressValues.some(
        (value) => typeof value === 'string' && value.trim() !== ''
      );
    }

    return false;
  };

  // Function to check if an address field has been filled for address asterisk toggling
  const isAddressFieldFilled = (
    questionId: string,
    field: keyof Address
  ): boolean => {
    const value = getAddressField(questionId, field);
    return value.trim() !== '';
  };

  const formatAddressForDisplay = (address: Address): string => {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.postalCode,
    ].filter(Boolean);

    return parts.join(', ');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (user_id) {
        await additionalQuestionsService.submitUsersResponse(user_id, answers);
      }
      router.push(`/resume`);
      console.log('answers', answers);
    } catch (error) {
      console.error('Error saving answers:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAddressInput = (questionId: string, required: boolean) => {
    const addressFields = [
      { key: 'street', label: 'Street Address' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State/Province' },
      { key: 'country', label: 'Country' },
      { key: 'postalCode', label: 'Postal/ZIP Code' },
    ];

    const isPermanentAddress = questionId === 'q12';

    return (
      <div className="space-y-3">
        {isPermanentAddress && (
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="same-as-residential"
              checked={sameAsPermanent}
              onCheckedChange={(checked) =>
                setSameAsPermanent(checked === true)
              }
            />
            <Label htmlFor="same-as-residential">
              Same as Residential Address
            </Label>
          </div>
        )}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
            sameAsPermanent && isPermanentAddress ? 'opacity-50' : ''
          }`}
        >
          {addressFields.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={`${questionId}-${field.key}`}>
                {field.label}
                {required &&
                  !isAddressFieldFilled(
                    questionId,
                    field.key as keyof Address
                  ) && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={`${questionId}-${field.key}`}
                value={getAddressField(questionId, field.key as keyof Address)}
                onChange={(e) =>
                  handleAddressChange(
                    questionId,
                    field.key as keyof Address,
                    e.target.value
                  )
                }
                disabled={sameAsPermanent && isPermanentAddress}
                required={required}
              />
            </div>
          ))}
        </div>

        {/* Preview of the formatted address */}
        {Object.values(getAnswerValue(questionId) as Address).some(
          (value) => value
        ) && (
          <div className="mt-3 p-3 bg-popover rounded-md">
            <p className="text-sm font-semibold">Address Preview:</p>
            <p className="text-sm">
              {formatAddressForDisplay(getAnswerValue(questionId) as Address)}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            id={question.id}
            value={getAnswerValue(question.id) || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={question.id}
            value={getAnswerValue(question.id) || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="min-h-[100px]"
            required={question.required}
          />
        );

      case 'number':
        return (
          <Input
            id={question.id}
            type="number"
            value={getAnswerValue(question.id) || ''}
            onChange={(e) =>
              handleAnswerChange(question.id, Number(e.target.value))
            }
            required={question.required}
          />
        );

      case 'select':
        return (
          <Select
            value={getAnswerValue(question.id) || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${i}`}
                  checked={isOptionChecked(question.id, option)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(question.id, option, checked === true)
                  }
                />
                <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={getAnswerValue(question.id) || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="mt-2"
          >
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem id={`${question.id}-${i}`} value={option} />
                <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'address':
        return renderAddressInput(question.id, question.required);

      default:
        return <Input />;
    }
  };

  if (isLoading) {
    return <ResumeReviewSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Additional Questions</h1>

        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label
                htmlFor={question.id}
                className="flex items-center text-base font-medium"
              >
                {question.question}
                {question.required &&
                  !isQuestionAnswered(question.id) &&
                  question.type !== 'address' && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
              </Label>
              {renderQuestionInput(question)}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
