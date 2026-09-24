"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Upload, Image as ImageIcon, Video, File, ArrowLeft } from 'lucide-react';
import '../../globals.css';

export default function SoftSkillsAdmin() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'art'>('images');

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Soft Skills Media Assets</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('images')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'images' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center justify-center gap-2">
                <ImageIcon size={18} />
                Images & Slides
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'videos' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center justify-center gap-2">
                <Video size={18} />
                Video Clips
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('art')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'art' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center justify-center gap-2">
                <File size={18} />
                Art & Prompts
              </div>
            </button>
          </div>

          <div className="p-8">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload {activeTab === 'images' ? 'Images' : activeTab === 'videos' ? 'Video Clips' : 'Art Assets'}</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Drag and drop files here or click to browse. These assets will be available for interactive components in the Soft Skills presentation mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
