'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function signup({
  firstname,
  lastname,
  email,
  password,
}: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing)
      return {
        error: 'Failed to create account. Email may already exist.',
        success: false,
      };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        provider: 'credentials',
      },
    });

    return { message: 'Email created', success: true };
  } catch (err) {
    return { error: 'Something went wrong', success: false };
  }
}
