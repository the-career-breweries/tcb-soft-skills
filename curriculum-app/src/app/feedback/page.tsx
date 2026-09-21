"use client";

import { useState } from 'react';
import { Star, Send, CheckCircle2, GraduationCap } from 'lucide-react';
import '../globals.css';

export default function FeedbackForm() {
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // TODO: Connect to backend/Firebase here if needed
    console.log({ rating, suggestions, questions });
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your feedback has been successfully submitted and will help us improve future sessions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header */}
      <div className="max-w-xl w-full mx-auto mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4">
          <GraduationCap size={28} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Session Feedback
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Help us improve your learning experience.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-xl w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              1. How would you rate today's session? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating === 0 && (
              <p className="text-xs text-red-500 mt-2">Please provide a rating</p>
            )}
          </div>

          {/* 2. Suggestions */}
          <div>
            <label htmlFor="suggestions" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              2. Suggestions or recommendations to improve next sessions?
            </label>
            <textarea
              id="suggestions"
              rows={4}
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="What did you like? What could be better?"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          {/* 3. Questions */}
          <div>
            <label htmlFor="questions" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              3. Do you have any questions from today's session?
            </label>
            <textarea
              id="questions"
              rows={3}
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Any doubts or topics you want revisited..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              {!isSubmitting && <Send size={18} />}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
