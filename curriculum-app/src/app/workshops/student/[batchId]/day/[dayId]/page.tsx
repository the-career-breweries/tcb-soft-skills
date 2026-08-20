"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, PlayCircle, PauseCircle, Square, UploadCloud, CheckCircle2, FileText, Settings2 } from 'lucide-react';
import { getStudentProgress, updateStudentProgress } from '@/lib/firebase/studentOps';
import { storage, db } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import '../../../../workshops.css';

export default function WorkshopDayView() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const dayId = params.dayId as string;
  
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [audioProgress, setAudioProgress] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  const [batchData, setBatchData] = useState<any>(null);

  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/workshops/student');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        const progress = await getStudentProgress(user.uid);
        const batchDoc = await getDoc(doc(db, 'batches', params.batchId as string));
        if (batchDoc.exists()) {
          const bData = batchDoc.data();
          let wType = '3-Days';
          if (bData.name?.includes('5') || bData.totalDays === 5) wType = '5-Days';
          if (bData.name?.includes('10') || bData.totalDays === 10) wType = '10-Days';
          
          // Fetch Master Curriculum
          const masterDoc = await getDoc(doc(db, 'master_curriculums', wType));
          if (masterDoc.exists()) {
             bData.curriculum = masterDoc.data();
          }
          setBatchData(bData);
        }
        
        if (progress?.completedDays?.includes(dayId)) {
          // If already completed, just show the last state or a success screen
          setCurrentModuleIndex(-1); // -1 means completed
        } else {
          // In a real app we'd save `currentModuleIndex` to Firebase to persist state,
          // for now we start at 0 or read from progress
          setCurrentModuleIndex(0);
        }
        setIsInitializing(false);
      }
    };
    if (user && !loading) fetchProgress();
  }, [user, loading, params.batchId, dayId]);

  const advanceModule = async (totalModules: number) => {
    if (currentModuleIndex + 1 >= totalModules) {
      // Completed all modules for the day
      await updateStudentProgress(user!.uid, { 
        state: 'COMPLETED',
        [`completedDays`]: (prev: any) => {
           const arr = prev || [];
           if(!arr.includes(dayId)) return [...arr, dayId];
           return arr;
        }
      });
      setCurrentModuleIndex(-1);
    } else {
      setCurrentModuleIndex(prev => prev + 1);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) return;
    setIsUploading(true);
    setUploadError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', user.uid);
      formData.append('dayId', dayId);

      const res = await fetch('/api/upload-submission', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload file");
      }

      setUploadSuccess(true);
      setSelectedFile(null);
      // Auto advance after upload
      setTimeout(() => advanceModule(dayConfig.modules.length), 1500);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };


  if (loading || !user || isInitializing) return (
    <div className="wk-container wk-center-layout"><Loader2 size={32} className="animate-spin text-blue-600"/></div>
  );

  // Use the new dynamic format or fallback to empty
  const dayConfig = batchData?.curriculum?.[dayId] || { dayTitle: `Day ${dayId}`, modules: [] };
  const hasModules = dayConfig.modules && dayConfig.modules.length > 0;
  
  return (
    <div className="wk-container">
      <header className="wk-dashboard-header">
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--wk-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Day {params.dayId as string}</p>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{dayConfig.dayTitle}</h1>
        </div>
        <button onClick={() => router.push('/workshops/student')} className="wk-link-btn">
          Back to Dashboard
        </button>
      </header>

      <main className="wk-dashboard-main">
        
        <style>{`
          .markdown-prose h3 { font-size: 1.125rem; font-weight: 600; color: #1e293b; margin-top: 1.5rem; margin-bottom: 0.5rem; }
          .markdown-prose p { margin-bottom: 1rem; }
          .markdown-prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
          .markdown-prose li { margin-bottom: 0.25rem; }
          .markdown-prose strong { color: #0f172a; font-weight: 600; }
        `}</style>
        {/* Timeline Tracker */}
        {hasModules && currentModuleIndex !== -1 && (
          <div className="wk-timeline-container">
            <div className="wk-timeline">
              {dayConfig.modules.map((mod: any, idx: number) => {
                const isCompleted = idx < currentModuleIndex;
                const isActive = idx === currentModuleIndex;
                return (
                  <div key={mod.id} className={`wk-timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="wk-timeline-dot">
                      {isCompleted ? <CheckCircle2 size={12} style={{ color: 'white' }}/> : (idx + 1)}
                    </div>
                    <span className="wk-timeline-label">{mod.title}</span>
                    {idx < dayConfig.modules.length - 1 && <div className="wk-timeline-connector" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!hasModules && currentModuleIndex !== -1 && (
           <div className="wk-block-card wk-center-layout">
             <h2>No curriculum configured for this day yet.</h2>
           </div>
        )}

        {/* Dynamic Module Renderer */}
        {hasModules && currentModuleIndex !== -1 && dayConfig.modules[currentModuleIndex] && (
          (() => {
            const mod = dayConfig.modules[currentModuleIndex];
            
            if (mod.type === 'AUDIO_BRIEFING') {
              // Calculate character-based animation threshold for Web Speech API boundary events
              // Clean markdown symbols for character count approximation
              const cleanText = (mod.description || '').replace(/#|-|\*|`/g, '').trim();
              const totalChars = cleanText.length || 1;
              let charCount = 0;

              const handlePlayPause = () => {
                if (!window.speechSynthesis) {
                  alert("Your browser does not support AI Voice. Please use Chrome, Edge, or Safari.");
                  return;
                }

                if (isSpeaking) {
                  window.speechSynthesis.pause();
                  setIsSpeaking(false);
                } else {
                  if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                    setIsSpeaking(true);
                  } else {
                    // Start fresh
                    window.speechSynthesis.cancel();
                    const textToRead = cleanText;
                    const utterance = new SpeechSynthesisUtterance(textToRead);
                    
                    // Try to use a natural English voice if available (Edge/Google)
                    const voices = window.speechSynthesis.getVoices();
                    const preferredVoice = voices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) || 
                                           voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
                                           voices.find(v => v.lang.startsWith('en'));
                    if (preferredVoice) utterance.voice = preferredVoice;
                    
                    utterance.rate = 0.95; // Slightly slower for presentation
                    
                    utterance.onstart = () => { setIsSpeaking(true); setAudioProgress(0); };
                    utterance.onend = () => { setIsSpeaking(false); setAudioProgress(1); };
                    utterance.onpause = () => setIsSpeaking(false);
                    utterance.onresume = () => setIsSpeaking(true);
                    
                    // The magic sync: boundary event fires for every word spoken!
                    utterance.onboundary = (event) => {
                      if (event.name === 'word') {
                        setAudioProgress(event.charIndex / totalChars);
                      }
                    };

                    setSpeechUtterance(utterance);
                    window.speechSynthesis.speak(utterance);
                  }
                }
              };

              const handleStop = () => {
                if (window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setAudioProgress(1);
                }
              };

              return (
                <div className="wk-block-card" style={{ position: 'relative', overflow: 'hidden' }}>
                  
                  {/* Watermark Logo */}
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '300px', height: '300px',
                    backgroundImage: 'url(/tcb-logo.png)',
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                    opacity: 0.05, pointerEvents: 'none', zIndex: 0
                  }} />

                  {/* Custom Web Speech Player pinned to the top of the card */}
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '0.75rem 0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 10 }}>
                    <p style={{ fontWeight: 600, color: '#0369a1', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       AI Interactive Briefing
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <button 
                        onClick={handlePlayPause}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {isSpeaking ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
                      </button>
                      <button 
                        onClick={handleStop}
                        disabled={!isSpeaking && audioProgress === 1}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: (!isSpeaking && audioProgress === 1) ? '#cbd5e1' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Square size={24} />
                      </button>
                      <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                         <div style={{ height: '100%', backgroundColor: '#0ea5e9', width: `${audioProgress * 100}%`, transition: 'width 0.2s linear' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, minWidth: '40px' }}>
                        {Math.round(audioProgress * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="wk-block-content" style={{ position: 'relative', zIndex: 10 }}>
                    <h2 className="wk-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>{mod.title}</h2>
                    
                    {/* Render Gemini's markdown instructions beautifully with Sync Animation */}
                    <div className="markdown-prose" style={{ textAlign: 'left', color: '#475569', lineHeight: '1.7', marginBottom: '2rem' }}>
                      <ReactMarkdown
                        components={{
                          p: ({node, children}) => {
                            const nodeTextLength = (node as any)?.position?.end?.offset - (node as any)?.position?.start?.offset || 50;
                            charCount += nodeTextLength;
                            // Add a small buffer so text highlights slightly before the voice reads it
                            const threshold = Math.max(0, (charCount - (nodeTextLength * 0.9))) / totalChars;
                            const isVisible = audioProgress >= threshold;
                            
                            return (
                              <p style={{ 
                                transition: 'all 0.4s ease-out', 
                                opacity: isVisible ? 1 : 0.1,
                                transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                              }}>
                                {children}
                              </p>
                            );
                          },
                          li: ({node, children}) => {
                            const nodeTextLength = (node as any)?.position?.end?.offset - (node as any)?.position?.start?.offset || 30;
                            charCount += nodeTextLength;
                            const threshold = Math.max(0, (charCount - (nodeTextLength * 0.9))) / totalChars;
                            const isVisible = audioProgress >= threshold;
                            
                            return (
                              <li style={{ 
                                transition: 'all 0.4s ease-out', 
                                opacity: isVisible ? 1 : 0.1,
                                transform: isVisible ? 'translateX(0)' : 'translateX(-10px)'
                              }}>
                                {children}
                              </li>
                            );
                          },
                          h3: ({node, children}) => {
                            const nodeTextLength = (node as any)?.position?.end?.offset - (node as any)?.position?.start?.offset || 20;
                            charCount += nodeTextLength;
                            const threshold = Math.max(0, (charCount - (nodeTextLength * 0.9))) / totalChars;
                            const isVisible = audioProgress >= threshold;
                            
                            return (
                              <h3 style={{ 
                                transition: 'all 0.4s ease-out', 
                                opacity: isVisible ? 1 : 0.1,
                              }}>
                                {children}
                              </h3>
                            );
                          }
                        }}
                      >
                        {mod.description}
                      </ReactMarkdown>
                    </div>

                    <button 
                      onClick={() => {
                        handleStop(); // Stop audio if they proceed
                        advanceModule(dayConfig.modules.length);
                      }}
                      className="wk-btn-primary"
                    >
                      Complete Briefing & Continue
                    </button>
                  </div>
                </div>
              );
            }
            if (mod.type === 'ACTIVITY') {
              return (
                <div className="wk-block-card">
                  <div style={{ padding: '1.5rem 2rem', backgroundColor: '#faf5ff', borderBottom: '1px solid #e9d5ff', borderRadius: '0.75rem 0.75rem 0 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Settings2 size={24} style={{ color: '#8b5cf6' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#5b21b6', margin: 0 }}>{mod.title}</h2>
                  </div>
                  <div className="wk-block-content" style={{ textAlign: 'left' }}>
                    <div className="markdown-prose" style={{ color: '#475569', lineHeight: '1.7', marginBottom: '2rem' }}>
                      <ReactMarkdown>{mod.description}</ReactMarkdown>
                    </div>
                    <button 
                      onClick={() => advanceModule(dayConfig.modules.length)}
                      className="wk-btn-primary"
                    >
                      Mark Activity Complete
                    </button>
                  </div>
                </div>
              );
            }

            if (mod.type === 'UPLOAD') {
              return (
                <div className="wk-block-card wk-center-layout">
                  <div className="wk-upload-area">
                    <UploadCloud size={48} style={{ color: 'var(--wk-accent)', marginBottom: '1rem' }} />
                    <h2 className="wk-title">{mod.title}</h2>
                    <p className="wk-subtitle">{mod.description}</p>
                    
                    <input 
                      type="file" 
                      id="file-upload" 
                      style={{ display: 'none' }}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx"
                    />
                    
                    {!selectedFile ? (
                      <label htmlFor="file-upload" className="wk-btn-primary" style={{ cursor: 'pointer', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} /> Select File
                      </label>
                    ) : (
                      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ fontWeight: 500, color: 'var(--wk-success)' }}>Selected: {selectedFile.name}</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button onClick={() => setSelectedFile(null)} className="wk-btn-outline">Change</button>
                          <button onClick={handleFileUpload} disabled={isUploading} className="wk-btn-primary">
                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : 'Submit Assignment'}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {uploadError && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.875rem' }}>{uploadError}</p>}
                    {uploadSuccess && <p style={{ color: 'var(--wk-success)', marginTop: '1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={16}/> Upload successful!</p>}
                  </div>
                </div>
              );
            }

            return null;
          })()
        )}

        {/* Day Completed State */}
        {currentModuleIndex === -1 && (
          <div className="wk-block-card wk-center-layout" style={{ border: '2px solid var(--wk-success)', backgroundColor: '#f0fdf4' }}>
            <CheckCircle2 size={64} style={{ color: 'var(--wk-success)', marginBottom: '1rem' }} />
            <h2 className="wk-title" style={{ color: '#166534' }}>Day {dayId} Completed!</h2>
            <p className="wk-subtitle" style={{ color: '#15803d' }}>Amazing work today. You can safely return to your dashboard.</p>
            <button 
              onClick={() => router.push('/workshops/student')}
              className="wk-btn-primary"
              style={{ marginTop: '2rem', backgroundColor: 'var(--wk-success)' }}
            >
              Return to Dashboard
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
