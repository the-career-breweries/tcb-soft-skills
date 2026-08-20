import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, day, workshopType } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Gemini credentials not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an expert Soft Skills & Employability curriculum designer. 
You are generating a daily curriculum for a ${workshopType} workshop. This is Day ${day}.
The user wants to generate modules based on this prompt: "${prompt}".

Return a raw JSON object (NO markdown formatting, just raw JSON) containing exactly two fields:
1. "dayTitle": A catchy title for the day.
2. "modules": An array of objects, where each object has:
  - "type": MUST be either "AUDIO_BRIEFING", "ACTIVITY", or "UPLOAD"
  - "title": A short title for the module
  - "description": 
     For AUDIO_BRIEFING: A well-written, conversational script to be read by an AI voice (200-300 words).
     For ACTIVITY: Clear, step-by-step instructions for the student to follow.
     For UPLOAD: A short instruction on what they need to submit.

Ensure the flow makes sense. Generally start with an AUDIO_BRIEFING, followed by 1 or 2 ACTIVITY blocks, ending with an UPLOAD block if appropriate.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Gemini API error: " + errorText);
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    
    // Strip markdown formatting if the model still includes it
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(text);

    return NextResponse.json({ success: true, curriculum: parsed });
  } catch (error: any) {
    console.error("Error generating curriculum:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
