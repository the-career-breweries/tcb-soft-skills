import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function GET(request: Request) {
  try {
    const snapshot = await adminDb.collection('feedbacks').get();
    
    const summary = snapshot.docs.map(doc => {
      const d = doc.data();
      return { 
        id: doc.id, 
        sessionDate: d.sessionDate, 
        courseClass: d.courseClass || 'MISSING', 
        theme: d.theme || 'MISSING', 
        createdAt: d.createdAt,
        suggestions: d.suggestions,
        rating: d.rating
      };
    });

    return NextResponse.json({ total: snapshot.docs.length, summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
