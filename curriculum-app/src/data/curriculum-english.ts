export interface WeekData {
  week: number | string;
  semester: number;
  level?: number;
  theme: string;
  focus: string;
  task: string;
  rubric: string;
  label?: string; // e.g. "Orientation" instead of Week 0
}

export interface StreamCurriculum {
  streamName: string;
  weeks: WeekData[];
}

export interface ProgramCurriculum {
  programName: string;
  streams: StreamCurriculum[];
}

const englishSem1Weeks: WeekData[] = [
  { week: 0, semester: 1, level: 1, theme: 'Welcome to Communicative English', focus: 'Orientation & Roadmap', task: 'Introduction', rubric: 'Participation', label: 'Orientation' },
  { week: 1, semester: 1, level: 1, theme: 'Fundamentals of Grammar', focus: 'Parts of Speech, Tenses, Sentence Structure', task: 'Grammar Worksheets', rubric: 'Accuracy' },
  { week: 2, semester: 1, level: 1, theme: 'Vocabulary Development', focus: 'Synonyms, Antonyms, Aviation Technical Vocab', task: 'Vocabulary Quizzes', rubric: 'Contextual Usage' },
  { week: 3, semester: 1, level: 1, theme: 'Reading Skills', focus: 'Comprehension, Skimming, Scanning', task: 'Reading Analysis', rubric: 'Speed and Interpretation' },
  { week: 4, semester: 1, level: 1, theme: 'Writing Skills', focus: 'Paragraphs, Letters, Reports, Emails', task: 'Drafting Professional Emails', rubric: 'Formatting, Tone' },
  { week: 5, semester: 1, level: 1, theme: 'Listening & Speaking Skills', focus: 'Pronunciation, Conversation, Role Play', task: 'Role Play Scenarios', rubric: 'Fluency, Articulation' },
];

export const curriculumDataEnglish: Record<'ug' | 'pg', ProgramCurriculum> = {
  ug: {
    programName: 'Undergraduate',
    streams: [
      { streamName: 'BBA Aviation', weeks: englishSem1Weeks },
      { streamName: 'B.Sc Aviation', weeks: englishSem1Weeks },
    ]
  },
  pg: {
    programName: 'Postgraduate',
    streams: []
  }
};
