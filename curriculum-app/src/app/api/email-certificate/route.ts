import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, studentName, base64Pdf, fileName } = data;

    if (!email || !base64Pdf) {
      return NextResponse.json({ success: false, error: 'Missing email or base64Pdf' }, { status: 400 });
    }

    const gasUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
    if (!gasUrl) {
      return NextResponse.json({ success: false, error: 'Missing GAS URL' }, { status: 500 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'email_certificate',
        email,
        studentName,
        fileName: fileName || 'Certificate.pdf',
        base64Pdf
      })
    });

    const resultText = await response.text();
    let resultJson;
    try {
      resultJson = JSON.parse(resultText);
    } catch(e) {
      return NextResponse.json({ success: false, error: 'Failed to parse GAS response', raw: resultText }, { status: 500 });
    }

    if (resultJson.status === 'success') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: resultJson.message || 'Unknown error from GAS' }, { status: 500 });
    }

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
