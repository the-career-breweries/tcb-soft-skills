import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update AppTheme
content = content.replace(
    "export type AppTheme = 'netflix' | 'prime' | 'crunchyroll' | 'classic';",
    "export type AppTheme = 'netflix' | 'prime' | 'crunchyroll' | 'classic' | 'youtube' | 'game';"
)

# 2. Add lucide imports
content = content.replace(
    "import { Plane, PlaneTakeoff, Users, MessageSquare } from 'lucide-react';",
    "import { Plane, PlaneTakeoff, Users, MessageSquare, Youtube, Gamepad2 } from 'lucide-react';"
)

# 3. Add Custom Logos
flytube_and_game_logos = """

const FlyTubeLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
      }}>
        <Youtube size={72} color="#ff0000" strokeWidth={1.5} />
      </div>
      <span style={{ fontSize: '2rem', fontWeight: '900', color: '#ff0000', letterSpacing: '-1px', fontFamily: '"Oswald", sans-serif' }}>
        FlyTube
      </span>
    </div>
  );
};

const GameItLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        transition: 'all 0.2s ease-in-out',
        transform: isHovered ? 'translateY(-10px) rotate(-5deg)' : 'translateY(0px) rotate(0deg)',
        filter: isHovered ? 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))' : 'none'
      }}>
        <Gamepad2 size={72} color="#22c55e" strokeWidth={1.5} />
      </div>
      <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#22c55e', letterSpacing: '2px', fontFamily: '"Press Start 2P", monospace', textTransform: 'uppercase' }}>
        Let's Game It!
      </span>
    </div>
  );
};

"""
content = content.replace("export default function ThemeSelector", flytube_and_game_logos + "export default function ThemeSelector")


# 4. Inject into themes array
themes_injection = """
    ,
    {
      id: 'youtube' as AppTheme,
      name: 'FlyTube',
      logoComponent: <FlyTubeLogo isHovered={hoveredTheme === 'youtube'} />,
      color: '#ff0000',
      bg: 'linear-gradient(to bottom, rgba(15,15,15,0) 0%, rgba(15,15,15,1) 100%), url("https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=2074&auto=format&fit=crop")',
    },
    {
      id: 'game' as AppTheme,
      name: "Let's Game It!",
      logoComponent: <GameItLogo isHovered={hoveredTheme === 'game'} />,
      color: '#22c55e',
      bg: 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,1) 100%), url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop")',
    }
  ];
"""

content = content.replace("    ];\n\n  return (", themes_injection + "\n  return (")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
