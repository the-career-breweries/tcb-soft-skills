import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function GET(request: Request) {
  try {
    const snapshot = await adminDb.collection('feedbacks').get();
    let bbaCount = 0;
    let bscCount = 0;
    
    const batch = adminDb.batch();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      
      // Fix the student who selected Section A instead of Section B (Today)
      if (data.suggestions === 'I liked it very fun session' && data.questions === 'No' && data.courseClass === 'B.Sc - Section A') {
        batch.update(doc.ref, {
          courseClass: 'B.Sc - Section B'
        });
        bscCount++;
      }
      
      // Standard backfill for YESTERDAY'S 14 responses ONLY
      // We only target responses from 2026-09-22 that are missing courseClass
      if (data.sessionDate === '2026-09-22' && (!data.courseClass || data.courseClass === 'BBA')) {
        // Just in case they already ran it, this is safe to rerun
        batch.update(doc.ref, {
          courseClass: 'BBA',
          theme: data.theme || 'Self-Awareness'
        });
        bbaCount++;
      }
    });

    await batch.commit();
    return NextResponse.json({ 
      success: true, 
      message: `Successfully backfilled ${bbaCount} responses for BBA (Yesterday). Fixed ${bscCount} mislabelled document for B.Sc (Today). Other older responses were left untouched.` 
    });
  } catch (error: any) {
    console.error('Error updating feedbacks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
