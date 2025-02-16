import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY || '',
    privateKey: process.env.PRIVATE_KEY || '',
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT || ''
});

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file = data.get('file') as File;
        
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const response = await imagekit.upload({
            file: buffer,
            fileName: file.name,
        });

        return NextResponse.json({
            url: response.url,
            fileId: response.fileId
        });

    } catch (error) {
        console.error('ImageKit upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Generate authentication parameters
        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to generate auth parameters' },
            { status: 500 }
        );
    }
}