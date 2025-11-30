import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
  try {
    const { clientName, projectType, projectDetails, language = 'tr' } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    const prompt = `
      You are an expert creative director and technical lead at a high-end digital agency called "Umbrella Digital".
      Your style is "Digital Alchemy" - mixing technology with magic, very sophisticated, slightly mysterious but professional.

      Create a detailed project proposal for a client.
      
      Client Name: ${clientName}
      Project Type: ${projectType}
      Project Details: ${projectDetails}
      Language: ${language} (Respond in this language)

      Return ONLY a valid JSON object with the following structure (no markdown, no code blocks):
      {
        "vision": "A compelling, poetic, and professional introduction paragraph describing the vision of the project. Use metaphors of alchemy, transformation, and future.",
        "scope": [
          { "title": "Scope Item Title", "description": "Detailed description of this deliverable or feature" }
        ],
        "timeline": [
          { "phase": "Phase Name", "duration": "2 weeks", "description": "What happens during this time" }
        ],
        "pricing": [
          { "item": "Core Development", "price": 5000 },
          { "item": "UI/UX Design", "price": 3000 }
        ],
        "totalPrice": 8000,
        "currency": "USD" or "TRY" based on context
      }

      Make the content sound premium, expensive, and high-quality.
    `

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    })

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Clean up markdown if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
    
    try {
      const data = JSON.parse(jsonStr)
      return NextResponse.json(data)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Raw Text:', text)
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

  } catch (error) {
    console.error('Proposal generation error:', error)
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 })
  }
}
