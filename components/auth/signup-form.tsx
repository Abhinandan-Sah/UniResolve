'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { signUpForm, handleSignUp, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = signUpForm;

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit(handleSignUp)}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Create a Sketchy Account</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          Welcome! Create an account to get started
        </p>
      </div>
      <div className='grid gap-6'>
        <div className='flex items-center gap-2'>
          <div className='grid gap-3'>
            <Label htmlFor='firstname'>Firstname</Label>
            <Input
              id='firstname'
              type='text'
              placeholder=''
              {...register('firstname')}
              required
              className={errors.firstname ? 'border-destructive' : ''}
            />
            {errors.firstname && (
              <p className='text-xs text-destructive'>
                {errors.firstname.message}
              </p>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='lastname'>Lastname</Label>
            <Input
              id='lastname'
              type='text'
              placeholder=''
              {...register('lastname')}
              required
              className={errors.lastname ? 'border-destructive' : ''}
            />
            {errors.lastname && (
              <p className='text-xs text-destructive'>
                {errors.lastname.message}
              </p>
            )}
          </div>
        </div>
        <div className='grid gap-3'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='m@example.com'
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
            required
          />
          {errors.email && (
            <p className='text-xs text-destructive'>{errors.email.message}</p>
          )}
        </div>
        <div className='grid gap-3'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            required
            {...register('password')}
            className={errors.password ? 'border-destructive' : ''}
          />
          {errors.password && (
            <p className='text-xs text-destructive'>
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Creating Account...
            </>
          ) : (
            'Create your Account'
          )}
        </Button>
        <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
          <span className='bg-background text-muted-foreground relative z-10 px-2'>
            Or continue with
          </span>
        </div>
        <Button variant='outline' className='w-full' onClick={() => signIn('google')}>
          <Image
            src='/google-logo.svg'
            alt='Google Logo'
            width={15}
            height={15}
          />
          Signup with Google
        </Button>
      </div>
      <div className='text-center text-sm'>
        Already have an account?{' '}
        <a href='/auth/login' className='underline underline-offset-4'>
          Login
        </a>
      </div>
    </form>
  );
}
