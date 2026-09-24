import { adminDb } from '@/lib/firebase/firebaseAdmin';
import '@/app/globals.css';
import FeedbackList from './FeedbackList';

// Force dynamic rendering since we are fetching live DB data
export const dynamic = 'force-dynamic';

export default async function FeedbackAdminPage() {
  let feedbacks: any[] = [];
  let errorMsg = '';

  try {
    const snapshot = await adminDb.collection('feedbacks').orderBy('createdAt', 'desc').get();
    feedbacks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    errorMsg = 'Failed to load feedbacks from database.';
  }

  const totalRating = feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const avgRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : '0.0';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {errorMsg && (
          <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        {!errorMsg && (
          <FeedbackList initialFeedbacks={feedbacks} avgRating={avgRating} />
        )}

      </div>
    </div>
  );
}
