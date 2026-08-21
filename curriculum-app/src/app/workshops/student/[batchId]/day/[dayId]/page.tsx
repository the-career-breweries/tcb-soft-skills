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
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);


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
            
            if (mod.type === 'AUDIO_BRIEFING' || mod.type === 'ACTIVITY') {
              // Parse description into slides by paragraphs/headers
              const rawBlocks = (mod.description || '').split('\n\n').filter(b => b.trim().length > 0);
              
              // If the AI generated bullet points clumped together, they might not split by \n\n.
              // Let's ensure it's at least one block.
              const blocks = rawBlocks.length > 0 ? rawBlocks : [mod.description || ''];
              
              const isLastSlide = currentSlideIndex >= blocks.length - 1;
              const currentBlockText = blocks[currentSlideIndex] || '';

              const handleNextSlide = () => {
                if (isLastSlide) {
                  setCurrentSlideIndex(0);
                  advanceModule(dayConfig.modules.length);
                } else {
                  setCurrentSlideIndex(prev => prev + 1);
                }
              };

              const handlePrevSlide = () => {
                if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1);
              };

              const isBriefing = mod.type === 'AUDIO_BRIEFING';

              return (
                <div className="wk-block-card" style={{ 
                  position: 'relative', overflow: 'hidden', minHeight: '400px', display: 'flex', flexDirection: 'column'
                }}>
                  
                  {/* Watermark Logo */}
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '350px', height: '350px',
                    backgroundImage: 'url(/tcb-logo.png)',
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                    opacity: 0.04, pointerEvents: 'none', zIndex: 0
                  }} />

                  {/* Header */}
                  <div style={{ 
                    padding: '1.5rem 2rem', 
                    backgroundColor: isBriefing ? '#f0f9ff' : '#faf5ff', 
                    borderBottom: `1px solid ${isBriefing ? '#bae6fd' : '#e9d5ff'}`, 
                    display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 10 
                  }}>
                    {isBriefing ? <PlayCircle size={24} style={{ color: '#0284c7' }} /> : <Settings2 size={24} style={{ color: '#8b5cf6' }} />}
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: isBriefing ? '#0369a1' : '#5b21b6', margin: 0 }}>
                      {mod.title}
                    </h2>
                  </div>
                  
                  {/* Presentation Content Area */}
                  <div className="wk-block-content" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2rem' }}>
                    
                    <div className="markdown-prose" style={{ 
                      textAlign: 'center', 
                      color: '#334155', 
                      fontSize: '1.25rem', 
                      lineHeight: '1.8', 
                      maxWidth: '800px',
                      margin: '0 auto',
                      animation: 'fadeInUp 0.4s ease-out forwards'
                    }}>
                      <ReactMarkdown>{currentBlockText}</ReactMarkdown>
                    </div>

                  </div>

                  {/* Presentation Controls Footer */}
                  <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', position: 'relative', zIndex: 10 }}>
                    
                    {/* Progress Indicator */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {blocks.map((_, idx) => (
                        <div key={idx} style={{ 
                          width: '12px', height: '12px', borderRadius: '50%', 
                          backgroundColor: idx === currentSlideIndex ? (isBriefing ? '#0ea5e9' : '#a855f7') : '#e2e8f0',
                          transition: 'background-color 0.3s ease'
                        }} />
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {currentSlideIndex > 0 && (
                        <button onClick={handlePrevSlide} className="wk-btn-outline">
                          Previous
                        </button>
                      )}
                      
                      <button onClick={handleNextSlide} className="wk-btn-primary" style={{ backgroundColor: isBriefing ? '#0284c7' : '#7c3aed' }}>
                        {isLastSlide ? (isBriefing ? 'Complete Briefing' : 'Mark Activity Complete') : 'Next'}
                      </button>
                    </div>
                  </div>

                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes fadeInUp {
                      from { opacity: 0; transform: translateY(15px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    /* Override markdown styles for presentation mode */
                    .markdown-prose h1, .markdown-prose h2, .markdown-prose h3 {
                      text-align: center;
                      margin-bottom: 1.5rem;
                      color: #0f172a;
                    }
                    .markdown-prose p {
                      margin-bottom: 1rem;
                    }
                    .markdown-prose ul, .markdown-prose ol {
                      text-align: left;
                      display: inline-block;
                    }
                    .markdown-prose li {
                      margin-bottom: 0.75rem;
                    }
                  `}} />
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
