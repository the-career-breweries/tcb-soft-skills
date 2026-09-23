import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function GET(request: Request) {
  try {
    const snapshot = await adminDb.collection('feedbacks').get();
    let backfillCount = 0;
    let fixCount = 0;
    
    const batch = adminDb.batch();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      
      // Fix the student who selected Section A instead of Section B
      if (data.suggestions === 'I liked it very fun session' && data.questions === 'No' && data.courseClass === 'B.Sc - Section A') {
        batch.update(doc.ref, {
          courseClass: 'B.Sc - Section B'
        });
        fixCount++;
      }
      
      // Standard backfill
      if (!data.courseClass || !data.theme) {
        batch.update(doc.ref, {
          courseClass: data.courseClass || 'BBA',
          theme: data.theme || 'Self-Awareness',
          sessionDate: data.sessionDate || '2026-09-22'
        });
        backfillCount++;
      }
    });

    if (backfillCount > 0 || fixCount > 0) {
      await batch.commit();
      return NextResponse.json({ success: true, message: `Successfully backfilled ${backfillCount} documents. Fixed ${fixCount} mislabelled documents.` });
    } else {
      return NextResponse.json({ success: true, message: 'No documents needed updating.' });
    }
  } catch (error: any) {
    console.error('Error updating feedbacks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
