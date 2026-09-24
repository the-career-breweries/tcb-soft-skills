"use client";

import { useState } from 'react';
import { Star, Send, CheckCircle2, GraduationCap } from 'lucide-react';
import '../../globals.css';

export default function FeedbackForm() {
  const today = new Date().toISOString().split('T')[0];

  const [sessionDate, setSessionDate] = useState(today);
  const [courseClass, setCourseClass] = useState('');
  const [theme, setTheme] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [suggestions, setSuggestions] = useState('');
  const [questions, setQuestions] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionDate, courseClass, theme, rating, suggestions, questions }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-page" style={{ justifyContent: 'center' }}>
        <div className="feedback-card feedback-success">
          <CheckCircle2 size={48} color="var(--accent-primary)" style={{ margin: '0 auto' }} />
          <h2>Thank You!</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Your feedback has been successfully submitted and will help us improve future sessions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      
      {/* Header */}
      <div className="feedback-header">
        <div className="feedback-icon-container">
          <GraduationCap size={24} />
        </div>
        <h1>Soft Skills Session Feedback</h1>
        <p>Let us know how your Soft Skills session went today.</p>
      </div>

      {/* Form Card */}
      <div className="feedback-card">
        <form onSubmit={handleSubmit}>
          
          {/* Session Date */}
          <div className="feedback-group">
            <label htmlFor="sessionDate" className="feedback-label">
              Date <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="sessionDate"
              type="date"
              required
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="feedback-input"
            />
          </div>

          {/* Class */}
          <div className="feedback-group">
            <label htmlFor="courseClass" className="feedback-label">
              Class <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="courseClass"
              required
              value={courseClass}
              onChange={(e) => setCourseClass(e.target.value)}
              className="feedback-input"
              style={{ backgroundColor: 'var(--bg-surface, #ffffff)', cursor: 'pointer' }}
            >
              <option value="" disabled>Select your class...</option>
              <option value="BBA">BBA</option>
              <option value="B.Sc - Section A">B.Sc - Section A</option>
              <option value="B.Sc - Section B">B.Sc - Section B</option>
            </select>
          </div>

          {/* Theme */}
          <div className="feedback-group">
            <label htmlFor="theme" className="feedback-label">
              Theme of the class <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="theme"
              type="text"
              required
              placeholder="e.g., Non-Verbal Communication"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="feedback-input"
            />
          </div>

          {/* 1. Rating */}
          <div className="feedback-group">
            <label className="feedback-label">
              1. How would you rate today's session? <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="star-btn"
                >
                  <Star
                    size={32}
                    fill={(hoverRating || rating) >= star ? '#fbbf24' : 'transparent'}
                    color={(hoverRating || rating) >= star ? '#fbbf24' : 'var(--text-muted)'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Suggestions */}
          <div className="feedback-group">
            <label htmlFor="suggestions" className="feedback-label">
              2. Suggestions or recommendations to improve next sessions?
            </label>
            <textarea
              id="suggestions"
              rows={4}
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="What did you like? What could be better?"
              className="feedback-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* 3. Questions */}
          <div className="feedback-group">
            <label htmlFor="questions" className="feedback-label">
              3. Do you have any questions from today's session?
            </label>
            <textarea
              id="questions"
              rows={3}
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Any doubts or topics you want revisited..."
              className="feedback-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            {!isSubmitting && <Send size={18} />}
          </button>
          
        </form>
      </div>
    </div>
  );
}
