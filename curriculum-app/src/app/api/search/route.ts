import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const results: Array<{ title: string; link: string; snippet: string }> = [];

    $('.result').each((i, element) => {
      if (i >= 5) return false; // Limit to top 5 results

      const titleElement = $(element).find('.result__title a');
      const title = titleElement.text().trim();
      const link = titleElement.attr('href') || '';
      
      const snippetElement = $(element).find('.result__snippet');
      const snippet = snippetElement.text().trim();

      if (title && link) {
        let actualLink = link;
        if (link.startsWith('//duckduckgo.com/l/?uddg=')) {
          const urlParams = new URLSearchParams(link.split('?')[1]);
          const uddg = urlParams.get('uddg');
          if (uddg) actualLink = decodeURIComponent(uddg);
        } else if (link.startsWith('/')) {
            actualLink = 'https://duckduckgo.com' + link;
        }
        
        results.push({ title, link: actualLink, snippet });
      }
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
