'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Image, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

interface Question {
  text: string;
  marks: number;
  orderForAi: string;
}

interface Batch {
  id: string;
  name: string;
  _count: {
    students: number;
  };
}

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTestCreated: (test: any) => void;
}

export function CreateTestDialog({
  open,
  onOpenChange,
  onTestCreated,
}: CreateTestDialogProps) {
  const [testName, setTestName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', marks: 0, orderForAi: '' },
  ]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [batchesLoading, setBatchesLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchBatches();
    }
  }, [open]);

  const fetchBatches = async () => {
    setBatchesLoading(true);
    try {
      console.log('Fetching batches...'); // Debug log
      const response = await fetch('/api/batches');
      console.log('Batches response status:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Batches data:', data); // Debug log

      setBatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      setError('Failed to load batches. Please try again.');
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string | number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value as never;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', marks: 0, orderForAi: '' }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError('Image file too large. Please upload a file smaller than 10MB.');
      return;
    }

    setImageUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading image for digitization...'); // Debug log

      const response = await fetch('/api/digitize-questions', {
        method: 'POST',
        body: formData,
      });

      console.log('Digitization response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      console.log('Digitization result:', data); // Debug log

      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setUploadedImage(URL.createObjectURL(file));
      } else {
        throw new Error('Invalid response format from AI');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError(`Failed to process image: ${error.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  const calculateMaxMarks = () => {
    return questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validQuestions = questions.filter(
        (q) => q.text.trim() && q.marks > 0
      );

      if (validQuestions.length === 0) {
        setError('Please add at least one valid question');
        setLoading(false);
        return;
      }

      if (!selectedBatchId) {
        setError('Please select a batch');
        setLoading(false);
        return;
      }

      if (!testName.trim()) {
        setError('Please enter a test name');
        setLoading(false);
        return;
      }

      console.log('Submitting test:', {
        name: testName,
        description,
        batchId: selectedBatchId,
        active: isActive,
        maximumMarks: calculateMaxMarks(),
        questions: validQuestions,
      });

      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: testName,
          description,
          batchId: selectedBatchId,
          active: isActive,
          maximumMarks: calculateMaxMarks(),
          questions: validQuestions,
        }),
      });

      const responseData = await response.json();
      console.log('Test creation response:', responseData);

      if (response.ok) {
        onTestCreated(responseData);

        // Reset form
        setTestName('');
        setDescription('');
        setSelectedBatchId('');
        setIsActive(false);
        setQuestions([{ text: '', marks: 0, orderForAi: '' }]);
        setUploadedImage(null);
        setError(null);
      } else {
        setError(responseData.error || 'Failed to create test');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      setError('Network error: Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>
            Create a new test for your batch. You can add questions manually or
            upload an image to digitize them.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Test Details */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Test Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='testName'>Test Name</Label>
                  <Input
                    id='testName'
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder='e.g., Mid-term Exam'
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='batch'>Select Batch</Label>
                  <Select
                    value={selectedBatchId}
                    onValueChange={setSelectedBatchId}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Choose a batch' />
                    </SelectTrigger>
                    <SelectContent>
                      {batchesLoading ? (
                        <SelectItem value='loading' disabled>
                          Loading...
                        </SelectItem>
                      ) : batches.length === 0 ? (
                        <SelectItem value='no-batches' disabled>
                          No batches found. Create a batch first.
                        </SelectItem>
                      ) : (
                        batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name} ({batch._count?.students || 0}{' '}
                            students)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Brief description of the test'
                  rows={3}
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='active'
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor='active'>Make test active immediately</Label>
              </div>
              <div className='text-sm text-muted-foreground'>
                Maximum Marks:{' '}
                <span className='font-semibold'>{calculateMaxMarks()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload for Question Digitization */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Upload Question Sheet</CardTitle>
              <CardDescription>
                Upload an image of your question paper to automatically extract
                questions using AI
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-4'>
                <Button
                  type='button'
                  variant='outline'
                  disabled={imageUploading}
                  onClick={() =>
                    document.getElementById('imageUpload')?.click()
                  }
                >
                  {imageUploading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className='mr-2 h-4 w-4' />
                      Upload Image
                    </>
                  )}
                </Button>
                <input
                  id='imageUpload'
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
                {uploadedImage && (
                  <div className='flex items-center gap-2 text-sm text-green-600'>
                    <Image className='h-4 w-4' />
                    Image processed successfully
                  </div>
                )}
              </div>
              {uploadedImage && (
                <div className='mt-4'>
                  <img
                    src={uploadedImage}
                    alt='Uploaded question sheet'
                    className='max-w-full h-32 object-contain border rounded'
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Questions */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle className='text-lg'>Questions</CardTitle>
                <CardDescription>
                  Add questions manually or use the image upload above
                </CardDescription>
              </div>
              <Button
                type='button'
                onClick={addQuestion}
                variant='outline'
                size='sm'
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Question
              </Button>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {questions.map((question, index) => (
                  <div key={index} className='border rounded-lg p-4'>
                    <div className='flex justify-between items-start mb-4'>
                      <h4 className='font-medium'>Question {index + 1}</h4>
                      {questions.length > 1 && (
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                    <div className='grid grid-cols-1 gap-4'>
                      <div>
                        <Label htmlFor={`question-${index}`}>
                          Question Text
                        </Label>
                        <Textarea
                          id={`question-${index}`}
                          value={question.text}
                          onChange={(e) =>
                            handleQuestionChange(index, 'text', e.target.value)
                          }
                          placeholder='Enter the question...'
                          rows={3}
                          required
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <Label htmlFor={`marks-${index}`}>Marks</Label>
                          <Input
                            id={`marks-${index}`}
                            type='number'
                            min='1'
                            value={question.marks}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                'marks',
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder='0'
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`order-${index}`}>
                            AI Order/Hint
                          </Label>
                          <Input
                            id={`order-${index}`}
                            value={question.orderForAi}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                'orderForAi',
                                e.target.value
                              )
                            }
                            placeholder='e.g., Q1, Part A'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className='flex justify-end space-x-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading || batchesLoading}>
              {loading ? 'Creating...' : 'Create Test'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
