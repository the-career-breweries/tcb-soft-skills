import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function GET(request: Request) {
  try {
    const snapshot = await adminDb.collection('feedbacks').get();
    let count = 0;
    
    const batch = adminDb.batch();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (!data.courseClass || !data.theme) {
        batch.update(doc.ref, {
          courseClass: data.courseClass || 'BBA',
          theme: data.theme || 'Self-Awareness',
          sessionDate: data.sessionDate || '2026-09-22'
        });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      return NextResponse.json({ success: true, message: `Successfully backfilled ${count} documents.` });
    } else {
      return NextResponse.json({ success: true, message: 'No documents needed backfilling.' });
    }
  } catch (error: any) {
    console.error('Error backfilling feedbacks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
