import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { batchId, template, subject } = await request.json();

    if (!batchId || !template) {
      return NextResponse.json({ success: false, error: 'Missing batchId or template' }, { status: 400 });
    }

    const gasUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;

    if (!gasUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Sheet Webhook URL missing. Please configure NEXT_PUBLIC_GOOGLE_SHEET_URL in .env.local' 
      }, { status: 500 });
    }

    // Fetch students in this batch
    const studentsSnapshot = await adminDb.collection('students').where('batchId', '==', batchId).get();
    
    if (studentsSnapshot.empty) {
      return NextResponse.json({ success: false, error: 'No students found in this batch' }, { status: 404 });
    }

    const results = [];

    // Send emails via Google Apps Script
    for (const doc of studentsSnapshot.docs) {
      const studentData = doc.data();
      const email = studentData.email;
      const initialPassword = studentData.initialPassword || 'Password reset required';
      const name = studentData.name || 'Student';

      // Replace placeholders
      let personalizedContent = template
        .replace(/{{email}}/g, email)
        .replace(/{{password}}/g, initialPassword)
        .replace(/{{name}}/g, name);

      try {
        await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'send_email',
            to: email,
            subject: subject || 'Your Workshop Credentials',
            body: personalizedContent
          })
        });

        results.push({ email, success: true });
      } catch (err: any) {
        console.error(`Error sending email request to GAS for ${email}:`, err);
        results.push({ email, success: false, error: err.message });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error("Error in /api/send-invites:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
