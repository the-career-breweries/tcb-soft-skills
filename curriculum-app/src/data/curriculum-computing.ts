export interface WeekData {
  week: number | string;
  semester: number;
  level?: number;
  theme: string;
  focus: string;
  task: string;
  rubric: string;
  label?: string; 
}

export interface StreamCurriculum {
  streamName: string;
  weeks: WeekData[];
}

export interface ProgramCurriculum {
  programName: string;
  streams: StreamCurriculum[];
}

const computingSem1Weeks: WeekData[] = [
  { week: 1, semester: 1, theme: 'Introduction to Computers: Hardware & Software', focus: 'Hardware vs Software, Basics', task: 'Turn on/off safely, identify components', rubric: 'Identification' },
  { week: 2, semester: 1, theme: 'Operating Systems: Windows Basics', focus: 'Windows UI, taskbar, start menu', task: 'Desktop management, shortcuts', rubric: 'Navigation' },
  { week: 3, semester: 1, theme: 'File Management: Organising Your Files', focus: 'Folders, File Explorer, Search', task: 'Create, move, and organize folders', rubric: 'Organization' },
  { week: 4, semester: 1, theme: 'MS Word: Document Creation', focus: 'UI, typing, saving, opening', task: 'Create and save a basic document', rubric: 'Creation' },
  { week: 5, semester: 1, theme: 'MS Word: Formatting', focus: 'Fonts, colors, alignment, spacing', task: 'Format a provided text block', rubric: 'Formatting' },
  { week: 6, semester: 1, theme: 'MS Word: Tables & Reports', focus: 'Inserting tables, report structure', task: 'Build a basic tabular report', rubric: 'Structuring' },
  { week: 7, semester: 1, theme: 'MS Excel: Formulas', focus: 'Rows, columns, basic operators', task: 'Calculate values using basic math', rubric: 'Calculation accuracy' },
  { week: 8, semester: 1, theme: 'MS Excel: Functions', focus: 'SUM, AVERAGE, MIN, MAX, IF', task: 'Apply functions to dataset', rubric: 'Function application' },
  { week: 9, semester: 1, theme: 'MS Excel: Charts', focus: 'Pie, Line, Column charts', task: 'Visualize dataset with a chart', rubric: 'Visualization' },
  { week: 10, semester: 1, theme: 'MS Excel: Basic Data Analysis', focus: 'Sorting, Filtering, Conditional Formatting', task: 'Filter and format data', rubric: 'Data manipulation' },
  { week: 11, semester: 1, theme: 'MS PowerPoint: Presentation Design', focus: 'Slides, layouts, text, images', task: 'Create a 3-slide presentation', rubric: 'Design clarity' },
  { week: 12, semester: 1, theme: 'MS PowerPoint: Professional Templates', focus: 'Themes, Master Slide, headers', task: 'Apply global template edits', rubric: 'Consistency' },
  { week: 13, semester: 1, theme: 'Internet & Email: Cloud Storage', focus: 'Browsers, Bookmarks, Email basics', task: 'Navigate and bookmark sites', rubric: 'Web literacy' },
  { week: 14, semester: 1, theme: 'Cyber Safety: Digital Communication', focus: 'Phishing, passwords, malware', task: 'Identify threats, strong passwords', rubric: 'Security awareness' },
];

export const curriculumDataComputing: Record<'ug' | 'pg', ProgramCurriculum> = {
  ug: {
    programName: 'Undergraduate',
    streams: [
      { streamName: 'B.Sc Aviation', weeks: computingSem1Weeks },
      { streamName: 'BBA Aviation', weeks: computingSem1Weeks },
    ]
  },
  pg: {
    programName: 'PG',
    streams: []
  }
};
