'use client';

import React from 'react';

export default function VerbFamiliesCheatSheet() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
      color: '#1f2937',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.5rem' }}>
          The 5 Families of Irregular Verbs
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#4b5563' }}>A Quick Reference Guide</p>
      </div>

      <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        English irregular verbs don't follow the modern "-ed" rule. Instead, they are ancient survivors that fall into <strong>five main pattern families</strong>. Use this cheat sheet to quickly identify which family a verb belongs to!
      </p>

      {/* Family 1 */}
      <div className="family-block" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e40af', marginBottom: '1rem' }}>Family 1: The "All Identical" Family (V1 = V2 = V3)</h2>
        <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#475569' }}>These verbs are stubborn—they never change their shape, no matter what time it is.</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
          <li><strong>Put</strong> / Put / Put</li>
          <li><strong>Cut</strong> / Cut / Cut</li>
          <li><strong>Hit</strong> / Hit / Hit</li>
          <li><strong>Cost</strong> / Cost / Cost</li>
          <li><strong>Set</strong> / Set / Set</li>
        </ul>
        <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '4px', fontSize: '0.95rem' }}>
          <strong>✈️ Aviation Context:</strong> "The ground crew <strong>set</strong> the chocks yesterday, and they have <strong>set</strong> them again today."
        </div>
      </div>

      {/* Family 2 */}
      <div className="family-block" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#5b21b6', marginBottom: '1rem' }}>Family 2: The "Twins" Family (V2 = V3)</h2>
        <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#475569' }}>For these verbs, the Simple Past (V2) and the Past Participle (V3) are identical.</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
          <li><strong>Build</strong> / Built / Built</li>
          <li><strong>Leave</strong> / Left / Left</li>
          <li><strong>Keep</strong> / Kept / Kept</li>
          <li><strong>Find</strong> / Found / Found</li>
          <li><strong>Catch</strong> / Caught / Caught</li>
          <li><strong>Buy</strong> / Bought / Bought</li>
        </ul>
        <div style={{ backgroundColor: '#ede9fe', padding: '1rem', borderRadius: '4px', fontSize: '0.95rem' }}>
          <strong>✈️ Aviation Context:</strong> "The flight <strong>left</strong> on time. In fact, it has <strong>left</strong> on time all week."
        </div>
      </div>

      {/* Family 3 */}
      <div className="family-block" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#065f46', marginBottom: '1rem' }}>Family 3: The "Boomerang" Family (V1 = V3)</h2>
        <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#475569' }}>These verbs "boomerang" right back to their original base form for the V3 slot.</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
          <li><strong>Come</strong> / Came / <strong>Come</strong></li>
          <li><strong>Run</strong> / Ran / <strong>Run</strong></li>
          <li><strong>Become</strong> / Became / <strong>Become</strong></li>
        </ul>
        <div style={{ backgroundColor: '#d1fae5', padding: '1rem', borderRadius: '4px', fontSize: '0.95rem' }}>
          <strong>✈️ Aviation Context:</strong> "The captain <strong>came</strong> aboard. He had already <strong>come</strong> aboard before the passengers."
        </div>
      </div>

      {/* Family 4 */}
      <div className="family-block" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#92400e', marginBottom: '1rem' }}>Family 4: The "Vowel Shift (i-a-u)" Family</h2>
        <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#475569' }}>These verbs change their inner vowel from <strong>i</strong> (present) to <strong>a</strong> (past) to <strong>u</strong> (helper past).</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
          <li><strong>Begin</strong> / Began / Begun</li>
          <li><strong>Ring</strong> / Rang / Rung</li>
          <li><strong>Drink</strong> / Drank / Drunk</li>
          <li><strong>Sing</strong> / Sang / Sung</li>
          <li><strong>Sink</strong> / Sank / Sunk</li>
        </ul>
        <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '4px', fontSize: '0.95rem' }}>
          <strong>✈️ Aviation Context:</strong> "The boarding process <strong>began</strong> at 10:00. It had <strong>begun</strong> before I arrived."
        </div>
      </div>

      {/* Family 5 */}
      <div className="family-block" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#991b1b', marginBottom: '1rem' }}>Family 5: The "-en Ending" Family</h2>
        <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#475569' }}>These verbs use a variety of V2 forms, but they almost always end in <strong>"-en"</strong> for their V3 form.</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
          <li><strong>Speak</strong> / Spoke / Spok<strong>en</strong></li>
          <li><strong>Take</strong> / Took / Tak<strong>en</strong></li>
          <li><strong>Break</strong> / Broke / Brok<strong>en</strong></li>
          <li><strong>Fly</strong> / Flew / Flown <em>(ends in an 'n' sound)</em></li>
          <li><strong>Drive</strong> / Drove / Driv<strong>en</strong></li>
          <li><strong>Write</strong> / Wrote / Writt<strong>en</strong></li>
          <li><strong>Fall</strong> / Fell / Fall<strong>en</strong></li>
        </ul>
        <div style={{ backgroundColor: '#fee2e2', padding: '1rem', borderRadius: '4px', fontSize: '0.95rem' }}>
          <strong>✈️ Aviation Context:</strong> "The pilot <strong>flew</strong> the aircraft. She has <strong>flown</strong> this route many times."
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#6b7280', fontSize: '0.9rem' }}>
        <button 
          onClick={() => window.print()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 600,
            marginBottom: '1rem'
          }}
          className="print-hide-btn"
        >
          🖨️ Print Cheat Sheet
        </button>
        <p>© The Career Breweries - Communicative English</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .print-hide-btn {
            display: none !important;
          }
          body {
            background-color: white !important;
          }
          .family-block {
            break-inside: avoid;
            page-break-inside: avoid;
            border-left: 4px solid #000 !important;
          }
        }
      `}} />
    </div>
  );
}
