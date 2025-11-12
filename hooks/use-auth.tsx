import { signup } from '@/server/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

const signInSchema = z.object({
  email: z.string().email('Inavlid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInType = z.infer<typeof signInSchema>;

const signUpSchema = z.object({
  firstname: z.string().min(1, 'firstname should be provided'),
  lastname: z.string().min(1, 'lastname should be provided'),
  email: z.string().email('Inavlid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpType = z.infer<typeof signUpSchema>;

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (data: SignInType) => {
    setIsLoading(true);
    const loginRes = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (loginRes?.error) {
      toast.error(loginRes.error);
    } else {
      setIsLoading(false);
      router.push('/dashboard/tests');
    }
    setIsLoading(false);
  };

  const handleSignUp = async (data: SignUpType) => {
    setIsLoading(true);

    const result = await signup(data);
    if (!result.success) {
      console.error(result.error);
      signUpForm.setError('root', {
        message: result.error,
      });
    }

    const loginRes = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (loginRes?.error) {
      toast.error(loginRes.error);
    } else {
      setIsLoading(false);
      router.push('/dashboard/tests');
    }
    setIsLoading(false);
  };

  // const handleSignOut = async () => {
  //   setIsLoading(true);
  //   try {
  //     await signOut();
  //     router.push('/auth/signin');
  //   } catch (error) {
  //     console.error('Sign out error:', error);
  //   }
  //   setIsLoading(false);
  // };

  return {
    signInForm,
    signUpForm,
    handleSignIn,
    handleSignUp,
    isLoading,
  };
};
