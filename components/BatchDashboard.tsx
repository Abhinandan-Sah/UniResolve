'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateBatchDialog } from './CreateBatchDialog';
import { ViewBatchDialog } from './ViewBatchDialog';

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

export default function BatchDashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch('/api/batches');
      const data = await response.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchCreated = (newBatch: Batch) => {
    setBatches((prev) => [...prev, newBatch]);
    setIsCreateDialogOpen(false);
  };

  const handleBatchClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsViewDialogOpen(true);
  };

  // Calculate stats safely
  const totalStudents = batches.reduce(
    (sum, batch) => sum + (batch._count?.students || 0),
    0
  );
  const totalTests = batches.reduce(
    (sum, batch) => sum + (batch._count?.tests || 0),
    0
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
            Batches
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400 mt-2'>
            Manage your student batches and track their progress
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size='lg'
          className='h-12 px-6'
        >
          <Plus className='mr-2 h-5 w-5' />
          Create New Batch
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-6 md:grid-cols-3'>
        <Card className='border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 dark:border dark:border-blue-800/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-blue-700 dark:text-blue-300 text-sm font-medium'>
                  Total Batches
                </p>
                <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>
                  {batches.length}
                </p>
              </div>
              <div className='h-12 w-12 bg-blue-200 dark:bg-blue-800/50 rounded-full flex items-center justify-center'>
                <GraduationCap className='h-6 w-6 text-blue-700 dark:text-blue-300' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 dark:border dark:border-green-800/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-green-700 dark:text-green-300 text-sm font-medium'>
                  Total Students
                </p>
                <p className='text-3xl font-bold text-green-900 dark:text-green-100'>
                  {totalStudents}
                </p>
              </div>
              <div className='h-12 w-12 bg-green-200 dark:bg-green-800/50 rounded-full flex items-center justify-center'>
                <Users className='h-6 w-6 text-green-700 dark:text-green-300' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 dark:border dark:border-purple-800/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-purple-700 dark:text-purple-300 text-sm font-medium'>
                  Active Tests
                </p>
                <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>
                  {totalTests}
                </p>
              </div>
              <div className='h-12 w-12 bg-purple-200 dark:bg-purple-800/50 rounded-full flex items-center justify-center'>
                <BookOpen className='h-6 w-6 text-purple-700 dark:text-purple-300' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batches Grid */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
            Your Batches
          </h2>
          {batches.length > 0 && (
            <p className='text-gray-600 dark:text-gray-400'>
              {batches.length} batch
              {batches.length !== 1 ? 'es' : ''} total
            </p>
          )}
        </div>

        {batches.length === 0 ? (
          <Card className='border-2 border-dashed border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800/20'>
            <CardContent className='text-center py-16'>
              <GraduationCap className='h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                No batches yet
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
                Get started by creating your first batch. Add students and
                organize them for easy test management.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} size='lg'>
                <Plus className='mr-2 h-5 w-5' />
                Create Your First Batch
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {batches.map((batch) => (
              <Card
                key={batch.id}
                onClick={() => handleBatchClick(batch)}
                className='group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/20 transition-all duration-200 border-0 shadow-lg hover:-translate-y-1 cursor-pointer bg-white dark:bg-gray-800/50 dark:border dark:border-gray-700/50 backdrop-blur-sm'
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                        {batch.name}
                      </CardTitle>
                      {batch.description && (
                        <CardDescription className='mt-1 text-gray-600 dark:text-gray-400'>
                          {batch.description}
                        </CardDescription>
                      )}
                    </div>
                    <ChevronRight className='h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
                  </div>
                </CardHeader>

                <CardContent className='space-y-4'>
                  {/* Stats */}
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      <div className='h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                        <Users className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                          {batch._count?.students || 0}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          Students
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <div className='h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center'>
                        <BookOpen className='h-4 w-4 text-green-600 dark:text-green-400' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                          {batch._count?.tests || 0}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          Tests
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Students */}
                  {batch.students && batch.students.length > 0 ? (
                    <div>
                      <p className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Recent Students
                      </p>
                      <div className='space-y-1'>
                        {batch.students.slice(0, 3).map((student) => (
                          <div
                            key={student.id}
                            className='flex items-center justify-between text-sm'
                          >
                            <span className='font-medium text-gray-900 dark:text-gray-100 truncate'>
                              {student.name}
                            </span>
                            <Badge
                              variant='outline'
                              className='text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            >
                              #{student.regNo}
                            </Badge>
                          </div>
                        ))}
                        {batch.students.length > 3 && (
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            +{batch.students.length - 3} more students
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='text-center py-3'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        No students yet
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700'>
                    <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
                      <Calendar className='h-3 w-3' />
                      {batch.createdAt
                        ? formatDate(batch.createdAt)
                        : 'Unknown date'}
                    </div>
                    <Badge
                      variant={
                        batch._count?.students > 0 ? 'default' : 'secondary'
                      }
                      className='text-xs'
                    >
                      {batch._count?.students > 0 ? 'Active' : 'Empty'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateBatchDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onBatchCreated={handleBatchCreated}
      />

      <ViewBatchDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        batch={selectedBatch}
      />
    </div>
  );
}
