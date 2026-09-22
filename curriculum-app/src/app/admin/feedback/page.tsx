import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { Star } from 'lucide-react';
import '@/app/globals.css';

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

  // Calculate Average Rating
  const totalRating = feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const avgRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : '0.0';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Feedback Responses</h1>
            <p style={{ color: 'var(--text-muted)' }}>Real-time student feedback from your sessions.</p>
          </div>
          
          <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Responses</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{feedbacks.length}</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Rating</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {avgRating} <Star size={20} fill="#fbbf24" />
              </div>
            </div>
          </div>
        </header>

        {errorMsg && (
          <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        {feedbacks.length === 0 && !errorMsg ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No feedback responses yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.map((fb) => (
              <div key={fb.id} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  
                  <div>
                    <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill={star <= fb.rating ? '#fbbf24' : 'transparent'} color={star <= fb.rating ? '#fbbf24' : 'var(--border-color)'} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>Session:</strong> {fb.sessionDate} &nbsp;|&nbsp; 
                      <strong>Submitted:</strong> {new Date(fb.createdAt).toLocaleString()}
                    </div>
                  </div>

                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Suggestions / Likes</h4>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {fb.suggestions || <span style={{ color: 'var(--text-sidebar-muted)', fontStyle: 'italic' }}>None provided</span>}
                    </p>
                  </div>
                  <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Questions</h4>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {fb.questions || <span style={{ color: 'var(--text-sidebar-muted)', fontStyle: 'italic' }}>None provided</span>}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
