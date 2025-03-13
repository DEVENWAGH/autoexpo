import { imageKit, verifyImageKitConfig } from "@/lib/imageKit";
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    console.log('Verifying ImageKit config...');
    if (!imageKit) {
      console.error('ImageKit not initialized');
      return NextResponse.json({
        success: false,
        error: 'ImageKit configuration error',
        details: 'Service not properly configured'
      }, { status: 500 });
    }

    verifyImageKitConfig();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "/vehicles";

    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      folder: folder
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    try {
      console.log('Attempting ImageKit upload...');
      const upload = await imageKit.upload({
        file: base64,
        fileName: file.name,
        folder: folder,
        useUniqueFileName: true,
      });

      console.log('Upload successful:', {
        url: upload.url,
        fileId: upload.fileId
      });

      return NextResponse.json({
        success: true,
        url: upload.url,
        fileId: upload.fileId
      });

    } catch (uploadError) {
      console.error('ImageKit upload error:', uploadError);
      return NextResponse.json({
        success: false,
        error: 'ImageKit upload failed',
        details: uploadError instanceof Error ? uploadError.message : 'Unknown upload error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({
      success: false,
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
    try {
        // Generate authentication parameters
        const authenticationParameters = imageKit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to generate auth parameters' },
            { status: 500 }
        );
    }
}