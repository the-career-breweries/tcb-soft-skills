"use client";

import React, { useState } from 'react';
import { MousePointer2, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';

type NodeId = 'input' | 'cpu' | 'memory' | 'output' | 'dataflow' | null;

export default function BlockDiagramInteractive() {
  const [hovered, setHovered] = useState<NodeId>(null);

  const contentMap = {
    input: {
      title: "Input Unit",
      def: "Takes raw data and instructions from the user and converts it into a digital form the computer can understand.",
      examples: ["Keyboard", "Mouse", "Scanner", "Microphone", "Barcode Reader"]
    },
    cpu: {
      title: "Central Processing Unit (CPU)",
      def: "The 'brain' of the computer where all calculations and decisions are made.",
      sub: [
        { name: "Control Unit (CU)", def: "Acts like a traffic cop. It directs the operation of the processor, fetching and decoding instructions." },
        { name: "Arithmetic Logic Unit (ALU)", def: "Performs all mathematical calculations (addition, subtraction) and logical comparisons (AND, OR, NOT)." }
      ]
    },
    memory: {
      title: "Memory & Storage Unit",
      def: "Holds data, instructions, and intermediate results waiting to be processed or outputted.",
      examples: ["RAM (Primary, Temporary)", "Hard Disk / SSD (Secondary, Permanent)", "Cache Memory"]
    },
    output: {
      title: "Output Unit",
      def: "Takes the processed digital results from the computer and converts them back into a human-readable form.",
      examples: ["Monitor (Screen)", "Printer", "Speakers", "Projector"]
    },
    dataflow: {
      title: "Data & Control Flow",
      def: "The continuous cycle of information moving through the system.",
      examples: [
        "1. Raw Data enters via Input.",
        "2. Data is held in Memory.",
        "3. CPU fetches from Memory, processes it using ALU/CU, and writes back.",
        "4. Final Information is sent to Output."
      ]
    }
  };

  return (
    <div 
      className="interactive-diagram-container"
      style={{
        position: 'relative', width: '100%', height: '500px', 
        background: '#0f172a', borderRadius: '16px', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #1e293b',
        marginTop: '2rem'
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
        <MousePointer2 size={16} /> Hover over components to reveal details
      </div>

      {/* BASE DIAGRAM (Will blur when hovered) */}
      <div 
        style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem',
          transition: 'filter 0.3s ease, opacity 0.3s ease',
          filter: hovered ? 'blur(8px) brightness(0.4)' : 'blur(0px) brightness(1)',
          position: 'relative'
        }}
      >
        {/* INPUT */}
        <div 
          onMouseEnter={() => setHovered('input')}
          style={{ width: '180px', height: '120px', background: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: '3px solid #60a5fa', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', zIndex: 10 }}
        >
          Input Unit
        </div>

        {/* ARROW 1 */}
        <div 
          onMouseEnter={() => setHovered('dataflow')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '1rem' }}
        >
          <ArrowRight size={40} color="#94a3b8" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Data</span>
        </div>

        {/* CPU & MEMORY COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative' }}>
          
          {/* MEMORY */}
          <div 
            onMouseEnter={() => setHovered('memory')}
            style={{ width: '180px', height: '100px', background: '#f59e0b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: '3px solid #fbbf24', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)', zIndex: 10 }}
          >
            Memory Unit
          </div>

          {/* ARROWS (Vertical) */}
          <div 
            onMouseEnter={() => setHovered('dataflow')}
            style={{ display: 'flex', gap: '1rem', cursor: 'pointer', padding: '0.5rem' }}
          >
            <ArrowUp size={32} color="#94a3b8" />
            <ArrowDown size={32} color="#94a3b8" />
          </div>

          {/* CPU */}
          <div 
            onMouseEnter={() => setHovered('cpu')}
            style={{ width: '220px', height: '140px', background: '#9333ea', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: '3px solid #c084fc', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)', zIndex: 10 }}
          >
            <div style={{ marginBottom: '0.5rem' }}>CPU</div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 'normal' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>CU</div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>ALU</div>
            </div>
          </div>
        </div>

        {/* ARROW 2 */}
        <div 
          onMouseEnter={() => setHovered('dataflow')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '1rem' }}
        >
          <ArrowRight size={40} color="#94a3b8" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Information</span>
        </div>

        {/* OUTPUT */}
        <div 
          onMouseEnter={() => setHovered('output')}
          style={{ width: '180px', height: '120px', background: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: '3px solid #34d399', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)', zIndex: 10 }}
        >
          Output Unit
        </div>
      </div>

      {/* HOVER OVERLAY (Displays content) */}
      {hovered && (
        <div 
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', zIndex: 50, pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.95)', border: '1px solid #334155', 
            borderRadius: '16px', padding: '2.5rem', maxWidth: '600px', width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)', color: 'white'
          }}>
            <h3 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: '#60a5fa' }}>
              {contentMap[hovered].title}
            </h3>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#e2e8f0', marginBottom: '1.5rem' }}>
              {contentMap[hovered].def}
            </p>
            
            {contentMap[hovered].examples && (
              <div>
                <h4 style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', marginBottom: '0.8rem' }}>Examples</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {contentMap[hovered].examples.map((ex, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '1rem' }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {contentMap[hovered].sub && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {contentMap[hovered].sub.map((s, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #c084fc' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#c084fc' }}>{s.name}</h4>
                    <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.5 }}>{s.def}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* We need to overlay transparent hover zones so the mouse doesn't trigger onMouseLeave when the content modal pops up *over* the elements! */}
      {/* Wait, the container has pointerEvents: 'none' on the modal, so mouse events pass through to the blurred items perfectly! */}
    </div>
  );
}
