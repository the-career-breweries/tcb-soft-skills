const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

require('dotenv').config({ path: '.env.local' });

try {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  console.log("App initialized successfully.");
  
  const db = getFirestore();
  db.collection('test').doc('test').set({ hello: 'world' }).then(() => {
    console.log("Firestore write successful.");
    process.exit(0);
  }).catch(e => {
    console.error("Firestore write failed:", e);
  });
} catch(e) {
  console.error("Error initializing:", e);
}
