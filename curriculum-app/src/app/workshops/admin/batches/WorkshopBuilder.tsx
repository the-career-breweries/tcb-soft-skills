"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Save, PlayCircle, Settings2, Mic } from 'lucide-react';
import { updateBatchCurriculumAction } from '@/app/actions/adminOps';
import { storage } from '@/lib/firebase/config';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export default function WorkshopBuilder({ batch }: { batch: any }) {
  const [day, setDay] = useState(1);
  const totalDays = batch?.name?.includes('5') ? 5 : 3;

  const [config, setConfig] = useState({
    videoTitle: '',
    videoDescription: '',
    videoUrl: '',
    audioUrl: '',
    blockATitle: '',
    blockADescription: '',
    blockBTitle: '',
    blockBDescription: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  useEffect(() => {
    if (batch?.curriculum && batch.curriculum[day.toString()]) {
      setConfig(batch.curriculum[day.toString()]);
    } else {
      setConfig({
        videoTitle: Day  + day +  Briefing,
        videoDescription: Welcome to Day  + day + .,
        videoUrl: '',
        audioUrl: '',
        blockATitle: Block A,
        blockADescription: Task description...,
        blockBTitle: Block B,
        blockBDescription: Task description...,
      });
    }
  }, [batch, day]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateBatchCurriculumAction(batch.id, day, config);
    alert('Curriculum saved successfully!');
    setIsSaving(false);
  };

  const generateAudio = async () => {
    if (!config.videoDescription) return alert('Enter a script in Video Description first!');
    setIsGeneratingAudio(true);
    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: config.videoDescription })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Upload to Firebase Storage
      const storageRef = ref(storage, udio/ + batch.id + /day_ + day + _ + Date.now() + .mp3);
      await uploadString(storageRef, data:audio/mpeg;base64, + data.base64Audio, 'data_url');
      const url = await getDownloadURL(storageRef);
      
      setConfig({ ...config, audioUrl: url, videoUrl: '' });
      alert('AI Audio generated and saved!');
    } catch (e: any) {
      alert('Error generating audio: ' + e.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  if (!batch) return <p>No batch selected.</p>;

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

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Day {day} Configuration</h2>
          <button onClick={handleSave} disabled={isSaving} className="admin-btn admin-btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Day {day}
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Briefing Block */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlayCircle size={18} style={{ color: '#3b82f6' }} />
                Module 1: Morning Briefing
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Title</label>
                <input type="text" value={config.videoTitle} onChange={e => setConfig({...config, videoTitle: e.target.value})} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Briefing Script / Description</label>
                <textarea rows={4} value={config.videoDescription} onChange={e => setConfig({...config, videoDescription: e.target.value})} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>YouTube URL (Optional fallback)</label>
                  <input type="text" value={config.videoUrl} onChange={e => setConfig({...config, videoUrl: e.target.value})} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>AI Audio URL</label>
                  <input type="text" value={config.audioUrl} disabled style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%', backgroundColor: '#f1f5f9' }} />
                </div>
                <button onClick={generateAudio} disabled={isGeneratingAudio} className="admin-btn" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', height: '42px', padding: '0 1rem' }}>
                  {isGeneratingAudio ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />} Generate AI Voice
                </button>
              </div>
              {config.audioUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <audio controls src={config.audioUrl} style={{ width: '100%' }} />
                </div>
              )}
            </div>
          </div>

          {/* Deep Work A */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem' }}>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Settings2 size={18} style={{ color: '#8b5cf6' }} /> Deep Work A
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Title" value={config.blockATitle} onChange={e => setConfig({...config, blockATitle: e.target.value})} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
              <textarea rows={3} placeholder="Description" value={config.blockADescription} onChange={e => setConfig({...config, blockADescription: e.target.value})} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
            </div>
          </div>

          {/* Deep Work B */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem' }}>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Settings2 size={18} style={{ color: '#8b5cf6' }} /> Deep Work B
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Title" value={config.blockBTitle} onChange={e => setConfig({...config, blockBTitle: e.target.value})} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
              <textarea rows={3} placeholder="Description" value={config.blockBDescription} onChange={e => setConfig({...config, blockBDescription: e.target.value})} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', width: '100%' }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
