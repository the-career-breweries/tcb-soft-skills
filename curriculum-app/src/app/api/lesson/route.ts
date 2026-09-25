import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const program = searchParams.get('program')?.toLowerCase();
  const stream = searchParams.get('stream')?.toLowerCase();
  const semester = searchParams.get('semester');
  const week = searchParams.get('week');

  const course = searchParams.get('course') || 'soft-skills';

  if (!program || !stream || !semester || !week) {
    return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
  }

  try {
    // If week is 0, serve the special orientation presentation
    if (week === '0') {
      const orientationFile = course === 'english' ? 'orientation-english.md' : (course === 'computing-skills' ? 'orientation-computing.md' : 'orientation.md');
      const filePath = path.join(process.cwd(), 'src', 'content', orientationFile);
      const fileContents = await fs.readFile(filePath, 'utf8');
      return NextResponse.json({ content: fileContents });
    }

    // Determine the path to the markdown file
    let safeStream = stream.replace(/\./g, '').replace(/\s+/g, '-');
    
    // Route all UG students in Semesters 1 to 4 to the shared content directory
    // EXCEPT Aviation students, who have specific custom modules for Semester 1
    if (program === 'ug' && parseInt(semester) >= 1 && parseInt(semester) <= 4) {
      if (!safeStream.includes('aviation')) {
        safeStream = 'shared';
      }
    }
    
    const baseFolder = course === 'english' ? 'english-lessons' : (course === 'computing-skills' ? 'computing-skills' : 'lessons');

    const filePath = path.join(
      process.cwd(),
      'src',
      'content',
      baseFolder,
      program,
      safeStream,
      `sem${semester}`,
      `week${week}.md`
    );

    const fileContents = await fs.readFile(filePath, 'utf8');
    return NextResponse.json({ content: fileContents });
  } catch (error) {
    console.error('Failed to read markdown file:', error);
    return NextResponse.json(
      { error: 'Lesson content not found. Create a markdown file for this week to see it here!' },
      { status: 404 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const { program, stream, semester, week, course, content } = await request.json();

    if (!program || !stream || !semester || !week || content === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    let safeStream = stream.replace(/\./g, '').replace(/\s+/g, '-');
    if (program === 'ug' && parseInt(semester) >= 1 && parseInt(semester) <= 4) {
      if (!safeStream.includes('aviation')) {
        safeStream = 'shared';
      }
    }
    
    const baseFolder = course === 'english' ? 'english-lessons' : (course === 'computing-skills' ? 'computing-skills' : 'lessons');

    const filePath = path.join(
      process.cwd(),
      'src',
      'content',
      baseFolder,
      program,
      safeStream,
      `sem${semester}`,
      `week${week}.md`
    );

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save lesson:', error);
    return NextResponse.json({ error: 'Failed to save lesson' }, { status: 500 });
  }
}
