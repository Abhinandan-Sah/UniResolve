'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  FileText,
  Users,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  TrendingUp,
  Trophy,
  Award,
  Download,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateTestDialog } from '@/components/CreateTestDialog';
import TestEvaluation from './TestEvaluation';

interface Test {
  id: string;
  name: string;
  description: string;
  active: boolean;
  maximumMarks: number;
  createdAt: string;
  batch: {
    id: string;
    name: string;
  };
  _count: {
    questions: number;
    answers: number;
  };
}

interface StudentResult {
  studentId: string;
  studentName: string;
  regNo: number;
  email: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  answersCount: number;
  gradedCount: number;
  feedback: string;
}

interface TestAnalysis {
  totalSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  averageFeedbackLength: number;
  commonIssues: string[];
}

export default function TestDashboard() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [evaluatingTestId, setEvaluatingTestId] = useState<string | null>(null);
  const [viewResultsTestId, setViewResultsTestId] = useState<string | null>(null);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [testAnalysis, setTestAnalysis] = useState<TestAnalysis | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [editingMarkId, setEditingMarkId] = useState<string | null>(null);
  const [editingMarks, setEditingMarks] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests');
      const data = await response.json();
      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTestCreated = (newTest: Test) => {
    setTests((prev) => [...prev, newTest]);
    setIsCreateDialogOpen(false);
  };

  const toggleTestStatus = async (testId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/tests/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });

      setTests((prev) =>
        prev.map((test) =>
          test.id === testId ? { ...test, active: !currentStatus } : test
        )
      );
    } catch (error) {
      console.error('Failed to update test status:', error);
    }
  };

  const fetchTestResults = async (testId: string) => {
    setResultsLoading(true);
    try {
      const response = await fetch(`/api/tests/${testId}/evaluation`);
      if (response.ok) {
        const answers = await response.json();
        
        // Process answers to get student results
        const resultsMap = new Map<string, StudentResult>();
        const feedbackList: string[] = [];
        
        answers.forEach((answer: any) => {
          const key = answer.student.id;
          if (!resultsMap.has(key)) {
            resultsMap.set(key, {
              studentId: answer.student.id,
              studentName: answer.student.name,
              regNo: answer.student.regNo,
              email: answer.student.email,
              totalMarks: 0,
              marksObtained: 0,
              percentage: 0,
              answersCount: 0,
              gradedCount: 0,
              feedback: '',
            });
          }
          
          const result = resultsMap.get(key)!;
          result.totalMarks += answer.question.marks;
          result.marksObtained += answer.marksScored || 0;
          result.answersCount += 1;
          if (answer.marksScored > 0 || answer.remarks) {
            result.gradedCount += 1;
            if (answer.remarks) feedbackList.push(answer.remarks);
          }
          result.feedback = answer.remarks || result.feedback;
          result.percentage = result.totalMarks > 0 ? (result.marksObtained / result.totalMarks) * 100 : 0;
        });

        const results = Array.from(resultsMap.values()).sort((a, b) => 
          b.percentage - a.percentage
        );
        setStudentResults(results);

        // Calculate analysis
        if (results.length > 0) {
          const scores = results.map(r => r.percentage);
          const analysis: TestAnalysis = {
            totalSubmissions: results.length,
            averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
            highestScore: Math.max(...scores),
            lowestScore: Math.min(...scores),
            passRate: (results.filter(r => r.percentage >= 50).length / results.length) * 100,
            averageFeedbackLength: feedbackList.reduce((sum, f) => sum + f.length, 0) / Math.max(feedbackList.length, 1),
            commonIssues: [],
          };
          
          // Extract common issues from feedback
          const issuePatterns = ['unclear', 'incomplete', 'incorrect', 'missing', 'weak', 'poor', 'needs improvement'];
          const issueCounts: Record<string, number> = {};
          feedbackList.forEach(feedback => {
            issuePatterns.forEach(pattern => {
              if (feedback.toLowerCase().includes(pattern)) {
                issueCounts[pattern] = (issueCounts[pattern] || 0) + 1;
              }
            });
          });
          
          analysis.commonIssues = Object.entries(issueCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([issue]) => issue);

          setTestAnalysis(analysis);
        }
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setResultsLoading(false);
    }
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'bg-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'bg-green-500' };
    if (percentage >= 70) return { grade: 'B+', color: 'bg-blue-500' };
    if (percentage >= 60) return { grade: 'B', color: 'bg-blue-400' };
    if (percentage >= 50) return { grade: 'C', color: 'bg-yellow-500' };
    return { grade: 'F', color: 'bg-red-500' };
  };

  const totalQuestions = tests.reduce(
    (sum, test) => sum + (test._count?.questions || 0),
    0
  );
  const activeTests = tests.filter((test) => test.active).length;

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  // If evaluating a test, show the evaluation interface
  if (evaluatingTestId) {
    return (
      <TestEvaluation
        testId={evaluatingTestId}
        onBack={() => setEvaluatingTestId(null)}
      />
    );
  }

  // If viewing results for a test
  if (viewResultsTestId) {
    const test = tests.find(t => t.id === viewResultsTestId);
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  {test?.name} - Results & Analysis
                </CardTitle>
                <CardDescription>
                  Batch: {test?.batch.name} • Submissions: {test?._count.answers || 0}
                </CardDescription>
              </div>
              <Button onClick={() => setViewResultsTestId(null)} variant='outline'>
                Back to Tests
              </Button>
            </div>
          </CardHeader>
        </Card>

        {resultsLoading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          </div>
        ) : (
          <>
            {/* Analysis Cards */}
            {testAnalysis && (
              <div className='grid gap-4 md:grid-cols-5'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Submissions</CardTitle>
                    <Users className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{testAnalysis.totalSubmissions}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Average Score</CardTitle>
                    <TrendingUp className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{testAnalysis.averageScore.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Highest Score</CardTitle>
                    <Trophy className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{testAnalysis.highestScore.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Pass Rate (≥50%)</CardTitle>
                    <Award className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{testAnalysis.passRate.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Lowest Score</CardTitle>
                    <AlertCircle className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{testAnalysis.lowestScore.toFixed(1)}%</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Common Issues */}
            {testAnalysis && testAnalysis.commonIssues.length > 0 && (
              <Card className='border-blue-200 bg-blue-50'>
                <CardHeader>
                  <CardTitle className='text-base flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4' />
                    🤖 AI Analysis: Common Issues Identified
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {testAnalysis.commonIssues.map((issue, idx) => (
                      <div key={idx} className='flex items-center gap-2 text-sm'>
                        <span className='font-semibold capitalize'>{issue}:</span>
                        <span className='text-muted-foreground'>
                          Mentioned in AI feedback across multiple students
                        </span>
                      </div>
                    ))}
                    <p className='text-xs text-muted-foreground mt-4'>
                      💡 Consider reviewing the test questions or providing more guidance on these areas in future classes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Student Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Details</CardTitle>
                <CardDescription>
                  View marks, feedback, and edit grades as needed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studentResults.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    No student results yet. Upload answers and run auto-grading first.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Reg No</TableHead>
                        <TableHead className='text-center'>Marks</TableHead>
                        <TableHead className='text-center'>Percentage</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>AI Feedback</TableHead>
                        <TableHead className='text-center'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentResults.map((result) => {
                        const gradeInfo = getGrade(result.percentage);
                        return (
                          <TableRow key={result.studentId}>
                            <TableCell className='font-medium'>{result.studentName}</TableCell>
                            <TableCell>#{result.regNo}</TableCell>
                            <TableCell className='text-center'>
                              <span className='font-mono font-semibold'>
                                {result.marksObtained}/{result.totalMarks}
                              </span>
                            </TableCell>
                            <TableCell className='text-center'>
                              <span className='font-semibold text-lg'>
                                {result.percentage.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${gradeInfo.color} text-white`}>
                                {gradeInfo.grade}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='w-24'>
                                <Progress value={result.percentage} className='h-2' />
                              </div>
                            </TableCell>
                            <TableCell className='text-sm max-w-xs'>
                              {result.feedback ? (
                                <div className='text-xs bg-gray-100 p-2 rounded truncate'>
                                  {result.feedback.substring(0, 100)}...
                                </div>
                              ) : (
                                <span className='text-muted-foreground text-xs'>No feedback yet</span>
                              )}
                            </TableCell>
                            <TableCell className='text-center'>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                                    <MoreHorizontal className='h-4 w-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingMarkId(result.studentId);
                                      setEditingMarks({ [result.studentId]: result.marksObtained });
                                    }}
                                  >
                                    <Edit className='mr-2 h-4 w-4' />
                                    Edit Marks
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      alert(`Student: ${result.studentName}\nEmail: ${result.email}\n\nFeedback:\n${result.feedback || 'No feedback provided'}`);
                                    }}
                                  >
                                    <Eye className='mr-2 h-4 w-4' />
                                    View Full Feedback
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Tests</h1>
          <p className='text-muted-foreground'>
            Create and manage tests for your batches
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Create Test
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Tests</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{tests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Tests</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeTests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Questions
            </CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Marks</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {tests.reduce((sum, test) => sum + test.maximumMarks, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tests</CardTitle>
          <CardDescription>
            A list of all your tests and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>
                No tests found. Create your first test to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Max Marks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      <div>
                        <div className='font-medium'>{test.name}</div>
                        <div className='text-sm text-muted-foreground truncate max-w-[200px]'>
                          {test.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{test.batch.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={test.active ? 'default' : 'secondary'}
                        className='cursor-pointer'
                        onClick={() => toggleTestStatus(test.id, test.active)}
                      >
                        {test.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>
                        {test._count?.questions || 0} questions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {test._count?.answers || 0} submissions
                      </Badge>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {test.maximumMarks} marks
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {new Date(test.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setViewResultsTestId(test.id);
                              fetchTestResults(test.id);
                            }}
                          >
                            <BarChart3 className='mr-2 h-4 w-4' />
                            View Results & Analysis
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEvaluatingTestId(test.id)}
                          >
                            <GraduationCap className='mr-2 h-4 w-4' />
                            Evaluate & Grade
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateTestDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTestCreated={handleTestCreated}
      />
    </div>
  );
}
