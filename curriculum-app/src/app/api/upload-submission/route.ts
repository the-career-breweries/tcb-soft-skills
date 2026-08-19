import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

// Vercel / Next.js config to allow larger bodies if needed
export const maxDuration = 60; // 60 seconds

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;
    const dayId = formData.get('dayId') as string | null;

    if (!file || !userId || !dayId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const gasUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
    if (!gasUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Sheet Webhook URL missing. Please configure NEXT_PUBLIC_GOOGLE_SHEET_URL in .env.local' 
      }, { status: 500 });
    }

    // Fetch student info
    const studentDoc = await adminDb.collection('students').doc(userId).get();
    const studentData = studentDoc.data() || {};
    const studentName = studentData.name || 'Unknown Student';
    const batchId = studentData.batchId;

    // Fetch batch info
    let institutionName = '';
    if (batchId) {
      const batchDoc = await adminDb.collection('batches').doc(batchId).get();
      const batchData = batchDoc.data();
      if (batchData && batchData.name && !batchData.name.startsWith('Master:')) {
        // e.g., "XYZ College (5-Days)" -> "XYZ College"
        institutionName = batchData.name.replace(/\s*\(\d+-Days?\)/i, '').trim();
      }
    }

    // Convert file to Base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    // Create formatted filename: "Student Name_Day X Submission.pdf"
    const extension = file.name.split('.').pop() || 'pdf';
    const formattedFilename = `${studentName}_Day ${dayId} Submission.${extension}`;

    // Send to Google Apps Script
    const gasRes = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Apps Script requires plain text or x-www-form-urlencoded
      body: JSON.stringify({
        action: 'upload_file',
        filename: formattedFilename,
        mimeType: file.type || 'application/pdf',
        fileData: base64Data,
        studentName: studentName,
        institutionName: institutionName // Will be empty for individuals
      })
    });

    const responseText = await gasRes.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse GAS response:", responseText);
      return NextResponse.json({ success: false, error: 'Invalid response from Apps Script' }, { status: 500 });
    }

    if (!result.success || !result.url) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to upload to Google Drive' }, { status: 500 });
    }

    const fileUrl = result.url;

    // Update Firestore with the new file URL
    await adminDb.collection('students').doc(userId).update({
      [`submissions.day_${dayId}`]: {
        url: fileUrl,
        filename: file.name,
        submittedAt: new Date().toISOString()
      },
      // Optionally update progress state to COMPLETED if you want the server to do it
      // 'progress.state': 'COMPLETED'
    });

    return NextResponse.json({ success: true, url: fileUrl });

  } catch (error: any) {
    console.error("Error in /api/upload-submission:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
