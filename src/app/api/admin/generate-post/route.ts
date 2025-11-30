import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key is missing in environment variables");
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are a professional tech blogger for a high-end digital agency called "Umbrella Digital".
      The agency's tone is "Alchemy", "Mysterious", "Futuristic", and "Professional".
      
      Generate a complete blog post about the following topic: "${topic}"
      
      You must generate content in BOTH English (En) and Turkish (Tr).
      
      Output JSON format:
      {
        "slug": "kebab-case-slug-based-on-english-title",
        "readTime": 5,
        "titleEn": "English Title",
        "summaryEn": "Short English summary (max 2 sentences)",
        "contentEn": "Full English content in Markdown format. Use headers, bold text, lists, etc.",
        "tagsEn": ["Tag1", "Tag2", "Tag3"],
        "titleTr": "Turkish Title",
        "summaryTr": "Short Turkish summary (max 2 sentences)",
        "contentTr": "Full Turkish content in Markdown format. Use headers, bold text, lists, etc.",
        "tagsTr": ["Etiket1", "Etiket2", "Etiket3"],
        "imagePrompt": "A highly detailed, cinematic, abstract 3D render representing this topic. Style: Dark, Neon, Digital Alchemy, Glassmorphism, 8k resolution, Unreal Engine 5."
      }

      Instructions:
      1. Return ONLY valid JSON. Do not include markdown code blocks like \`\`\`json.
      2. The content should be substantial (at least 300 words per language).
      3. Use the specified tone.
      4. Ensure the JSON is valid and parsable.
      5. The 'imagePrompt' should be optimized for an AI image generator (like Imagen 3).
    `;

    let response;
    let lastError;
    for (let i = 0; i < 3; i++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        lastError = null;
        break;
      } catch (e: any) {
        lastError = e;
        if (e.status === 503) {
          await new Promise(r => setTimeout(r, 1500 * (i + 1)));
          continue;
        }
        break;
      }
    }

    if (lastError || !response) throw lastError || new Error("Model overloaded");

    const text = (response as any).text && typeof (response as any).text === 'function' ? (response as any).text() : 
                 response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean up markdown code blocks
    let jsonStr = text.trim();
    
    // Remove ```json and ``` markers more robustly
    if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }
    
    // Find the JSON object boundaries
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
        jsonStr = jsonStr.slice(startIdx, endIdx + 1);
    }
    
    try {
        const generatedPost = JSON.parse(jsonStr);

        // --- IMAGE GENERATION START ---
        if (generatedPost.slug && generatedPost.titleEn) {
            try {
                // Direct short prompt - same as regenerate-image route
                const imagePrompt = `Abstract 3D render: ${generatedPost.titleEn}. Style: Dark neon, glassmorphism, cinematic lighting, 16:9`;
                
                console.log("Generating image with prompt:", imagePrompt);

                // Generate Image using generateContent (same as regenerate-image)
                const imageResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: imagePrompt,
                });

                // Extract image from response
                const part = imageResponse.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
                const imageBase64 = part?.inlineData?.data;

                if (imageBase64) {
                    const buffer = Buffer.from(imageBase64, 'base64');
                    const filename = `${generatedPost.slug}-${Date.now()}.png`;
                    const uploadDir = path.join(process.cwd(), 'public', 'blog');
                    
                    await mkdir(uploadDir, { recursive: true });
                    await writeFile(path.join(uploadDir, filename), buffer);
                    
                    generatedPost.image = `/blog/${filename}`;
                    console.log("Image saved to:", generatedPost.image);
                } else {
                    throw new Error("No image data in response");
                }
            } catch (imgError) {
                console.error("Image generation failed:", imgError);
                // Fallback image
                generatedPost.image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
            }
        }
        // --- IMAGE GENERATION END ---

        return NextResponse.json(generatedPost);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        console.error("Raw Text:", text);
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
        error: 'Generation failed', 
        details: error.message || String(error),
        stack: error.stack 
    }, { status: 500 });
  }
}
