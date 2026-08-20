"use client";

import React, { useState } from 'react';
import MasterCurriculumBuilder from '../MasterCurriculumBuilder';

export default function CurriculumEnginePage() {
  const [activeTab, setActiveTab] = useState('3-Days');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Master Curriculum Engine</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('3-Days')} className="admin-btn" style={{ backgroundColor: activeTab === '3-Days' ? '#1e293b' : '#e2e8f0', color: activeTab === '3-Days' ? 'white' : 'black', border: 'none' }}>
          3-Days Master
        </button>
        <button onClick={() => setActiveTab('5-Days')} className="admin-btn" style={{ backgroundColor: activeTab === '5-Days' ? '#1e293b' : '#e2e8f0', color: activeTab === '5-Days' ? 'white' : 'black', border: 'none' }}>
          5-Days Master
        </button>
        <button onClick={() => setActiveTab('10-Days')} className="admin-btn" style={{ backgroundColor: activeTab === '10-Days' ? '#1e293b' : '#e2e8f0', color: activeTab === '10-Days' ? 'white' : 'black', border: 'none' }}>
          10-Days Master
        </button>
      </div>

      <MasterCurriculumBuilder workshopType={activeTab} />
    </div>
  );
}
