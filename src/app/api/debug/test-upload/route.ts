import { NextResponse } from 'next/server';
import { imageKit, verifyImageKitConfig } from "@/lib/imageKit";

export async function POST(request: Request) {
    try {
        // Try to verify ImageKit configuration
        try {
            verifyImageKitConfig();
        } catch (configError) {
            return NextResponse.json({
                success: false,
                error: 'ImageKit configuration error',
                details: configError instanceof Error ? configError.message : 'Unknown config error'
            }, { status: 500 });
        }

        // Process the uploaded file
        const formData = await request.formData();
        const file = formData.get("file") as File;
        
        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Convert file to base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        
        // Attempt upload with detailed error handling
        try {
            const upload = await imageKit.upload({
                file: base64,
                fileName: file.name,
                folder: "/test",
                useUniqueFileName: true,
            });
            
            return NextResponse.json({
                success: true,
                url: upload.url,
                fileId: upload.fileId
            });
        } catch (uploadError: any) {
            // Detailed error reporting
            return NextResponse.json({
                success: false, 
                error: 'ImageKit upload failed',
                details: uploadError.message,
                code: uploadError.code || 'UNKNOWN',
                response: uploadError.response || {},
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Upload failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
