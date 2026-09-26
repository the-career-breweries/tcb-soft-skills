import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { subject, section, progress, key, details } = data;
    
    // Save to Firestore
    await adminDb.collection('erp_progress').doc(key).set({
      subject,
      section,
      progress,
      details,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving ERP progress", error);
    return NextResponse.json({ success: false, error: 'Failed to save progress' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection('erp_progress').get();
    const progressData: any = {};
    snapshot.forEach(doc => {
      progressData[doc.id] = doc.data();
    });
    return NextResponse.json({ success: true, data: progressData });
  } catch (error) {
    console.error("Error fetching ERP progress", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch progress' }, { status: 500 });
  }
}
