import React, { useState, useEffect } from 'react';
import { WeekData } from '@/data/curriculum';
import { Loader2, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import PrintTemplates from './PrintTemplates';

const Mermaid = ({ chart, theme }: { chart: string, theme: 'light' | 'dark' }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      document.fonts.ready.then(() => {
        mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'base',
          themeVariables: {
            fontFamily: '"Outfit", sans-serif',
            primaryColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.05)',
            primaryTextColor: theme === 'dark' ? '#ffffff' : '#0f172a',
            primaryBorderColor: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
            lineColor: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
            secondaryColor: theme === 'dark' ? '#d8b4fe' : '#9333ea',
            tertiaryColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
            fontSize: '16px',
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

interface LessonViewerProps {
  weekData: WeekData | null;
  program: string;
  stream: string;
  semester: number;
  theme: 'light' | 'dark';
}

export default function LessonViewer({ weekData, program, stream, semester, theme }: LessonViewerProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printTemplateId, setPrintTemplateId] = useState<string | null>(null);
  const [isPrintingWorksheet, setIsPrintingWorksheet] = useState(false);

  // Check for print tag on content load
  useEffect(() => {
    if (content) {
      const match = content.match(/<!-- PRINT: (.*?) -->/);
      setPrintTemplateId(match ? match[1].trim() : null);
    }
  }, [content]);

  // Fetch Markdown content
  useEffect(() => {
    async function fetchLesson() {
      if (!weekData) return;
      
      setIsLoading(true);
      setError(null);
      setContent('');

      try {
        const url = `/api/lesson?program=${program}&stream=${encodeURIComponent(stream)}&semester=${semester}&week=${weekData.week}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch lesson');
        }

        setContent(data.content);
      } catch (err: any) {
        // Fallback to basic curriculum metadata if markdown file doesn't exist
        const fallbackContent = `
# Week ${weekData.week}
## ${weekData.theme}

### Core Focus
${weekData.focus}

### Learning Task
${weekData.task}

### Evaluation Rubric
${weekData.rubric}
        `;
        setContent(fallbackContent);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLesson();
  }, [weekData, program, stream, semester]);

  if (!weekData) return null;

  return (
    <div className={`lesson-container ${isPrintingWorksheet ? 'is-printing-worksheet' : ''}`}>
      {isLoading ? (
        <div className="lesson-loading">
            <Loader2 size={48} className="spinner" color="#4f46e5" />
            <p>Loading module content...</p>
        </div>
      ) : (
        <div className="lesson-content markdown-article">
            {error && (
              <div className="error-banner">
                ⚠️ {error}. Displaying fallback curriculum data.
              </div>
            )}
            
            <div className="lesson-header-actions">
              {(printTemplateId || content.includes('```mermaid')) && (
                <button 
                  onClick={() => {
                    setIsPrintingWorksheet(true);
                    setTimeout(() => {
                      window.print();
                      setIsPrintingWorksheet(false);
                    }, 100);
                  }}
                  className="print-btn-action"
                  title="Print Worksheet or Document"
                >
                  <Printer size={20} />
                  <span>Print Document</span>
                </button>
              )}
            </div>

            <div className="lesson-body">
                {content && (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
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
                      }
                    }}
                  >
                    {content.replace(/<!-- PRINT: (.*?) -->/g, '').replace(/<!-- PRINT_SLIDE -->/g, '')}
                  </ReactMarkdown>
                )}
            </div>
        </div>
      )}

      {/* Hidden print templates container */}
      <div className="print-only">
        <PrintTemplates templateId={printTemplateId || ''} />
      </div>
    </div>
  );
}
