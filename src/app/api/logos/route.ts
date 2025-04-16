import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'cars';
    
    // Check multiple possible directories for logos
    const possibleDirs = category === 'bikes' 
      ? [
          path.join(process.cwd(), 'public', 'bike-logos'),
          path.join(process.cwd(), 'public', 'bikes'),
          path.join(process.cwd(), 'public', 'logos', 'bikes'),
          path.join(process.cwd(), 'public', 'logos')
        ]
      : [
          path.join(process.cwd(), 'public', 'logos'),
          path.join(process.cwd(), 'public', 'car-logos'),
          path.join(process.cwd(), 'public', 'cars'),
        ];
        
    let logoFiles: string[] = [];
    let usedDir = '';
    
    // Try each directory until we find one with files
    for (const dir of possibleDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const imageFiles = files.filter(file => 
          ['.svg', '.png', '.jpg', '.jpeg', '.webp'].some(ext => 
            file.toLowerCase().endsWith(ext)
          )
        );
        
        if (imageFiles.length > 0) {
          logoFiles = imageFiles;
          usedDir = dir;
          console.log(`Found ${imageFiles.length} logo files in ${dir}`);
          break;
        }
      }
    }
    
    if (logoFiles.length === 0) {
      console.log(`No logo files found for category: ${category}`);
      
      // If no files found, return some default logo names without extensions
      // The client will try to resolve these with different paths/extensions
      const defaultLogos = category === 'bikes' 
        ? ['yamaha', 'honda', 'suzuki', 'kawasaki', 'ducati', 'bmw', 'ktm']
        : ['toyota', 'honda', 'ford', 'bmw', 'mercedes', 'audi', 'tesla'];
      
      return NextResponse.json({ 
        status: 'success', 
        logos: defaultLogos,
        category,
        note: 'Using default brand names without paths/extensions'
      });
    }
    
    // Format the paths appropriately
    const dirName = path.basename(usedDir);
    const logos = logoFiles.map(file => {
      const lowercaseFile = file.toLowerCase();
      return `/${dirName}/${lowercaseFile}`;
    });
    
    return NextResponse.json({ 
      status: 'success', 
      logos,
      category,
      dirUsed: dirName
    });
  } catch (error) {
    console.error('Error serving logos:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to retrieve logos'
    }, { status: 500 });
  }
}
