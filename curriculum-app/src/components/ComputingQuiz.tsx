"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, RefreshCcw } from 'lucide-react';

type Question = {
  id: number;
  type: 'mcq' | 'fill' | 'truefalse';
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
};

const questions: Question[] = [
  {
    id: 1,
    type: 'fill',
    text: "Fill in the blank: The ________ is the system software that manages a computer's hardware, files and other resources.",
    correctAnswer: "Operating System",
    explanation: "The Operating System (OS) like Windows, macOS, or Linux manages all hardware and software."
  },
  {
    id: 2,
    type: 'mcq',
    text: "Which of the following is an input device?",
    options: ["Monitor", "Printer", "Keyboard", "Speaker"],
    correctAnswer: "Keyboard",
    explanation: "A keyboard is used to enter data into the computer (Input). Monitors, printers, and speakers output data."
  },
  {
    id: 3,
    type: 'truefalse',
    text: "True or False: In MS Word, a 'template' is a pre-formatted document used as a starting point for new documents.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "Templates provide a pre-designed layout (like a resume or report) to save time and ensure consistency."
  },
  {
    id: 4,
    type: 'mcq',
    text: "Which of these is considered Application Software?",
    options: ["Windows 11", "Microsoft Word", "BIOS", "Device Drivers"],
    correctAnswer: "Microsoft Word",
    explanation: "MS Word is an application designed for the user to perform specific tasks (word processing). The others are system software."
  },
  {
    id: 5,
    type: 'mcq',
    text: "When saving a document for the first time in MS Word, which command should you use?",
    options: ["Save", "Save As", "Export", "Print"],
    correctAnswer: "Save As",
    explanation: "'Save As' allows you to choose the file name, location, and format. 'Save' updates an already saved file."
  }
];

export default function ComputingQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const q = questions[currentQ];

  const handleSubmit = () => {
    if (!selected) return;
    
    // Evaluate
    const isCorrect = selected.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
    if (isCorrect) setScore(s => s + 1);
    
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected('');
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected('');
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#1e293b' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2563eb' }}>Quiz Complete!</h3>
        <p style={{ fontSize: '4rem', fontWeight: 'bold', margin: '1rem 0' }}>{score} / {questions.length}</p>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          {score === questions.length ? 'Perfect score! You are ready for the exam.' : 'Great effort! Review the recaps to brush up on the concepts.'}
        </p>
        <button onClick={restart} style={{ background: '#2563eb', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={18} /> Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', color: '#1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#334155' }}>Section A: Knowledge Check</h3>
        <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          Question {currentQ + 1} of {questions.length}
        </span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: '500', lineHeight: 1.5 }}>{q.text}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
          {q.type === 'fill' ? (
            <input 
              type="text" 
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={isSubmitted}
              placeholder="Type your answer here..."
              style={{ padding: '1rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', maxWidth: '400px' }}
            />
          ) : (
            q.options?.map((opt, i) => {
              const isSelected = selected === opt;
              const isCorrectOpt = opt === q.correctAnswer;
              
              let bg = isSelected ? '#eff6ff' : '#f8fafc';
              let border = isSelected ? '2px solid #3b82f6' : '2px solid #e2e8f0';
              let color = '#334155';

              if (isSubmitted) {
                if (isCorrectOpt) {
                  bg = '#f0fdf4'; border = '2px solid #22c55e'; color = '#15803d';
                } else if (isSelected && !isCorrectOpt) {
                  bg = '#fef2f2'; border = '2px solid #ef4444'; color = '#b91c1c';
                }
              }

              return (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: bg, border: border, borderRadius: '8px', cursor: isSubmitted ? 'default' : 'pointer', transition: 'all 0.2s', color: color, fontWeight: isSelected ? 'bold' : 'normal' }}>
                  <input 
                    type="radio" 
                    name="quiz-opt" 
                    checked={isSelected}
                    onChange={() => !isSubmitted && setSelected(opt)}
                    disabled={isSubmitted}
                    style={{ width: '1.2rem', height: '1.2rem' }}
                  />
                  <span style={{ fontSize: '1.1rem' }}>{opt}</span>
                  {isSubmitted && isCorrectOpt && <CheckCircle2 style={{ marginLeft: 'auto', color: '#22c55e' }} />}
                  {isSubmitted && isSelected && !isCorrectOpt && <XCircle style={{ marginLeft: 'auto', color: '#ef4444' }} />}
                </label>
              )
            })
          )}
        </div>
      </div>

      {isSubmitted && (
        <div style={{ padding: '1rem', background: selected.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: selected.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ? '4px solid #22c55e' : '4px solid #ef4444' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: selected.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ? '#15803d' : '#b91c1c' }}>
            {selected.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ? 'Correct!' : `Incorrect. The correct answer is: ${q.correctAnswer}`}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#334155' }}>{q.explanation}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit} 
            disabled={!selected}
            style={{ background: selected ? '#2563eb' : '#94a3b8', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: selected ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
          >
            Check Answer
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            style={{ background: '#0f172a', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
          >
            {currentQ < questions.length - 1 ? 'Next Question' : 'View Results'} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
