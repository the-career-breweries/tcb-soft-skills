import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert AssetUploadModal component before SlideViewer
modal_code = """
const AssetUploadModal = ({ isOpen, onClose, currentSlideContent }: { isOpen: boolean, onClose: () => void, currentSlideContent: string }) => {
  const [assetType, setAssetType] = useState<'image' | 'video' | 'gif' | 'other' | null>(null);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>Upload Asset to Slide</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={24} /></button>
        </div>

        {!assetType ? (
          <div>
            <p style={{ color: '#4b5563', marginBottom: '16px' }}>What type of asset are you uploading for this activity?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => setAssetType('image')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <ImageIcon size={32} color="#3b82f6" />
                <span style={{ fontWeight: '600', color: '#374151' }}>Image</span>
              </button>
              <button onClick={() => setAssetType('video')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#ef4444'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <Video size={32} color="#ef4444" />
                <span style={{ fontWeight: '600', color: '#374151' }}>Video</span>
              </button>
              <button onClick={() => setAssetType('gif')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#10b981'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <Sparkles size={32} color="#10b981" />
                <span style={{ fontWeight: '600', color: '#374151' }}>GIF</span>
              </button>
              <button onClick={() => setAssetType('other')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#8b5cf6'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <FileQuestion size={32} color="#8b5cf6" />
                <span style={{ fontWeight: '600', color: '#374151' }}>Other Document</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setAssetType(null)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>← Back</button>
              <span style={{ fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>Uploading {assetType}</span>
            </div>
            
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
              <UploadCloud size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Click to browse or drag and drop</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Maximum file size 50MB</p>
            </div>

            <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}>
              Confirm Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SlideViewer
"""
content = re.sub(r'export default function SlideViewer', modal_code, content)

# 2. Add isUploadModalOpen state
state_code = """    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
"""
content = re.sub(r'const \[isLoading, setIsLoading\] = useState\(true\);', r'const [isLoading, setIsLoading] = useState(true);\n' + state_code, content)

# 3. Replace alert with opening modal
content = re.sub(r'alert\("Asset Upload Modal will open here!"\)', 'setIsUploadModalOpen(true)', content)

# 4. Render modal at end
modal_render = """
      {/* Admin Asset Upload Modal */}
      {isAdmin && (
        <AssetUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          currentSlideContent={slides[currentSlide] || ''}
        />
      )}
    </div>
"""
content = re.sub(r'</div>\s*?\);\s*?}\s*?$', modal_render + '  );\n}\n', content)


with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

