import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SessionProvider } from 'next-auth/react';
import { SessionProviderWrapper } from '@/components/providers/sessionProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MarkMate',
  description: 'A platform for creating and managing tests',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute={'class'}
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
            <main>
              <SessionProviderWrapper>
                {children}
              </SessionProviderWrapper>
            </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
