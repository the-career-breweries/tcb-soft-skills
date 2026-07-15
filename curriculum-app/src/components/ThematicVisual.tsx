import React from 'react';
import { 
  TrendingUp, DollarSign, PieChart, Landmark, Briefcase,
  Megaphone, Target, BarChart2, Users, Rocket,
  Award, Crown, Flag, Star,
  Cpu, Database, Code, Shield, Network,
  GraduationCap, Compass, Navigation,
  Settings, Factory, Activity, Layers, Boxes,
  Globe, Map, Plane,
  Crosshair, Puzzle, GitMerge,
  Lightbulb, Zap, Sparkles,
  LucideIcon
} from 'lucide-react';

interface ThematicVisualProps {
  theme?: string;
  seed: number;
}

// Icon dictionary by theme
const THEME_ICONS: Record<string, LucideIcon[]> = {
  finance: [TrendingUp, DollarSign, PieChart, Landmark, Briefcase],
  marketing: [Megaphone, Target, BarChart2, Users, Rocket],
  leadership: [Award, Crown, Flag, Users, Star],
  technology: [Cpu, Database, Code, Shield, Network],
  career: [Briefcase, GraduationCap, Compass, Navigation, TrendingUp],
  operations: [Settings, Factory, Activity, Layers, Boxes],
  global: [Globe, Map, Navigation, Plane],
  strategy: [Target, Crosshair, Map, Puzzle, GitMerge],
  general: [Lightbulb, Zap, Star, Compass, Sparkles],
};

const THEME_COLORS: Record<string, string> = {
  finance: 'linear-gradient(135deg, #10b981, #134e4a)',
  marketing: 'linear-gradient(135deg, #ec4899, #881337)',
  leadership: 'linear-gradient(135deg, #fbbf24, #78350f)',
  technology: 'linear-gradient(135deg, #3b82f6, #312e81)',
  career: 'linear-gradient(135deg, #22d3ee, #1e3a8a)',
  operations: 'linear-gradient(135deg, #94a3b8, #111827)',
  global: 'linear-gradient(135deg, #8b5cf6, #581c87)',
  strategy: 'linear-gradient(135deg, #ef4444, #881337)',
  general: 'linear-gradient(135deg, #6366f1, #312e81)',
};

const LAYOUTS = ['centered-glow', 'grid-nodes', 'asymmetric-cards', 'wave-backdrop'];

export default function ThematicVisual({ theme = 'general', seed }: ThematicVisualProps) {
  // Normalize theme
  const normalizedTheme = theme.toLowerCase().trim();
  const validTheme = THEME_ICONS[normalizedTheme] ? normalizedTheme : 'general';
  
  // Pseudo-random selection based on seed
  const icons = THEME_ICONS[validTheme];
  const IconComponent = icons[seed % icons.length];
  const layout = LAYOUTS[seed % LAYOUTS.length];
  const colorGradient = THEME_COLORS[validTheme];
  
  return (
    <div className={`thematic-visual-container ${layout}`}>
      <div className="thematic-bg" style={{ background: colorGradient }}></div>
      
      {/* Decorative elements based on layout */}
      <div className="thematic-decorations">
        {layout === 'grid-nodes' && (
          <div className="grid-pattern"></div>
        )}
        {layout === 'asymmetric-cards' && (
          <>
            <div className="glass-card card-1"></div>
            <div className="glass-card card-2"></div>
          </>
        )}
        {layout === 'centered-glow' && (
          <div className="glow-ring"></div>
        )}
        {layout === 'wave-backdrop' && (
          <div className="wave-svg"></div>
        )}
      </div>

      {/* Main Icon */}
      <div className="icon-wrapper">
        <IconComponent size={64} className="main-icon" color="white" strokeWidth={1.5} />
      </div>
    </div>
  );
}
