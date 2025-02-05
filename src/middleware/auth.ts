import { NextResponse , NextRequest} from 'next/server';
import { UserRole } from '@/models/User';

export function withAuth(allowedRoles: UserRole[]) {
    return async function middleware(request: NextRequest) {
        // Get user from session/token
        const user = await getUser(request); // You'll need to implement this based on your auth system

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (!allowedRoles.includes(user.role)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        return NextResponse.next();
    };
}

// Use in middleware.ts like this:
// export default withAuth(['admin']); // For admin-only routes
// export default withAuth(['admin', 'moderator']); // For admin and moderator routes
