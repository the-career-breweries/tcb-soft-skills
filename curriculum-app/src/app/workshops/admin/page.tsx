"use client";

import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Building2, TrendingUp, Activity } from 'lucide-react';
import { getBatchesAction, getRegistrationsAction } from '@/app/actions/adminOps';

export default function AdminDashboardRoot() {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalStudents: 0,
    pendingIndividuals: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const [batchesRes, regRes] = await Promise.all([
          getBatchesAction(),
          getRegistrationsAction()
        ]);
        
        let students = 0;
        let institutions = 0;
        
        if (batchesRes.success && batchesRes.batches) {
          institutions = batchesRes.batches.length;
          students = batchesRes.batches.reduce((acc: number, b: any) => acc + (b.studentCount || 0), 0);
        }
        
        let pending = 0;
        if (regRes.success && regRes.registrations) {
          pending = regRes.registrations.filter((r: any) => r.status === 'pending' || r.status === 'verification').length;
        }

        setStats({
          totalInstitutions: institutions,
          totalStudents: students,
          pendingIndividuals: pending
        });
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Executive Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Welcome to the Admin Portal overview.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Stat Card 1 */}
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '0.75rem' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Partner Institutions</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
              {isLoading ? '...' : stats.totalInstitutions}
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', color: '#22c55e', borderRadius: '0.75rem' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Total Enrolled Students</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
              {isLoading ? '...' : stats.totalStudents}
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#fefce8', color: '#eab308', borderRadius: '0.75rem' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Pending Individual Registrations</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
              {isLoading ? '...' : stats.pendingIndividuals}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        <Activity size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Activity Feed</h3>
        <p style={{ fontSize: '0.875rem' }}>Recent system activity and alerts will appear here.</p>
      </div>
    </div>
  );
}
