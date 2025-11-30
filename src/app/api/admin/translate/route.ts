import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type = 'project' } = body;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    let prompt = '';

    if (type === 'post') {
      const { titleTr, summaryTr, contentTr, tagsTr } = body;
      prompt = `
        You are a professional translator for a digital agency blog ("The Chronicles").
        Translate the following Turkish content to English.
        Maintain the professional, "Alchemy", "Mysterious" and "Futuristic" tone.
        
        Input JSON:
        ${JSON.stringify({
          title: titleTr,
          summary: summaryTr,
          content: contentTr,
          tags: tagsTr
        })}

        Instructions:
        1. Return ONLY valid JSON.
        2. Keys should be: title, summary, content, tags.
        3. For 'tags', translate each tag.
        4. For 'content', it is Markdown. Translate the text but keep the Markdown formatting (headers, bold, links, etc.) intact.
      `;
    } else if (type === 'service') {
      const { 
        titleTr, 
        shortDescTr,
        descTr, 
        challengeTr, 
        solutionTr, 
        tagsTr, 
        deliverablesTr 
      } = body;

      prompt = `
        You are a professional translator for a digital agency service page.
        Translate the following Turkish content to English.
        Maintain the professional, "Alchemy" and "Futuristic" tone.
        
        Input JSON:
        ${JSON.stringify({
          title: titleTr,
          shortDesc: shortDescTr,
          desc: descTr,
          challenge: challengeTr,
          solution: solutionTr,
          tags: tagsTr,
          deliverables: deliverablesTr
        })}

        Instructions:
        1. Return ONLY valid JSON.
        2. Keys should be: title, shortDesc, desc, challenge, solution, tags, deliverables.
        3. For 'tags' and 'deliverables', translate each item in the array.
      `;
    } else {
      // Default to Project
      const { 
        titleTr, 
        categoryTr, 
        roleTr, 
        descTr, 
        challengeTr, 
        solutionTr, 
        tagsTr, 
        resultsTr 
      } = body;

      prompt = `
        You are a professional translator for a digital agency portfolio.
        Translate the following Turkish content to English.
        Maintain the professional, "Alchemy" and "Futuristic" tone.
        
        Input JSON:
        ${JSON.stringify({
          title: titleTr,
          category: categoryTr,
          role: roleTr,
          desc: descTr,
          challenge: challengeTr,
          solution: solutionTr,
          tags: tagsTr, // JSON string or array
          results: resultsTr // JSON string or array
        })}

        Instructions:
        1. Return ONLY valid JSON.
        2. Keys should be: title, category, role, desc, challenge, solution, tags, results.
        3. For 'tags', translate each tag.
        4. For 'results', it is an array of objects with 'label' and 'value'. Translate 'label'. Keep 'value' mostly as is, but translate words if present (e.g. "250% Artış" -> "250% Increase").
      `;
    }

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
    
    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const translated = JSON.parse(jsonStr);

    return NextResponse.json(translated);

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
