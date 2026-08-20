import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, modId, workshopType, day } = await request.json();

    if (!text) {
      return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    const gasUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;

    if (!apiKey || !voiceId) {
      return NextResponse.json({ success: false, error: 'ElevenLabs credentials not configured' }, { status: 500 });
    }
    
    if (!gasUrl) {
      return NextResponse.json({ success: false, error: 'Google Sheet Webhook URL missing' }, { status: 500 });
    }

    // Call ElevenLabs API
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + voiceId, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("ElevenLabs API error: " + errorText);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');

    // Upload directly to Google Drive via the existing Apps Script webhook!
    const formattedFilename = `Master_${workshopType}_Day${day}_Audio_${modId}.mp3`;
    
    const gasRes = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'upload_file',
        filename: formattedFilename,
        mimeType: 'audio/mpeg',
        fileData: base64Audio,
        studentName: 'AI Audio System',
        institutionName: 'Curriculum Audio'
      })
    });

    const responseText = await gasRes.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Invalid response from Apps Script: ' + responseText);
    }

    if (!result.success || !result.url) {
      throw new Error(result.error || 'Failed to upload to Google Drive');
    }

    // Google Drive returns a view link: https://drive.google.com/file/d/FILE_ID/view
    // We must convert this to a direct streaming link for the <audio> tag
    let streamUrl = result.url;
    const match = result.url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      streamUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    return NextResponse.json({ success: true, audioUrl: streamUrl });
  } catch (error: any) {
    console.error("Error generating audio:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
