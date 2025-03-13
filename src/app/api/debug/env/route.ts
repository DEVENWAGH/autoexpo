import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET(request: Request) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Return sanitized environment variables for debugging
        return NextResponse.json({
            success: true,
            imageKitConfig: {
                publicKeyExists: !!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
                privateKeyExists: !!process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpointExists: !!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
                urlEndpointValue: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to get environment info',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
