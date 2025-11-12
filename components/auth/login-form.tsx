'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { signInForm, handleSignIn, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = signInForm;

  return (
    <div>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={handleSubmit(handleSignIn)}
      >
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Login to your account</h1>
          <p className='text-muted-foreground text-sm text-balance'>
            Enter your email below to login to your account
          </p>
        </div>
        <div className='grid gap-6'>
          <div className='grid gap-3'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              {...register('email')}
              placeholder='m@example.com'
              required
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className='text-xs text-destructive'>{errors.email.message}</p>
            )}
          </div>
          <div className='grid gap-3'>
            <div className='flex items-center'>
              <Label htmlFor='password'>Password</Label>
              {/* <a
                href='#'
                className='ml-auto text-sm underline-offset-4 hover:underline'
              >
                Forgot your password?
              </a> */}
            </div>
            <Input
              id='password'
              type='password'
              {...register('password')}
              required
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className='text-xs text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>
          {errors.root && (
            <p className='text-xs text-destructive text-center'>
              {errors.root.message}
            </p>
          )}
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Signing In...
              </>
            ) : (
              'SignIn'
            )}
          </Button>
        </div>
      </form>
      <div className='grid gap-6 mt-6'>
        <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
          <span className='bg-background text-muted-foreground relative z-10 px-2'>
            Or continue with
          </span>
        </div>
        <Button variant='outline' className='w-full' type='button' onClick={() => signIn('google')}>
          <Image
            src='/google-logo.svg'
            alt='Google Logo'
            width={15}
            height={15}
          />
          Login with Google
        </Button>
        <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <a href='/auth/signup' className='underline underline-offset-4'>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
