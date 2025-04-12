import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await getServerSession(auth);
    
    // Don't return sensitive data, but show enough to debug auth issues
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user ? {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        // Don't include sensitive fields like id
      } : null,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get session information',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
