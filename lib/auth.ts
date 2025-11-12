import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) return null;

          if (user.provider === 'google') {
            throw new Error('This account uses Google login only.');
          }

          if (!user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstname} ${user.lastname}`,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login', 
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                firstname: user.name?.split(' ')[0] ?? '',
                lastname: user.name?.split(' ').slice(1).join(' ') ?? '',
                provider: 'google',
              },
            });
            user.id = newUser.id; 
          } else if (existingUser.provider !== 'google') {
            await prisma.user.update({
              where: { email: user.email! },
              data: { provider: 'google' },
            });
            user.id = existingUser.id; 
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false; 
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};