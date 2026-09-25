import re
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code_block = """                <code style={{ display: 'block', padding: '12px', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                  {assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${uploadedUrl} -->` : assetType === 'image' ? `\`\`\`absurd-abstract\\nimage: ${uploadedUrl}\\nquestion: Type your question here...\\nreveal: Type the reveal truth here!\\n\`\`\`` : `![Activity Asset](${uploadedUrl})`}
                </code>"""

new_code_block = """                {assetType === 'video' || assetType === 'image' || assetType === 'gif' ? (
                  <>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px', textAlign: 'left', marginTop: '8px' }}>Option 1: Subtitle Mode (Full-screen Cinematic Background)</p>
                    <code style={{ display: 'block', padding: '12px', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                      {`<!-- CINEMATIC_BG: ${uploadedUrl} -->`}
                    </code>
                    
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px', textAlign: 'left', marginTop: '16px' }}>Option 2: Interactive Component</p>
                    <code style={{ display: 'block', padding: '12px', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                      {assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${uploadedUrl} -->` : `\`\`\`absurd-abstract\\nimage: ${uploadedUrl}\\nquestion: Type your question here...\\nreveal: Type the reveal truth here!\\n\`\`\``}
                    </code>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px', textAlign: 'left', marginTop: '8px' }}>Markdown Code for this Slide:</p>
                    <code style={{ display: 'block', padding: '12px', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                      {`![Activity Asset](${uploadedUrl})`}
                    </code>
                  </>
                )}"""

content = content.replace(old_code_block, new_code_block)
# we also need to remove the "Markdown Code for this Slide:" which was right above the old code block, otherwise it duplicates
content = content.replace("<p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px', textAlign: 'left' }}>Markdown Code for this Slide:</p>", "")


with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
