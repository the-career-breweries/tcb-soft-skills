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
  finance: 'from-emerald-500 to-teal-900',
  marketing: 'from-pink-500 to-rose-900',
  leadership: 'from-amber-400 to-orange-900',
  technology: 'from-blue-500 to-indigo-900',
  career: 'from-cyan-400 to-blue-900',
  operations: 'from-slate-400 to-gray-900',
  global: 'from-violet-500 to-purple-900',
  strategy: 'from-red-500 to-rose-900',
  general: 'from-indigo-500 to-purple-900',
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
      <div className={`thematic-bg bg-gradient-to-br ${colorGradient}`}></div>
      
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
        <IconComponent size={64} className="main-icon text-white" strokeWidth={1.5} />
      </div>
    </div>
  );
}
