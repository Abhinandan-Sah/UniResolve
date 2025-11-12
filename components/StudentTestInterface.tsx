'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Save, Send, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface Question {
  id: string;
  text: string;
  marks: number;
  orderForAi: string;
}

interface Test {
  id: string;
  name: string;
  description: string;
  maximumMarks: number;
  questions: Question[];
}

interface StudentTestInterfaceProps {
  testId: string;
  studentId: string;
}

export default function StudentTestInterface({
  testId,
  studentId,
}: StudentTestInterfaceProps) {
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTest();
    fetchExistingAnswers();
  }, [testId, studentId]);

  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitTest();
    }
  }, [timeRemaining, isSubmitted]);

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}/take`);
      const data = await response.json();
      setTest(data);
    } catch (error) {
      console.error('Failed to fetch test:', error);
      toast({
        title: 'Error',
        description: 'Failed to load test',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAnswers = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}/answers/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        const answerMap: Record<string, string> = {};
        data.forEach((answer: any) => {
          answerMap[answer.questionId] = answer.answer;
        });
        setAnswers(answerMap);
        if (data.length > 0 && data[0].submitted) {
          setIsSubmitted(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch existing answers:', error);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const saveAnswers = async () => {
    setSaving(true);
    try {
      await fetch(`/api/tests/${testId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });
      toast({
        title: 'Saved',
        description: 'Your answers have been saved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save answers',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    try {
      await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });
      setIsSubmitted(true);
      toast({
        title: 'Submitted',
        description: 'Your test has been submitted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit test',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!test) return 0;
    const answeredQuestions = test.questions.filter((q) =>
      answers[q.id]?.trim()
    ).length;
    return (answeredQuestions / test.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!test) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>Test not found or not available</AlertDescription>
      </Alert>
    );
  }

  if (isSubmitted) {
    return (
      <Card className='max-w-2xl mx-auto'>
        <CardHeader className='text-center'>
          <CardTitle className='text-green-600'>
            Test Submitted Successfully!
          </CardTitle>
          <CardDescription>
            Your test "{test.name}" has been submitted. Results will be
            available after grading.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle>{test.name}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </div>
            <div className='text-right space-y-2'>
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                <span
                  className={`font-mono text-lg ${
                    timeRemaining < 300 ? 'text-red-600' : ''
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Badge variant='outline'>Max Marks: {test.maximumMarks}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Progress</span>
              <span>{Math.round(getProgress())}% Complete</span>
            </div>
            <Progress value={getProgress()} />
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className='space-y-6'>
        {test.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className='text-lg'>
                Question {index + 1} ({question.marks} marks)
              </CardTitle>
              {question.orderForAi && (
                <Badge variant='secondary' className='w-fit'>
                  {question.orderForAi}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <p className='text-gray-700 whitespace-pre-wrap'>
                  {question.text}
                </p>
                <Textarea
                  value={answers[question.id] || ''}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  placeholder='Write your answer here...'
                  rows={6}
                  className='min-h-[150px]'
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex justify-between'>
            <Button onClick={saveAnswers} disabled={saving} variant='outline'>
              {saving ? (
                <>
                  <Save className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Save Draft
                </>
              )}
            </Button>
            <Button
              onClick={handleSubmitTest}
              disabled={submitting}
              className='bg-green-600 hover:bg-green-700'
            >
              {submitting ? (
                <>
                  <Send className='mr-2 h-4 w-4 animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className='mr-2 h-4 w-4' />
                  Submit Test
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
