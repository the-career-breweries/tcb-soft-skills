with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

subtitle_css = """

/* Cinematic Subtitle Mode */
.subtitle-mode {
  width: 100%;
  max-width: 900px;
  text-align: center;
  padding-bottom: 4rem; /* space for playbar */
}
.subtitle-mode h1, 
.subtitle-mode h2, 
.subtitle-mode h3, 
.subtitle-mode p, 
.subtitle-mode li {
  color: white !important;
  font-family: 'Oswald', 'Arial Black', sans-serif !important;
  text-transform: uppercase;
  text-align: center !important;
  text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 4px 20px rgba(0,0,0,0.9) !important;
  letter-spacing: 1px;
}
.subtitle-mode h1 { font-size: 4rem !important; line-height: 1.1; margin-bottom: 1rem; }
.subtitle-mode h2 { font-size: 3rem !important; line-height: 1.2; margin-bottom: 1rem; }
.subtitle-mode p, .subtitle-mode li { font-size: 2.5rem !important; line-height: 1.3; font-weight: 700; }

.cinematic-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}
.cinematic-bg-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cinematic-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.5) 100%);
}
"""

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'a', encoding='utf-8') as f:
    f.write(subtitle_css)
