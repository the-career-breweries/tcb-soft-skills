import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

dropdown_component = """
const CustomDropdown = ({ value, options, onChange }: { value: string | number, options: { label: string, value: string | number }[], onChange: (val: any) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div ref={ref} style={{ position: 'relative' }} onMouseLeave={() => setIsOpen(false)}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        style={{ 
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
          color: isOpen ? 'white' : '#e5e7eb', transition: 'color 0.2s'
        }}
      >
        {options.find(o => o.value === value)?.label || value}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '-20px', paddingTop: '15px', minWidth: '180px', zIndex: 100 }}>
          <div style={{
            background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px', padding: '0.5rem 0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: '-7px', left: '30px',
              width: 0, height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderBottom: '7px solid rgba(255,255,255,0.2)'
            }} />
            <div style={{
              position: 'absolute', top: '-6px', left: '31px',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid rgba(20,20,20,0.95)'
            }} />
            
            {options.map(opt => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                style={{
                  padding: '0.8rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem',
                  color: opt.value === value ? 'white' : '#9ca3af',
                  fontWeight: opt.value === value ? 'bold' : 'normal',
                  transition: 'background 0.2s, color 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = opt.value === value ? 'white' : '#9ca3af'; }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
"""

content = content.replace('export default function CurriculumApp', dropdown_component + '\nexport default function CurriculumApp')

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
