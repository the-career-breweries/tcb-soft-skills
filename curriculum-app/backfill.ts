import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

async function backfill() {
  const snapshot = await db.collection('feedbacks').get();
  let count = 0;
  
  const batch = db.batch();
  snapshot.forEach(doc => {
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
    console.log(`Successfully backfilled ${count} documents.`);
  } else {
    console.log('No documents needed backfilling.');
  }
}

backfill().catch(console.error);
