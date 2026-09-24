import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the AssetUploadModal component
new_modal_code = """
const AssetUploadModal = ({ isOpen, onClose, currentSlideContent }: { isOpen: boolean, onClose: () => void, currentSlideContent: string }) => {
  const [assetType, setAssetType] = useState<'image' | 'video' | 'gif' | 'other' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setAssetType(null);
    setFile(null);
    setUploadedUrl(null);
  };

  const handleFullClose = () => {
    handleReset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'lywlehez');

    try {
      // For images, gifs, and other docs, use image upload endpoint. For videos use video.
      const resourceType = assetType === 'video' ? 'video' : 'image';
      const response = await fetch(`https://api.cloudinary.com/v1_1/l4eozknq/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>Upload Asset to Slide</h2>
          <button onClick={handleFullClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={24} /></button>
        </div>

        {uploadedUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 0', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Upload Successful!</h3>
            <p style={{ color: '#4b5563', margin: 0 }}>Your file has been safely stored in Cloudinary.</p>
            
            <div style={{ width: '100%', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '8px' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px', textAlign: 'left' }}>Markdown Code for this Slide:</p>
              <code style={{ display: 'block', padding: '12px', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all' }}>
                {assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${uploadedUrl} -->` : `![Activity Asset](${uploadedUrl})`}
              </code>
            </div>
            
            <button onClick={handleReset} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}>
              Upload Another Asset
            </button>
          </div>
        ) : !assetType ? (
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
              <button onClick={handleReset} style={{ background: '#f3f4f6', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>← Back</button>
              <span style={{ fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>Uploading {assetType}</span>
            </div>
            
            <label style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', backgroundColor: file ? '#eff6ff' : '#f8fafc', borderColor: file ? '#3b82f6' : '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}>
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept={assetType === 'image' || assetType === 'gif' ? 'image/*' : assetType === 'video' ? 'video/*' : '*/*'} />
              {!file ? (
                <>
                  <UploadCloud size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Click to browse and select a file</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Maximum file size 50MB</p>
                </>
              ) : (
                <>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e40af', margin: '0 0 8px 0' }}>{file.name}</h3>
                  <p style={{ color: '#3b82f6', fontSize: '0.9rem', margin: 0 }}>Ready to upload</p>
                </>
              )}
            </label>

            <button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              style={{ backgroundColor: !file ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: !file || uploading ? 'not-allowed' : 'pointer', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {uploading ? (
                <><Loader2 size={20} className="spinner" /> Uploading...</>
              ) : (
                'Confirm Upload'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
"""

# replace the old AssetUploadModal with the new one
# Use regex to find everything from `const AssetUploadModal = ({` down to the `};` just before `export default function SlideViewer`
import re
new_content = re.sub(
    r'const AssetUploadModal = \(\{.*?^\};\n\nexport default function SlideViewer',
    new_modal_code + "\n\nexport default function SlideViewer",
    content,
    flags=re.DOTALL | re.MULTILINE
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
