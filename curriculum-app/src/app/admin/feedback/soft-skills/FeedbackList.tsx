'use client';

import React, { useState } from 'react';
import { Star, Filter, Search } from 'lucide-react';

export default function FeedbackList({ initialFeedbacks, avgRating }: { initialFeedbacks: any[], avgRating: string }) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  
  // Filter States
  const [filterDate, setFilterDate] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterTheme, setFilterTheme] = useState('');

  // Extract unique values for dropdowns
  const uniqueClasses = Array.from(new Set(initialFeedbacks.map(fb => fb.courseClass).filter(Boolean)));
  const uniqueThemes = Array.from(new Set(initialFeedbacks.map(fb => fb.theme).filter(Boolean)));
  const uniqueDates = Array.from(new Set(initialFeedbacks.map(fb => fb.sessionDate).filter(Boolean)));

  // Filter logic
  const filteredFeedbacks = initialFeedbacks.filter((fb) => {
    const matchDate = filterDate ? fb.sessionDate === filterDate : true;
    const matchClass = filterClass ? fb.courseClass === filterClass : true;
    const matchTheme = filterTheme ? fb.theme === filterTheme : true;
    return matchDate && matchClass && matchTheme;
  });

  // Calculate filtered stats
  const filteredAvgRating = filteredFeedbacks.length > 0 
    ? (filteredFeedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0) / filteredFeedbacks.length).toFixed(1) 
    : '0.0';

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Feedback Responses</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time student feedback from your sessions.</p>
        </div>
        
        <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Responses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{filteredFeedbacks.length}</div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Rating</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              {filteredAvgRating} <Star size={20} fill="#fbbf24" />
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Filter size={18} color="var(--text-muted)" />
        <span style={{ fontWeight: 600, color: 'var(--text-main)', marginRight: '0.5rem' }}>Filters:</span>
        
        <select 
          value={filterDate} 
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none' }}
        >
          <option value="">All Dates</option>
          {uniqueDates.map(date => <option key={date as string} value={date as string}>{date as string}</option>)}
        </select>

        <select 
          value={filterClass} 
          onChange={(e) => setFilterClass(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none' }}
        >
          <option value="">All Classes</option>
          {uniqueClasses.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
        </select>

        <select 
          value={filterTheme} 
          onChange={(e) => setFilterTheme(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none' }}
        >
          <option value="">All Themes</option>
          {uniqueThemes.map(t => <option key={t as string} value={t as string}>{t as string}</option>)}
        </select>
        
        {(filterDate || filterClass || filterTheme) && (
          <button 
            onClick={() => { setFilterDate(''); setFilterClass(''); setFilterTheme(''); }}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No feedback responses match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFeedbacks.map((fb) => (
            <div key={fb.id} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                
                <div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill={star <= fb.rating ? '#fbbf24' : 'transparent'} color={star <= fb.rating ? '#fbbf24' : 'var(--border-color)'} />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    <strong>Session:</strong> {fb.sessionDate} &nbsp;|&nbsp; 
                    <strong>Class:</strong> <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{fb.courseClass || 'N/A'}</span> &nbsp;|&nbsp;
                    <strong>Theme:</strong> {fb.theme || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sidebar-muted)' }}>
                    Submitted: {new Date(fb.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })} (IST)
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
    </>
  );
}
