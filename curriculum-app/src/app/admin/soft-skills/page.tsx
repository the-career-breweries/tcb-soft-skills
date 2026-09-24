"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Upload, Image as ImageIcon, Video, File, ArrowLeft } from 'lucide-react';
import '../../globals.css';
import styles from './admin.module.css';

export default function SoftSkillsAdmin() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'art'>('images');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Soft Skills Media Assets</h1>
        </div>

        <div className={styles.panel}>
          <div className={styles.tabs}>
            <button 
              onClick={() => setActiveTab('images')}
              className={`${styles.tab} ${activeTab === 'images' ? styles.active : ''}`}
            >
              <div className={styles.tabContent}>
                <ImageIcon size={18} />
                Images & Slides
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`${styles.tab} ${activeTab === 'videos' ? styles.active : ''}`}
            >
              <div className={styles.tabContent}>
                <Video size={18} />
                Video Clips
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('art')}
              className={`${styles.tab} ${activeTab === 'art' ? styles.active : ''}`}
            >
              <div className={styles.tabContent}>
                <File size={18} />
                Art & Prompts
              </div>
            </button>
          </div>

          <div className={styles.panelBody}>
            <div className={styles.dropzone}>
              <div className={styles.iconCircle}>
                <Upload size={32} />
              </div>
              <h3 className={styles.dropzoneTitle}>Upload {activeTab === 'images' ? 'Images' : activeTab === 'videos' ? 'Video Clips' : 'Art Assets'}</h3>
              <p className={styles.dropzoneDesc}>
                Drag and drop files here or click to browse. These assets will be available for interactive components in the Soft Skills presentation mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
