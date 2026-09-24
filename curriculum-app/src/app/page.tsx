"use client";

import Link from 'next/link';
import { BookOpen, Code, Upload, BarChart } from 'lucide-react';
import './globals.css';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>The Career Breweries</h1>
        <p className={styles.subtitle}>Curriculum Management Portal</p>
        
        <div className={styles.grid}>
          {/* Soft Skills */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>
                <UsersIcon />
              </div>
              <h2 className={styles.cardTitle}>Soft Skills</h2>
              <p className={styles.cardDesc}>Interactive personality development & communication sessions.</p>
              
              <div className={styles.links}>
                <Link href="/soft-skills" className={`${styles.link} ${styles.primary}`}>
                  ▶ Launch Presentation
                </Link>
                <Link href="/admin/soft-skills" className={`${styles.link} ${styles.secondary}`}>
                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                    <Upload size={16} /> Admin: Upload Assets
                  </span>
                </Link>
                <Link href="/admin/feedback/soft-skills" className={`${styles.link} ${styles.secondary}`}>
                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                    <BarChart size={16} /> View Feedback
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Communicative English */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={`${styles.iconWrapper} ${styles.indigo}`}>
                <BookOpen size={24} />
              </div>
              <h2 className={styles.cardTitle}>Communicative English</h2>
              <p className={styles.cardDesc}>Grammar, vocabulary, and professional English modules.</p>
              
              <div className={styles.links}>
                <Link href="/communicative-english" className={`${styles.link} ${styles.indigo}`}>
                  ▶ Launch Presentation
                </Link>
              </div>
            </div>
          </div>

          {/* Computing Skills */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={`${styles.iconWrapper} ${styles.emerald}`}>
                <Code size={24} />
              </div>
              <h2 className={styles.cardTitle}>Computing Skills</h2>
              <p className={styles.cardDesc}>Hardware, software, MS Office, and cyber security.</p>
              
              <div className={styles.links}>
                <Link href="/computing-skills" className={`${styles.link} ${styles.emerald}`}>
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
