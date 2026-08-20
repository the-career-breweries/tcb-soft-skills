"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Save, PlayCircle, Settings2, Mic, Plus, Trash2, UploadCloud, Sparkles } from 'lucide-react';
import { updateMasterCurriculumAction, getMasterCurriculumAction } from '@/app/actions/adminOps';
import { storage } from '@/lib/firebase/config';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export type ModuleType = 'AUDIO_BRIEFING' | 'ACTIVITY' | 'UPLOAD';

export interface CurriculumModule {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  audioUrl?: string;
  videoUrl?: string;
}

export default function MasterCurriculumBuilder({ workshopType }: { workshopType: string }) {
  const [day, setDay] = useState(1);
  const totalDays = parseInt(workshopType.split('-')[0]) || 3;

  const [modules, setModules] = useState<CurriculumModule[]>([]);
  const [dayTitle, setDayTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<string | null>(null);

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingCurriculum, setIsGeneratingCurriculum] = useState(false);


  useEffect(() => {
    const fetchMaster = async () => {
      setIsLoading(true);
      const res = await getMasterCurriculumAction(workshopType);
      if (res.success && res.curriculum && res.curriculum[day.toString()]?.modules) {
        setModules(res.curriculum[day.toString()].modules);
        setDayTitle(res.curriculum[day.toString()].dayTitle || `Day ${day} Overview`);
      } else {
        setDayTitle(`Day ${day} Overview`);
        setModules([
          { id: `mod_${Date.now()}_1`, type: 'AUDIO_BRIEFING', title: 'Morning Briefing', description: 'Welcome to Day ' + day, audioUrl: '', videoUrl: '' },
          { id: `mod_${Date.now()}_2`, type: 'ACTIVITY', title: 'Deep Work A', description: 'Task description...' },
          { id: `mod_${Date.now()}_3`, type: 'UPLOAD', title: 'Submit Your Work', description: 'Upload your assignment here.' }
        ]);
      }
      setIsLoading(false);
    };
    fetchMaster();
  }, [workshopType, day]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateMasterCurriculumAction(workshopType, day, {
      dayTitle,
      modules
    });
    alert('Master Curriculum saved successfully!');
    setIsSaving(false);
  };

  const addModule = (type: ModuleType) => {
    let newMod: CurriculumModule = { id: `mod_${Date.now()}`, type, title: 'New Module', description: '' };
    if (type === 'AUDIO_BRIEFING') {
      newMod.title = 'AI Audio Briefing';
      newMod.videoUrl = '';
      newMod.audioUrl = '';
    } else if (type === 'ACTIVITY') {
      newMod.title = 'New Activity';
    } else if (type === 'UPLOAD') {
      newMod.title = 'Assignment Submission';
    }
    setModules([...modules, newMod]);
  };

  const updateModule = (id: string, updates: Partial<CurriculumModule>) => {
    setModules(modules.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const moveModule = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;
    
    const newModules = [...modules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    setModules(newModules);
  };

  
  const handleAIGenerate = async () => {
    if (!aiPrompt) return alert('Enter a prompt for the AI first!');
    if (!confirm('This will replace the current day config. Continue?')) return;
    
    setIsGeneratingCurriculum(true);
    try {
      const res = await fetch('/api/generate-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, day, workshopType })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      const newModules = data.curriculum.modules.map((m: any, i: number) => ({
        ...m,
        id: `mod_${Date.now()}_${i}`
      }));
      
      setDayTitle(data.curriculum.dayTitle || '');
      setModules(newModules);
      setAiPrompt('');
      alert('Day generated successfully! Review the modules and click Save Master Curriculum.');
    } catch (e: any) {
      alert('Error generating curriculum: ' + e.message);
    } finally {
      setIsGeneratingCurriculum(false);
    }
  };



  if (isLoading) return <div style={{ padding: '2rem' }}><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {Array.from({ length: totalDays }).map((_, i) => (
          <button 
            key={i} 
            onClick={() => setDay(i + 1)}
            className="admin-btn"
            style={{ backgroundColor: day === i + 1 ? '#3b82f6' : '#e2e8f0', color: day === i + 1 ? 'white' : 'black', border: 'none' }}
          >
            Day {i + 1}
          </button>
        ))}
      </div>

      <div className="admin-card" style={{ border: '2px solid #3b82f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e3a8a' }}>{workshopType} - Day {day} Engine</h2>
            <input type="text" value={dayTitle} onChange={e => setDayTitle(e.target.value)} placeholder="Day Title (e.g. Resume Building)" style={{ padding: '0.25rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', width: '300px' }} />
          </div>
          <button onClick={handleSave} disabled={isSaving} className="admin-btn admin-btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Master Curriculum
          </button>
        </div>
        
        
        {/* AI Co-Pilot Block */}
        <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0369a1', fontWeight: 600 }}>
            <Sparkles size={20} /> AI Curriculum Co-Pilot
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <textarea 
              rows={2} 
              value={aiPrompt} 
              onChange={(e) => setAiPrompt(e.target.value)} 
              placeholder="e.g. 'Generate a day on Resume Building using the STAR method...'" 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #bae6fd', width: '100%' }} 
            />
            <button 
              onClick={handleAIGenerate} 
              disabled={isGeneratingCurriculum} 
              className="admin-btn" 
              style={{ backgroundColor: '#0284c7', color: 'white', border: 'none', height: '100%', minHeight: '62px', padding: '0 1.5rem' }}
            >
              {isGeneratingCurriculum ? <Loader2 size={20} className="animate-spin" /> : 'Generate Day with AI'}
            </button>
          </div>
        </div>

<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {modules.map((mod, index) => (
            <div key={mod.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginRight: '0.5rem' }}>
                    <button onClick={() => moveModule(index, 'up')} disabled={index === 0} style={{ border: 'none', background: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.2 : 1 }}>▲</button>
                    <button onClick={() => moveModule(index, 'down')} disabled={index === modules.length - 1} style={{ border: 'none', background: 'none', cursor: index === modules.length - 1 ? 'not-allowed' : 'pointer', opacity: index === modules.length - 1 ? 0.2 : 1 }}>▼</button>
                  </div>
                  
                  {mod.type === 'AUDIO_BRIEFING' && <PlayCircle size={18} style={{ color: '#3b82f6' }} />}
                  {mod.type === 'ACTIVITY' && <Settings2 size={18} style={{ color: '#8b5cf6' }} />}
                  {mod.type === 'UPLOAD' && <UploadCloud size={18} style={{ color: '#10b981' }} />}
                  
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>{mod.type.replace('_', ' ')}</span>
                </div>
                <button onClick={() => deleteModule(mod.id)} className="admin-btn" style={{ padding: '0.25rem', color: '#ef4444', border: 'none' }}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Module Title</label>
                  <input type="text" value={mod.title} onChange={e => updateModule(mod.id, { title: e.target.value })} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>{mod.type === 'AUDIO_BRIEFING' ? 'Briefing Script (Read by AI)' : 'Instructions / Description'}</label>
                  <textarea rows={4} value={mod.description} onChange={e => updateModule(mod.id, { description: e.target.value })} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
                </div>

                {mod.type === 'AUDIO_BRIEFING' && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534', fontWeight: 500 }}>
                      ✓ This script will be automatically read aloud by the student's browser (Web Speech API). No audio generation needed!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Module Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center', padding: '2rem', border: '2px dashed #cbd5e1', borderRadius: '0.5rem' }}>
            <button onClick={() => addModule('AUDIO_BRIEFING')} className="admin-btn" style={{ border: '1px solid #3b82f6', color: '#3b82f6' }}>
              <Plus size={16} /> Add AI Audio Briefing
            </button>
            <button onClick={() => addModule('ACTIVITY')} className="admin-btn" style={{ border: '1px solid #8b5cf6', color: '#8b5cf6' }}>
              <Plus size={16} /> Add Activity Block
            </button>
            <button onClick={() => addModule('UPLOAD')} className="admin-btn" style={{ border: '1px solid #10b981', color: '#10b981' }}>
              <Plus size={16} /> Add Submission Block
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
