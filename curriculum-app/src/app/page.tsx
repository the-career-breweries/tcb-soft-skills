"use client";

import Link from 'next/link';
import { BookOpen, GraduationCap, Code, Shield, Upload, FileText } from 'lucide-react';
import './globals.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-2">The Career Breweries</h1>
        <p className="text-xl text-center text-slate-600 mb-12">Curriculum Management Portal</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Soft Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <UsersIcon />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Soft Skills</h2>
              <p className="text-slate-600 mb-4 text-sm">Interactive personality development & communication sessions.</p>
              
              <div className="space-y-2">
                <Link href="/soft-skills" className="block text-sm font-medium text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-md transition-colors">
                  ▶ Launch Presentation
                </Link>
                <Link href="/admin/soft-skills" className="block text-sm font-medium text-slate-600 hover:text-slate-800 p-2 hover:bg-slate-50 rounded-md transition-colors">
                  ⚙️ Admin: Upload Assets
                </Link>
                <Link href="/admin/feedback/soft-skills" className="block text-sm font-medium text-slate-600 hover:text-slate-800 p-2 hover:bg-slate-50 rounded-md transition-colors">
                  📊 View Feedback
                </Link>
              </div>
            </div>
          </div>

          {/* Communicative English */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Communicative English</h2>
              <p className="text-slate-600 mb-4 text-sm">Grammar, vocabulary, and professional English modules.</p>
              
              <div className="space-y-2">
                <Link href="/communicative-english" className="block text-sm font-medium text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-md transition-colors">
                  ▶ Launch Presentation
                </Link>
              </div>
            </div>
          </div>

          {/* Computing Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Code size={24} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Computing Skills</h2>
              <p className="text-slate-600 mb-4 text-sm">Hardware, software, MS Office, and cyber security.</p>
              
              <div className="space-y-2">
                <Link href="/computing-skills" className="block text-sm font-medium text-emerald-600 hover:text-emerald-800 p-2 hover:bg-emerald-50 rounded-md transition-colors">
                  ▶ Launch Presentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}
