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

async function fixFeedback() {
  const snapshot = await db.collection('feedbacks')
    .where('suggestions', '==', 'I liked it very fun session')
    .where('questions', '==', 'No')
    .get();
  
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  snapshot.forEach(async (doc) => {
    console.log(`Found doc: ${doc.id}, current class: ${doc.data().courseClass}`);
    await doc.ref.update({
      courseClass: 'B.Sc - Section B'
    });
    console.log(`Updated doc ${doc.id} to B.Sc - Section B`);
  });
}

fixFeedback().catch(console.error);
