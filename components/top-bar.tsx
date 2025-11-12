'use client';

import { FilePlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { signOut, useSession } from 'next-auth/react';

export default function Appbar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className='fixed top-0 left-0 right-0 z-50 border-bshadow-sm backdrop-blur-sm'>
      <div className='container mx-auto flex items-center justify-between py-4'>
        <div
          onClick={() => router.push('/dashboard/tests')}
          className='cursor-pointer font-bold text-xl tracking-tight hover:opacity-80 transition-opacity'
        >
          Mark<span className='text-blue-600'>Mate</span>
        </div>

        <div className='flex items-center gap-6'>
          {session?.user && (
            <div className='hidden md:flex flex-col text-right'>
              <span className='text-sm font-medium'>
                {session.user.name || session.user.email}
              </span>
              <span className='text-xs text-gray-500'>
                {session.user.email}
              </span>
            </div>
          )}

          <nav className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/dashboard/batches')}
              className='flex items-center gap-2 text-gray-700'
            >
              <LayoutDashboard size={16} />
              <span className='hidden sm:inline'>Batches</span>
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push('/dashboard/tests')} // Since you don't have a separate create page
              className='flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50'
            >
              <FilePlus size={16} />
              <span className='hidden sm:inline'>Tests</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
            >
              <LogOut size={16} />
              <span className='hidden sm:inline'>Sign Out</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
