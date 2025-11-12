'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Upload, AlertCircle } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Student {
  name: string;
  email: string;
  regNo: number;
}

interface Batch {
  id: string;
  name: string;
  description?: string;
  students: any[];
  _count: {
    students: number;
    tests: number;
  };
}

interface CreateBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBatchCreated: (batch: Batch) => void;
}

export function CreateBatchDialog({
  open,
  onOpenChange,
  onBatchCreated,
}: CreateBatchDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailedErrors, setDetailedErrors] = useState<string[]>([]);

  const addStudent = () => {
    setStudents([...students, { name: '', email: '', regNo: 0 }]);
  };

  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const updateStudent = (
    index: number,
    field: keyof Student,
    value: string | number
  ) => {
    const updatedStudents = [...students];
    updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    setStudents(updatedStudents);
  };

  const validateStudents = () => {
    const errors: string[] = [];

    students.forEach((student, index) => {
      if (!student.name.trim()) {
        errors.push(`Student ${index + 1}: Name is required`);
      }
      if (!student.email.trim()) {
        errors.push(`Student ${index + 1}: Email is required`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
        errors.push(`Student ${index + 1}: Invalid email format`);
      }
      if (!student.regNo || student.regNo === 0) {
        errors.push(`Student ${index + 1}: Registration number is required`);
      }

      // Only check for duplicates within this batch (not globally)
      const duplicateInBatch = students.find(
        (s, i) =>
          i !== index && s.regNo === student.regNo && student.regNo !== 0
      );

      if (duplicateInBatch) {
        errors.push(
          `Student ${index + 1}: Registration number ${
            student.regNo
          } is used by another student in this batch`
        );
      }

      const duplicateEmailInBatch = students.find(
        (s, i) =>
          i !== index &&
          s.email.toLowerCase() === student.email.toLowerCase() &&
          student.email.trim() !== ''
      );

      if (duplicateEmailInBatch) {
        errors.push(
          `Student ${index + 1}: Email ${
            student.email
          } is used by another student in this batch`
        );
      }
    });

    return errors;
  };

  const handleSubmit = async () => {
    setError(null);
    setDetailedErrors([]);

    if (!name.trim()) {
      setError('Batch name is required');
      return;
    }

    const validationErrors = validateStudents();
    if (validationErrors.length > 0) {
      setError('Please fix the following errors:');
      setDetailedErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          students: students.map((s) => ({
            name: s.name.trim(),
            email: s.email.trim().toLowerCase(),
            regNo: Number(s.regNo),
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onBatchCreated(data);
        resetForm();
        onOpenChange(false);
      } else {
        setError(data.error || 'Failed to create batch');
        if (data.details && Array.isArray(data.details)) {
          setDetailedErrors(data.details);
        }
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      setError('Failed to create batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setStudents([]);
    setError(null);
    setDetailedErrors([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create New Batch</DialogTitle>
          <DialogDescription>
            Create a new batch and add students. Registration numbers can be
            duplicate across different batches.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Batch Details */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='name'>Batch Name *</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g., Computer Science 2024'
              />
            </div>
            <div>
              <Label htmlFor='description'>Description</Label>
              <Input
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Optional description'
              />
            </div>
          </div>

          {/* Students */}
          <div>
            <div className='flex justify-between items-center'>
              <Label>Students ({students.length})</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addStudent}
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Student
              </Button>
            </div>

            {students.length > 0 && (
              <div className='mt-2 border rounded-md'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name *</TableHead>
                      <TableHead>Email *</TableHead>
                      <TableHead>Reg No *</TableHead>
                      <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={student.name}
                            onChange={(e) =>
                              updateStudent(index, 'name', e.target.value)
                            }
                            placeholder='Student name'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={student.email}
                            onChange={(e) =>
                              updateStudent(index, 'email', e.target.value)
                            }
                            placeholder='email@example.com'
                            type='email'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={student.regNo || ''}
                            onChange={(e) =>
                              updateStudent(
                                index,
                                'regNo',
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder='Registration number'
                            type='number'
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => removeStudent(index)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                {error}
                {detailedErrors.length > 0 && (
                  <ul className='mt-2 list-disc list-inside'>
                    {detailedErrors.map((err, index) => (
                      <li key={index} className='text-sm'>
                        {err}
                      </li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create Batch'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
