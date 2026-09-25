import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'import StreamingDashboard' not in content:
    content = content.replace("import SlideViewer from '@/components/SlideViewer';", "import SlideViewer from '@/components/SlideViewer';\nimport StreamingDashboard from '@/components/StreamingDashboard';")

# Replace everything from <div className="lms-container"> to the end of the file
# with our new edge-to-edge layout!
start_idx = content.find('<div className="lms-container">')
if start_idx != -1:
    new_jsx = """<div className="lms-container" style={{ background: 'var(--bg-app)', color: 'white' }}>
          {/* Top Navbar (Edge-to-Edge) */}
          <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4%',
            zIndex: 100, transition: 'background 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => setActiveLesson(null)}>
                <Tv size={32} />
                <h1 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '1px', margin: 0, fontFamily: '"Arial Black", sans-serif' }}>
                  STUDIO
                </h1>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#e5e7eb' }}>
                <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#e5e7eb'}>Home</span>
                
                {/* Program Selector */}
                <select 
                  value={program} 
                  onChange={handleProgramChange}
                  style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none', fontWeight: '600', cursor: 'pointer', appearance: 'none' }}
                >
                  <option value="ug" style={{color: 'black'}}>Undergraduate</option>
                  <option value="pg" style={{color: 'black'}}>Postgraduate</option>
                </select>

                {/* Stream Selector */}
                <select 
                  value={selectedStream} 
                  onChange={handleStreamChange}
                  style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none', fontWeight: '600', cursor: 'pointer', appearance: 'none' }}
                >
                  {streams.map(s => <option key={s.streamName} value={s.streamName} style={{color: 'black'}}>{s.streamName}</option>)}
                </select>
                
                {/* Semester Selector */}
                <select 
                  value={selectedSemester} 
                  onChange={(e) => {
                    setSelectedSemester(Number(e.target.value));
                    setSearchResults(null);
                    setActiveLesson(null);
                  }}
                  style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none', fontWeight: '600', cursor: 'pointer', appearance: 'none' }}
                >
                  {semesters.map(s => <option key={s} value={s} style={{color: 'black'}}>Semester {s}</option>)}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} color="white" />
              </div>
              <button 
                onClick={() => setHasSelectedTheme(false)}
                style={{ 
                  background: 'none', border: 'none', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
                title="Switch Profile"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} color="white" />
                </div>
              </button>
            </div>
          </header>

          <main style={{ width: '100vw', minHeight: '100vh', paddingTop: activeLesson ? '70px' : '0' }}>
            {activeLesson ? (
              <SlideViewer isAdmin={isAdmin}
                weekData={activeLesson}
                program={program}
                stream={selectedStream}
                semester={selectedSemester}
                activeSection={activeSection}
                theme={theme}
                onClose={() => setActiveLesson(null)}
              />
            ) : (
              <StreamingDashboard 
                program={program}
                streamName={selectedStream}
                semester={selectedSemester}
                weeks={curriculumData[program].streams.find(s => s.streamName === selectedStream)?.semesters.find(s => s.semester === selectedSemester)?.weeks || []}
                onSelectLesson={setActiveLesson}
                theme={theme}
              />
            )}
          </main>
        </div>
      </>
    );
  }
}
"""
    content = content[:start_idx] + new_jsx

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
