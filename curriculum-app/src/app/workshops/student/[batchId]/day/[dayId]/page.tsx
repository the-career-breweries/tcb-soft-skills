"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, PlayCircle, Clock, UploadCloud, CheckCircle2, FileText, X } from 'lucide-react';
import { getStudentProgress, updateStudentProgress, WorkState } from '@/lib/firebase/studentOps';
import { storage, db } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import '../../../../workshops.css';

export default function WorkshopDayView() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const dayId = params.dayId as string;
  
  const [currentState, setCurrentState] = useState<WorkState | 'COMPLETED'>('MORNING_VIDEO');
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(1800); 
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
        const batchDoc = await import('firebase/firestore').then(m => m.getDoc(doc(db, 'batches', params.batchId as string)));
        if (batchDoc.exists()) setBatchData(batchDoc.data());
        if (progress) {
          setCurrentState(progress.state);
          if (progress.state === 'BREAK' && progress.breakStartTime) {
            const elapsed = Math.floor((Date.now() - new Date(progress.breakStartTime).getTime()) / 1000);
            const remaining = Math.max(1800 - elapsed, 0);
            setBreakTimeRemaining(remaining);
            if (remaining === 0) {
              handleStateChange('DEEP_WORK_2');
            }
          }
        }
        setIsInitializing(false);
      }
    };
    if (user && !loading) fetchProgress();
  }, [user, loading]);

  const handleStateChange = async (newState: WorkState) => {
    setCurrentState(newState);
    if (!user) return;
    
    const updates: any = { state: newState };
    if (newState === 'BREAK') {
      updates.breakStartTime = new Date().toISOString();
      setBreakTimeRemaining(1800);
    }
    
    await updateStudentProgress(user.uid, updates);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentState === 'BREAK' && breakTimeRemaining > 0) {
      interval = setInterval(() => {
        setBreakTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (currentState === 'BREAK' && breakTimeRemaining === 0) {
      handleStateChange('DEEP_WORK_2');
    }
    return () => clearInterval(interval);
  }, [currentState, breakTimeRemaining]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    setUploadSuccess(false);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File exceeds 5MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const submitWork = async () => {
    if (!selectedFile || !user) {
      setUploadError("Please select a file to upload.");
      return;
    }
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
        throw new Error(data.error || "Failed to upload file to Google Drive");
      }

      // Update local state to COMPLETED
      await handleStateChange('COMPLETED');
      setUploadSuccess(true);
      setSelectedFile(null);
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const dayConfig = batchData?.curriculum?.[dayId] || {
    videoUrl: '',
    videoTitle: `Morning Kickoff Video (Placeholder)`,
    videoDescription: `Watch this 15-minute briefing to understand today's objectives before unlocking your deep work materials.`,
    blockATitle: `Block A: Master Resume Drafting`,
    blockADescription: `Spend the next 2 hours drafting your master resume using the STAR method.`,
    blockBTitle: `Block B: LinkedIn Optimization`,
    blockBDescription: `Update your LinkedIn based on your new master resume.`,
  };

  return (
    <div className="wk-container">
      <header className="wk-dashboard-header">
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--wk-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Day {params.dayId as string}</p>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Resume & Profile Building</h1>
        </div>
        <button onClick={() => router.push('/workshops/student')} className="wk-link-btn">
          Back to Dashboard
        </button>
      </header>

      <main className="wk-dashboard-main">
        
        {/* Timeline Tracker */}
        <div className="wk-timeline-container">
          <div className="wk-timeline">
            <div className={`wk-timeline-pill ${currentState === 'MORNING_VIDEO' ? 'active' : ''}`}>1. Briefing</div>
            <div className="wk-timeline-line"></div>
            <div className={`wk-timeline-pill ${currentState === 'DEEP_WORK_1' ? 'active' : ''}`}>2. Block A</div>
            <div className="wk-timeline-line"></div>
            <div className={`wk-timeline-pill ${currentState === 'BREAK' ? 'active' : ''}`}>3. Break</div>
            <div className="wk-timeline-line"></div>
            <div className={`wk-timeline-pill ${currentState === 'DEEP_WORK_2' ? 'active' : ''}`}>4. Block B</div>
            <div className="wk-timeline-line"></div>
            <div className={`wk-timeline-pill ${currentState === 'SUBMISSION' ? 'active' : ''}`}>5. Submit</div>
          </div>
        </div>

        {/* Dynamic State Rendering */}
        
        {/* State 1: Morning Video */}
        {currentState === 'MORNING_VIDEO' && (
          <div className="wk-block-card">
            <div className="wk-video-placeholder">
              {dayConfig.videoUrl ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={dayConfig.videoUrl} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '0.75rem 0.75rem 0 0' }}
                ></iframe>
              ) : (
                <>
                  <PlayCircle size={64} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <p style={{ fontWeight: 500, zIndex: 10 }}>{dayConfig.videoTitle}</p>
                </>
              )}
            </div>
            <div className="wk-block-content">
              <h2 className="wk-title" style={{ textAlign: 'left' }}>Welcome to Day {dayId}</h2>
              <p className="wk-subtitle" style={{ textAlign: 'left' }}>{dayConfig.videoDescription}</p>
              <button 
                onClick={() => handleStateChange('DEEP_WORK_1')}
                className="wk-btn-primary"
              >
                I have finished the video. Start Block A
              </button>
            </div>
          </div>
        )}

        {/* State 2: Deep Work 1 */}
        {currentState === 'DEEP_WORK_1' && (
          <div className="wk-block-card">
            <div className="wk-block-content">
              <h2 className="wk-title" style={{ textAlign: 'left' }}>{dayConfig.blockATitle}</h2>
              <p className="wk-subtitle" style={{ textAlign: 'left' }}>{dayConfig.blockADescription}</p>
              
              <div className="wk-promo-box">
                <div>
                  <h3 style={{ fontWeight: 700, color: 'var(--wk-accent-hover)', margin: '0 0 0.25rem 0' }}>Premium Tool Access</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--wk-accent)', margin: 0 }}>Use your 1-time token to generate your resume.</p>
                </div>
                <button className="wk-btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  Launch AI Builder
                </button>
              </div>

              <button 
                onClick={() => handleStateChange('BREAK')}
                className="wk-btn-primary"
                style={{ backgroundColor: '#0f172a' }}
              >
                Complete Block A & Take Break
              </button>
            </div>
          </div>
        )}

        {/* State 3: Mandatory Break */}
        {currentState === 'BREAK' && (
          <div className="wk-break-screen">
            <Clock size={64} style={{ color: 'var(--wk-accent)', margin: '0 auto 1rem auto' }} />
            <h2 className="wk-title">Mandatory Screen Break</h2>
            <p className="wk-subtitle">Step away from your laptop. Your next block unlocks in:</p>
            <div className="wk-timer">
              {formatTime(breakTimeRemaining)}
            </div>
            <button 
              onClick={() => setBreakTimeRemaining(0)}
              className="wk-link-btn"
              style={{ fontSize: '0.75rem', textDecoration: 'underline' }}
            >
              [Dev Override: Skip Break]
            </button>
          </div>
        )}

        {/* State 4: Deep Work 2 */}
        {currentState === 'DEEP_WORK_2' && (
          <div className="wk-block-card">
            <div className="wk-block-content">
             <h2 className="wk-title" style={{ textAlign: 'left' }}>{dayConfig.blockBTitle}</h2>
             <p className="wk-subtitle" style={{ textAlign: 'left' }}>{dayConfig.blockBDescription}</p>
             <button 
                onClick={() => handleStateChange('SUBMISSION')}
                className="wk-btn-primary"
              >
                Proceed to Daily Submission
              </button>
            </div>
          </div>
        )}

        {/* State 5: Submission Gateway */}
        {currentState === 'SUBMISSION' && (
          <div className="wk-block-card">
            <div className="wk-block-content">
             <div className="wk-header-icon" style={{ marginLeft: 0 }}>
               <UploadCloud size={24} />
             </div>
             <h2 className="wk-title" style={{ textAlign: 'left' }}>Submit Your Work</h2>
             <p className="wk-subtitle" style={{ textAlign: 'left' }}>Upload your finalized Master Resume (PDF) to complete Day 1.</p>
             
             <div className="wk-upload-box" style={{ 
                border: '2px dashed var(--wk-border)', 
                borderRadius: '0.75rem', 
                padding: '2rem', 
                textAlign: 'center',
                backgroundColor: 'var(--wk-bg-secondary)',
                marginBottom: '1rem'
             }}>
                <input type="file" style={{ display: 'none' }} id="file-upload" accept=".pdf" onChange={handleFileSelect} />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  <span style={{ padding: '0.5rem 1rem', border: '1px solid var(--wk-border)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'white' }}>
                    Choose File
                  </span>
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--wk-text-secondary)', marginTop: '1rem' }}>PDF files only (Max 5MB)</p>
                
                {selectedFile && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#166534', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} />
                      <span style={{ fontWeight: 500 }}>{selectedFile.name}</span>
                    </div>
                    <button onClick={() => setSelectedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}>
                      <X size={16} />
                    </button>
                  </div>
                )}
             </div>

             {uploadError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{uploadError}</p>}

             <button 
                onClick={submitWork}
                disabled={isUploading || !selectedFile}
                className="wk-btn-primary"
                style={{ backgroundColor: (isUploading || !selectedFile) ? '#94a3b8' : '#16a34a' }}
              >
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                {isUploading ? 'Uploading & Submitting...' : 'Submit & Complete Day'}
              </button>
            </div>
          </div>
        )}

        {/* State 6: Completed */}
        {currentState === 'COMPLETED' && (
          <div className="wk-block-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div className="wk-header-icon" style={{ margin: '0 auto 1.5rem auto', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 className="wk-title" style={{ fontSize: '1.5rem' }}>Day Completed!</h2>
            <p className="wk-subtitle" style={{ maxWidth: '400px', margin: '0 auto' }}>
              You have successfully submitted your work and finished today's workshop module. Great job!
            </p>
            <button onClick={() => router.push('/workshops/student')} className="wk-btn-primary" style={{ marginTop: '2rem' }}>
              Return to Dashboard
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
