import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug and Title are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Direct short prompt - no extra LLM call needed
    const imagePrompt = `Abstract 3D render: ${title}. Style: Dark neon, glassmorphism, cinematic lighting, 16:9`;

    console.log("Generating image with prompt:", imagePrompt);

    // Generate Image
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: imagePrompt,
    });

    // Extract image from response
    const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    const imageBase64 = part?.inlineData?.data;

    if (imageBase64) {
        const buffer = Buffer.from(imageBase64, 'base64');
        const filename = `${slug}-${Date.now()}.png`;
        const uploadDir = path.join(process.cwd(), 'public', 'blog');
        
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        
        return NextResponse.json({ image: `/blog/${filename}` });
    } else {
        throw new Error("No image data in response");
    }

  } catch (error: any) {
    console.error('Image regeneration error:', error);
    return NextResponse.json({ 
        error: 'Image regeneration failed', 
        details: error.message 
    }, { status: 500 });
  }
}
