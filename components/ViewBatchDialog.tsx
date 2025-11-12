'use client';

import React from 'react';
import { Users, BookOpen, Calendar, Mail, Hash, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Student {
  id: string;
  regNo: number;
  name: string;
  email: string;
}

interface Batch {
  id: string;
  name: string;
  description?: string;
  students: Student[];
  createdAt: string;
  _count: {
    students: number;
    tests: number;
  };
}

interface ViewBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: Batch | null;
}

export function ViewBatchDialog({
  open,
  onOpenChange,
  batch,
}: ViewBatchDialogProps) {
  if (!batch) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown date';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-start justify-between'>
            <div>
              <DialogTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {batch.name}
              </DialogTitle>
              <DialogDescription className='text-base mt-2'>
                {batch.description || 'No description provided'}
              </DialogDescription>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onOpenChange(false)}
              className='h-8 w-8 p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Stats Overview */}
          <div className='grid gap-4 md:grid-cols-3'>
            <Card className='bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30'>
              <CardContent className='p-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center'>
                    <Users className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                      Total Students
                    </p>
                    <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                      {batch._count?.students || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'>
              <CardContent className='p-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center'>
                    <BookOpen className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-green-700 dark:text-green-300'>
                      Active Tests
                    </p>
                    <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                      {batch._count?.tests || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30'>
              <CardContent className='p-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center'>
                    <Calendar className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-purple-700 dark:text-purple-300'>
                      Created
                    </p>
                    <p className='text-sm font-bold text-purple-900 dark:text-purple-100'>
                      {formatDateTime(batch.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch Details */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                Batch Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Batch Name
                  </label>
                  <p className='text-gray-900 dark:text-gray-100 font-semibold'>
                    {batch.name}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Status
                  </label>
                  <div>
                    <Badge
                      variant={
                        batch._count?.students > 0 ? 'default' : 'secondary'
                      }
                      className='mt-1'
                    >
                      {batch._count?.students > 0 ? 'Active' : 'Empty'}
                    </Badge>
                  </div>
                </div>
              </div>

              {batch.description && (
                <div>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Description
                  </label>
                  <p className='text-gray-900 dark:text-gray-100 mt-1'>
                    {batch.description}
                  </p>
                </div>
              )}

              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Created On
                </label>
                <p className='text-gray-900 dark:text-gray-100 mt-1'>
                  {formatDate(batch.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span className='flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  Students ({batch.students?.length || 0})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {batch.students && batch.students.length > 0 ? (
                <div className='border rounded-lg overflow-hidden'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                        <TableHead className='font-semibold'>Name</TableHead>
                        <TableHead className='font-semibold'>Email</TableHead>
                        <TableHead className='font-semibold'>
                          Registration No.
                        </TableHead>
                        <TableHead className='font-semibold'>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batch.students.map((student, index) => (
                        <TableRow
                          key={student.id}
                          className='hover:bg-gray-50 dark:hover:bg-gray-800/30'
                        >
                          <TableCell>
                            <div className='flex items-center gap-3'>
                              <div className='h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300'>
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <span className='font-medium text-gray-900 dark:text-gray-100'>
                                {student.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
                              <Mail className='h-4 w-4' />
                              {student.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <Hash className='h-4 w-4 text-gray-500' />
                              <Badge variant='outline' className='font-mono'>
                                {student.regNo}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant='secondary' className='text-xs'>
                              Enrolled
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className='text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600'>
                  <Users className='h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                    No students enrolled
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    This batch doesn't have any students yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
