import React, { useState, useEffect } from 'react';
import { WeekData } from '@/data/curriculum';
import { X, ChevronLeft, ChevronRight, Loader2, Printer, ZoomIn, ZoomOut, QrCode, Sparkles, Upload, Image as ImageIcon, Video, FileQuestion, UploadCloud, LayoutDashboard, Play, Pause } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import PrintTemplates from './PrintTemplates';
import RandomTopicGenerator from './RandomTopicGenerator';
import QRCodeForm from './QRCodeForm';
import AbsurdAbstract from './AbsurdAbstract';
import SentenceActivity from './SentenceActivity';
import confetti from 'canvas-confetti';

const Mermaid = ({ chart, theme }: { chart: string, theme: 'light' | 'dark' }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      document.fonts.ready.then(() => {
        mermaid.initialize({ 
          startOnLoad: false,
          securityLevel: 'loose', 
          theme: 'base',
          themeVariables: {
            fontFamily: '"Outfit", sans-serif',
            primaryColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.7)',
            primaryTextColor: theme === 'dark' ? '#ffffff' : '#0f172a',
            primaryBorderColor: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
            lineColor: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
            secondaryColor: theme === 'dark' ? '#d8b4fe' : '#9333ea',
            tertiaryColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
            fontSize: '26px',
            pieTitleTextColor: theme === 'dark' ? '#ffffff' : '#0f172a',
            pieSectionTextColor: theme === 'dark' ? '#ffffff' : '#0f172a',
            pieLegendTextColor: theme === 'dark' ? '#ffffff' : '#0f172a',
            pie1: theme === 'dark' ? '#818cf8' : '#6366f1',
            pie2: theme === 'dark' ? '#c084fc' : '#a855f7',
            pie3: theme === 'dark' ? '#38bdf8' : '#0ea5e9',
            pie4: theme === 'dark' ? '#34d399' : '#10b981',
            pie5: theme === 'dark' ? '#f472b6' : '#ec4899',
            pie6: theme === 'dark' ? '#fbbf24' : '#f59e0b'
          },
          fontFamily: '"Outfit", sans-serif',
          flowchart: {
            htmlLabels: true
          }
        });
        mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        });
      });
    }
  }, [chart, theme]);

  return <div ref={ref} className="mermaid-diagram" style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', width: '100%' }} />;
};

interface SlideViewerProps {
  weekData: WeekData | null;
  program: string;
  stream: string;
  semester: number;
  theme: 'light' | 'dark';
  course?: string;
  activeSection?: string;
  onClose: () => void;
  isAdmin?: boolean;
}



const AssetUploadModal = ({ isOpen, onClose, currentSlideContent }: { isOpen: boolean, onClose: () => void, currentSlideContent: string }) => {
  const [assetType, setAssetType] = useState<'image' | 'video' | 'gif' | 'other' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setAssetType(null);
    setFile(null);
    setUploadedUrl(null);
  };

  const handleFullClose = () => {
    handleReset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'lywlehez');

    try {
      // For images, gifs, and other docs, use image upload endpoint. For videos use video.
      const resourceType = assetType === 'video' ? 'video' : 'image';
      const response = await fetch(`https://api.cloudinary.com/v1_1/l4eozknq/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>Upload Asset to Slide</h2>
          <button onClick={handleFullClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={24} /></button>
        </div>

        {uploadedUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 0', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Upload Successful!</h3>
            <p style={{ color: '#4b5563', margin: 0 }}>Your file has been safely stored in Cloudinary.</p>
            
            <div style={{ width: '100%', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '8px' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px', textAlign: 'left' }}>Markdown Code for this Slide:</p>
              <code style={{ display: 'block', padding: '12px', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                {assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${uploadedUrl} -->` : assetType === 'image' ? `\`\`\`absurd-abstract\nimage: ${uploadedUrl}\nquestion: Type your question here...\nreveal: Type the reveal truth here!\n\`\`\`` : `![Activity Asset](${uploadedUrl})`}
              </code>
            </div>
            
            <button onClick={handleReset} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}>
              Upload Another Asset
            </button>
          </div>
        ) : !assetType ? (
          <div>
            <p style={{ color: '#4b5563', marginBottom: '16px' }}>What type of asset are you uploading for this activity?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => setAssetType('image')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <ImageIcon size={32} color="#3b82f6" />
                <span style={{ fontWeight: '600', color: '#374151' }}>Image</span>
              </button>
              <button onClick={() => setAssetType('video')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#ef4444'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <Video size={32} color="#ef4444" />
                <span style={{ fontWeight: '600', color: '#374151' }}>Video</span>
              </button>
              <button onClick={() => setAssetType('gif')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#10b981'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <Sparkles size={32} color="#10b981" />
                <span style={{ fontWeight: '600', color: '#374151' }}>GIF</span>
              </button>
              <button onClick={() => setAssetType('other')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#8b5cf6'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <FileQuestion size={32} color="#8b5cf6" />
                <span style={{ fontWeight: '600', color: '#374151' }}>Other Document</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={handleReset} style={{ background: '#f3f4f6', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>← Back</button>
              <span style={{ fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>Uploading {assetType}</span>
            </div>
            
            <label style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', backgroundColor: file ? '#eff6ff' : '#f8fafc', borderColor: file ? '#3b82f6' : '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}>
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept={assetType === 'image' || assetType === 'gif' ? 'image/*' : assetType === 'video' ? 'video/*' : '*/*'} />
              {!file ? (
                <>
                  <UploadCloud size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Click to browse and select a file</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Maximum file size 50MB</p>
                </>
              ) : (
                <>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e40af', margin: '0 0 8px 0' }}>{file.name}</h3>
                  <p style={{ color: '#3b82f6', fontSize: '0.9rem', margin: 0 }}>Ready to upload</p>
                </>
              )}
            </label>

            <button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              style={{ backgroundColor: !file ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: !file || uploading ? 'not-allowed' : 'pointer', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {uploading ? (
                <><Loader2 size={20} className="spinner" /> Uploading...</>
              ) : (
                'Confirm Upload'
              )}
            </button>
          </div>
        )}

        
      </div>

    </div>
  );
};


export default function SlideViewer
({ weekData, program, stream, semester, theme, course = 'soft-skills', activeSection, onClose, isAdmin = false }: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentSlide < slides.length - 1) {
      timer = setInterval(() => {
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
      }, 8000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSlide, slides.length]);

  useEffect(() => {
    if (currentSlide === slides.length - 1) {
      setIsPlaying(false);
    }
  }, [currentSlide, slides.length]);
  const [isLoading, setIsLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [printTemplateId, setPrintTemplateId] = useState<string | null>(null);
  const [isPrintingSlide, setIsPrintingSlide] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [confettiActive, setConfettiActive] = useState(true);
  
  useEffect(() => {
    if (zoomLevel <= 1) setPan({ x: 0, y: 0 });
  }, [zoomLevel]);
  
  const hasMermaid = slides.length > 0 && slides[currentSlide]?.includes('```mermaid');
  const hasPrintSlideMarker = slides.length > 0 && slides[currentSlide]?.includes('<!-- PRINT_SLIDE -->');
  
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Reset scroll on slide change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
      setIsScrolledDown(false);
    }
  }, [currentSlide]);

  // Check for print tag on slide change
  useEffect(() => {
    if (slides.length > 0) {
      const match = slides[currentSlide].match(/<!-- PRINT: (.*?) -->/);
      setPrintTemplateId(match ? match[1].trim() : null);
    }
  }, [currentSlide, slides]);

  // Save progress when slide changes
  useEffect(() => {
    if (weekData && slides.length > 0 && activeSection) {
      try {
        const data = JSON.parse(localStorage.getItem('tcb-progress') || '{}');
        const key = `${program}-${stream}-${semester}-${activeSection}-week${weekData.week}`;
        const existing = data[key] || {};
        
        // Only update if not already marked as completed
        if (!existing.completed) {
          data[key] = {
            ...existing,
            currentSlide,
            totalSlides: slides.length,
            completed: false
          };
          localStorage.setItem('tcb-progress', JSON.stringify(data));
        }
      } catch (e) {
        console.error("Error saving progress", e);
      }
    }
  }, [currentSlide, slides, weekData, program, stream, semester, activeSection]);

  const handleSessionComplete = () => {
    if (weekData && activeSection) {
      try {
        const data = JSON.parse(localStorage.getItem('tcb-progress') || '{}');
        const key = `${program}-${stream}-${semester}-${activeSection}-week${weekData.week}`;
        data[key] = {
          currentSlide,
          totalSlides: slides.length,
          completed: true
        };
        localStorage.setItem('tcb-progress', JSON.stringify(data));
      } catch (e) {
        console.error("Error completing session", e);
      }
      onClose(); // return to dashboard
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide(prev => Math.min(prev + 1, slides.length > 0 ? slides.length - 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        onClose();
      } else if (e.key === 's' || e.key === 'S') {
        setConfettiActive(false);
      } else if (e.key === 'b' || e.key === 'B') {
        setConfettiActive(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, slides.length]);

  // Fetch Markdown content
  useEffect(() => {
    async function fetchLesson() {
      if (!weekData) return;
      
      setIsLoading(true);
      setError(null);
      setCurrentSlide(0);

      try {
        const url = `/api/lesson?program=${program}&stream=${encodeURIComponent(stream)}&semester=${semester}&week=${weekData.week}&course=${course}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch lesson');
        }

        // Split markdown by '---' on its own line
        const contentBlocks = data.content.split(/(?:\r?\n|^)---(?:\r?\n|$)/).map((block: string) => block.trim()).filter(Boolean);
        setSlides(contentBlocks);
      } catch (err: any) {
        // Fallback to basic curriculum metadata if markdown file doesn't exist
        const fallbackSlides = [
          `# Week ${weekData.week}\n## ${weekData.theme}`,
          `# Core Focus\n${weekData.focus}`,
          `# Learning Task\n${weekData.task}`,
          `# Evaluation Rubric\n${weekData.rubric}`
        ];
        setSlides(fallbackSlides);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLesson();
  }, [weekData, program, stream, semester]);

  // Confetti effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (weekData?.label === 'Orientation' && confettiActive && !isLoading) {
      intervalId = setInterval(() => {
        confetti({
          particleCount: 15,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#4f46e5', '#818cf8', '#c7d2fe', '#fbbf24', '#ef4444'],
          zIndex: 9999,
          disableForReducedMotion: true
        });
        confetti({
          particleCount: 15,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#4f46e5', '#818cf8', '#c7d2fe', '#fbbf24', '#ef4444'],
          zIndex: 9999,
          disableForReducedMotion: true
        });
      }, 250); // Fire every 250ms to prevent browser crashing while maintaining a continuous stream
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [weekData, confettiActive, isLoading]);

  if (!weekData) return null;

  return (
    <div className={`slide-modal-overlay ${isPrintingSlide ? 'is-printing-slide' : ''} ${course === 'soft-skills' ? 'video-player-mode' : ''}`}>
      <div className="slide-container">

        {/* Floating Top Right Controls */}
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem', zIndex: 10, alignItems: 'center' }}>
          {(printTemplateId || hasMermaid || hasPrintSlideMarker) && (
            <button 
              onClick={() => {
                if ((hasMermaid || hasPrintSlideMarker) && !printTemplateId) {
                  setIsPrintingSlide(true);
                  setTimeout(() => {
                    window.print();
                    setIsPrintingSlide(false);
                  }, 100);
                } else {
                  window.print();
                }
              }}
              className="nav-btn print-btn-trigger"
              title="Print Slide or Worksheet"
              style={{ background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '50%' }}
            >
              <Printer size={32} />
            </button>
          )}

        
          <button className="nav-btn" onClick={onClose} aria-label="Close Presentation" style={{ background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '50%' }}>
            <X size={32} />
          </button>
        </div>

        

        

        
        {/* Floating Left Arrow */}
        {course !== 'soft-skills' && !isLoading && slides.length > 0 && currentSlide > 0 && (
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            className="nav-btn"
            style={{ position: 'absolute', top: '50%', left: '2rem', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '0.5rem' }}
          >
            <ChevronLeft size={48} />
          </button>
        )}

        {/* Floating Right Arrow */}
        {course !== 'soft-skills' && !isLoading && slides.length > 0 && currentSlide < slides.length - 1 && (
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
            className="nav-btn"
            style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '0.5rem' }}
          >
            <ChevronRight size={48} />
          </button>
        )}

          {/* End of Episode Binge UI */}
        {!isLoading && slides.length > 0 && currentSlide === slides.length - 1 && course === 'soft-skills' && (
          <div style={{
            position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 100,
            background: 'rgba(20,20,20,0.95)', border: '1px solid #333',
            borderRadius: '8px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
            animation: 'fadeInUp 0.5s ease-out forwards'
          }}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Session Complete</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Ready for more?</span>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px',
                padding: '0.8rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'transform 0.2s, background 0.2s', fontSize: '1.1rem'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <LayoutDashboard size={24} /> Back to Studio
            </button>
          </div>
        )}


        {isLoading ? (
          <div className="slide-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Loader2 size={64} className="spinner" color="#818cf8" />
             <p style={{marginTop: '1rem', color: '#94a3b8'}}>Loading lesson content...</p>
          </div>
        ) : (
          <div ref={scrollRef} className="slide-content markdown-slide" onScroll={(e) => setIsScrolledDown(e.currentTarget.scrollTop > 50)}>
             {error && currentSlide === 0 && (
               <div style={{
                 background: 'rgba(239, 68, 68, 0.1)', 
                 border: '1px solid #ef4444', 
                 padding: '1rem', 
                 borderRadius: '8px',
                 marginBottom: '2rem',
                 color: '#fca5a5',
                 fontSize: '1rem'
               }}>
                 ⚠️ {error}. Displaying fallback curriculum data.
               </div>
             )}
             <div className="slide-body">
                {slides.length > 0 && (
                  <div className="markdown-content-container" style={{ position: 'relative', width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '2rem', paddingBottom: '4rem' }}>
                    <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(.+)/.exec(className || '');
                        if (!inline && match && match[1] === 'download') { const filename = String(children).trim(); const downloadUrl = `/downloads/computing/${filename}`; return <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}><a href={downloadUrl} download={filename} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--accent-primary)', color: 'white', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='7 10 12 15 17 10'/><line x1='12' x2='12' y1='15' y2='3'/></svg>Download Lab File: {filename}</a></div>; } if (!inline && match && match[1] === 'absurd-abstract') {
                            const lines = String(children).trim().split('\n');
                            const image = lines.find((l: string) => l.startsWith('image:'))?.replace('image:', '').trim() || '';
                            const question = lines.find((l: string) => l.startsWith('question:'))?.replace('question:', '').trim() || '';
                            const revealText = lines.find((l: string) => l.startsWith('reveal:'))?.replace('reveal:', '').trim() || '';
                            return <AbsurdAbstract image={image} question={question} revealText={revealText} />;
                        }
                          if (!inline && match && match[1] === 'qrcode') {
                          return <QRCodeForm />;
                        }
                        if (!inline && match && match[1] === 'topic-generator') {
                          const customTopics = String(children).trim().split('\n').map(t => t.trim()).filter(t => t.length > 0);
                          return <RandomTopicGenerator customTopics={customTopics} />;
                        }
                        if (!inline && match && match[1] === 'sentence-activity') {
                          return <SentenceActivity data={String(children)} />;
                        }
                        if (!inline && match && match[1] === 'mermaid') {
                          return (
                            <>
                              <div className="mermaid-screen">
                                <Mermaid chart={String(children).replace(/\n$/, '')} theme={theme} />
                              </div>
                              <div className="mermaid-print">
                                <Mermaid chart={String(children).replace(/\n$/, '')} theme="light" />
                              </div>
                            </>
                          );
                        }
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                      a({ node, children, href, ...props }: any) {
                        return (
                          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                            {children}
                          </a>
                        );
                      },
                      p({ node, children, ...props }: any) {
                        // If paragraph contains multiple images, display them as flex
                        const hasMultipleImages = node?.children?.filter((c: any) => c.tagName === 'img').length > 1;
                        if (hasMultipleImages) {
                          return <p style={{ display: 'flex', gap: '2%', justifyContent: 'center', alignItems: 'flex-start' }} {...props}>{children}</p>;
                        }
                        return <p {...props}>{children}</p>;
                      },
                      img({ node, alt, src, ...props }: any) {
                        if (src?.includes('notoemoji')) {
                          return <img src={src} alt={alt} style={{ width: '1.2em', height: '1.2em', verticalAlign: 'middle', display: 'inline-block', margin: '0 0.1em', mixBlendMode: 'multiply' }} {...props} />;
                        }
                        return (
                          <img 
                            src={src} 
                            alt={alt} 
                            onClick={() => {
                              setZoomedImage(src);
                              setZoomLevel(1);
                            }}
                            style={{ cursor: 'zoom-in' }}
                            {...props} 
                          />
                        );
                      }
                    }}
                  >
                    {slides[currentSlide]
                      .replace(/<!-- PRINT: (.*?) -->/g, '')
                      .replace(/<!-- PRINT_SLIDE -->/g, '')
                      .replace(/<!-- TOPIC_GENERATOR -->/g, '')
                      .replace(/<!-- WELCOME_ANIMATIONS -->/g, '')}
                    </ReactMarkdown>
                  </div>
                )}
                
                {/* Render Custom Components Based on Markdown Markers */}
                
                {slides.length > 0 && slides[currentSlide].includes('<!-- TOPIC_GENERATOR -->') && (
                  <RandomTopicGenerator />
                )}
                
                
                {isAdmin && (
                  <button onClick={() => setIsUploadModalOpen(true)} style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50 }}>
                    <Upload size={20} />
                    Upload Asset to Slide
                  </button>
                )}
             </div>
          </div>
        )}
        
        {/* Hidden print templates container */}
        <div className="print-only">
          <PrintTemplates templateId={printTemplateId || ''} />
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '1rem', zIndex: 100000 }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.max(1, prev - 0.5)); }}
              style={{ background: '#333', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ZoomOut size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.min(4, prev + 0.5)); }}
              style={{ background: '#333', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ZoomIn size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setZoomedImage(null); setZoomLevel(1); setPan({x:0, y:0}); }}
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={24} />
            </button>
          </div>
          
          <div 
            style={{ 
              width: '100%', height: '100%', overflow: 'hidden', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'zoom-in')
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              setHasDragged(false);
              if (zoomLevel > 1) {
                setIsDragging(true);
                setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
              }
            }}
            onMouseMove={(e) => {
              if (isDragging && zoomLevel > 1) {
                setHasDragged(true);
                setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
              }
            }}
            onMouseUp={() => {
              setIsDragging(false);
              if (!hasDragged) {
                 if (zoomLevel < 3) setZoomLevel(prev => prev + 1);
                 else setZoomLevel(1);
              }
            }}
            onMouseLeave={() => setIsDragging(false)}
          >
            <img 
              src={zoomedImage} 
              alt="Zoomed" 
              style={{ 
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`, 
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                maxWidth: '90%', maxHeight: '90%',
                objectFit: 'contain',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>
      )}
    
      
        

      
        {/* Video Scrubber Playbar */}
        {course === 'soft-skills' && !isLoading && slides.length > 0 && (
          <div style={{
            position: 'absolute', bottom: '0', left: '0', right: '0', zIndex: 100,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
            padding: '2rem 2rem 1.5rem 2rem',
            display: 'flex', flexDirection: 'column', gap: '0.8rem',
            pointerEvents: 'none',
            opacity: isScrolledDown ? 0 : 1,
            transform: isScrolledDown ? 'translateY(100%)' : 'translateY(0)',
            transition: 'opacity 0.4s ease, transform 0.4s ease'
            /* Let clicks pass through background */
          }}>
            {/* Scrubber Track Wrapper */}
            <div 
              style={{
                width: '100%', height: '16px', display: 'flex', alignItems: 'center', cursor: 'pointer', pointerEvents: 'auto'
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const newSlide = Math.round(percentage * (slides.length - 1));
                setCurrentSlide(Math.max(0, Math.min(newSlide, slides.length - 1)));
              }}
            >
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.3)', position: 'relative', borderRadius: '2px' }}>
                {/* Progress Fill */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%',
                  width: `${(currentSlide / Math.max(1, slides.length - 1)) * 100}%`,
                  background: '#E50914',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }} />
                {/* Thumb */}
                <div style={{
                  position: 'absolute', top: '50%', left: `${(currentSlide / Math.max(1, slides.length - 1)) * 100}%`,
                  width: '14px', height: '14px', background: '#E50914', borderRadius: '50%',
                  transform: 'translate(-50%, -50%)', boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  transition: 'left 0.3s ease'
                }} />
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#E50914'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
                <div style={{ color: 'white', fontSize: '1rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace' }}>
                  <span>{currentSlide === 0 ? '0' : currentSlide}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{slides.length - 1}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Admin Asset Upload Modal */}
      {isAdmin && (
        <AssetUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          currentSlideContent={slides[currentSlide] || ''}
        />
      )}
    </div>
  );
}


