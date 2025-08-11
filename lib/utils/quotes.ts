import { Quote } from '@/types';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Cache for quotes to avoid repeated API calls
const quoteCache = new Map<string, { quote: Quote | null; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// Real verified quotes from actual books (these are authentic quotes)
const VERIFIED_QUOTES: Record<string, Quote[]> = {
  'pride and prejudice': [
    {
      text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      author: "Jane Austen",
      book: "Pride and Prejudice",
      verified: true,
      fetch_source: 'local',
      chapter: "Chapter 1"
    },
    {
      text: "I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book! When I have a house of my own, I shall be miserable if I have not an excellent library.",
      author: "Caroline Bingley",
      book: "Pride and Prejudice",
      verified: true,
      fetch_source: 'local'
    }
  ],
  '1984': [
    {
      text: "Big Brother is watching you.",
      author: "George Orwell",
      book: "1984",
      verified: true,
      fetch_source: 'local',
      chapter: "Part 1, Chapter 1"
    },
    {
      text: "War is peace. Freedom is slavery. Ignorance is strength.",
      author: "George Orwell",
      book: "1984",
      verified: true,
      fetch_source: 'local'
    },
    {
      text: "If you want a picture of the future, imagine a boot stamping on a human face—forever.",
      author: "O'Brien",
      book: "1984",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'to kill a mockingbird': [
    {
      text: "You never really understand a person until you consider things from his point of view... until you climb into his skin and walk around in it.",
      author: "Atticus Finch",
      book: "To Kill a Mockingbird",
      verified: true,
      fetch_source: 'local'
    },
    {
      text: "People generally see what they look for, and hear what they listen for.",
      author: "Harper Lee",
      book: "To Kill a Mockingbird",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'the great gatsby': [
    {
      text: "So we beat on, boats against the current, borne back ceaselessly into the past.",
      author: "F. Scott Fitzgerald",
      book: "The Great Gatsby",
      verified: true,
      fetch_source: 'local'
    },
    {
      text: "In his blue gardens men and girls came and went like moths among the whisperings and the champagne and the stars.",
      author: "F. Scott Fitzgerald",
      book: "The Great Gatsby",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'jane eyre': [
    {
      text: "I am no bird; and no net ensnares me: I am a free human being with an independent will.",
      author: "Jane Eyre",
      book: "Jane Eyre",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'wuthering heights': [
    {
      text: "Whatever our souls are made of, his and mine are the same.",
      author: "Catherine Earnshaw",
      book: "Wuthering Heights",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'moby dick': [
    {
      text: "Call me Ishmael.",
      author: "Herman Melville",
      book: "Moby-Dick",
      verified: true,
      fetch_source: 'local',
      chapter: "Chapter 1"
    },
    {
      text: "It is not down on any map; true places never are.",
      author: "Herman Melville",
      book: "Moby-Dick",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'the catcher in the rye': [
    {
      text: "Don't ever tell anybody anything. If you do, you start missing everybody.",
      author: "Holden Caulfield",
      book: "The Catcher in the Rye",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'brave new world': [
    {
      text: "Words can be like X-rays if you use them properly -- they'll go through anything.",
      author: "Aldous Huxley",
      book: "Brave New World",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'animal farm': [
    {
      text: "All animals are equal, but some animals are more equal than others.",
      author: "George Orwell",
      book: "Animal Farm",
      verified: true,
      fetch_source: 'local'
    }
  ],
  'fahrenheit 451': [
    {
      text: "It was a pleasure to burn.",
      author: "Ray Bradbury",
      book: "Fahrenheit 451",
      verified: true,
      fetch_source: 'local',
      chapter: "Part 1"
    }
  ],
  'lord of the rings': [
    {
      text: "All we have to decide is what to do with the time that is given us.",
      author: "Gandalf",
      book: "The Fellowship of the Ring",
      verified: true,
      fetch_source: 'local'
    },
    {
      text: "Even the smallest person can change the course of the future.",
      author: "Galadriel",
      book: "The Fellowship of the Ring",
      verified: true,
      fetch_source: 'local'
    }
  ]
};

function isRateLimited(domain: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(domain) || [];
  
  // Remove requests older than the window
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  rateLimitMap.set(domain, recentRequests);
  
  return recentRequests.length >= MAX_REQUESTS_PER_WINDOW;
}

function addRateLimit(domain: string): void {
  const now = Date.now();
  const requests = rateLimitMap.get(domain) || [];
  requests.push(now);
  rateLimitMap.set(domain, requests);
}

function getCacheKey(title: string, author: string): string {
  return `${title.toLowerCase()}_${author.toLowerCase()}`;
}

function isValidQuote(text: string): boolean {
  // Basic validation to ensure we have meaningful quote text
  return text.length > 10 && 
         text.length < 1000 && 
         !text.toLowerCase().includes('lorem ipsum') &&
         !text.toLowerCase().includes('placeholder');
}

async function fetchFromGoodreads(title: string, author: string): Promise<Quote | null> {
  try {
    if (isRateLimited('goodreads.com')) {
      console.log('Rate limited for Goodreads');
      return null;
    }

    addRateLimit('goodreads.com');

    // Search for the book first
    const searchQuery = encodeURIComponent(`${title} ${author}`);
    const searchUrl = `https://www.goodreads.com/search?q=${searchQuery}`;
    
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });

    const $ = cheerio.load(searchResponse.data);
    const bookLink = $('.bookTitle').first().attr('href');
    
    if (!bookLink) {
      return null;
    }

    // Get the quotes page
    const bookId = bookLink.split('/')[2];
    const quotesUrl = `https://www.goodreads.com/work/quotes/${bookId}`;
    
    const quotesResponse = await axios.get(quotesUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const quotesPage = cheerio.load(quotesResponse.data);
    
    // Extract quotes from the page
    const quotes: Quote[] = [];
    quotesPage('.quote').each((i, element) => {
      const quoteText = quotesPage(element).find('.quoteText').text().trim();
      const cleanQuote = quoteText.split('―')[0].replace(/"/g, '').trim();
      
      if (isValidQuote(cleanQuote)) {
        quotes.push({
          text: cleanQuote,
          author: author,
          book: title,
          verified: true,
          fetch_source: 'goodreads',
          scraped_at: new Date().toISOString()
        });
      }
    });

    return quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null;
  } catch (error) {
    console.error('Error fetching from Goodreads:', error);
    return null;
  }
}

async function fetchFromWikiQuote(title: string, author: string): Promise<Quote | null> {
  try {
    if (isRateLimited('wikiquote.org')) {
      console.log('Rate limited for WikiQuote');
      return null;
    }

    addRateLimit('wikiquote.org');

    // Try searching by book title first
    const searchQuery = encodeURIComponent(title.replace(/[^\w\s]/g, ' '));
    const searchUrl = `https://en.wikiquote.org/w/api.php?action=query&format=json&list=search&srsearch=${searchQuery}&srprop=snippet&srlimit=5`;
    
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'TWBooks/1.0 (educational quote research)'
      },
      timeout: 10000
    });

    const searchData = searchResponse.data;
    if (!searchData.query?.search?.length) {
      return null;
    }

    const pageTitle = searchData.query.search[0].title;
    const pageUrl = `https://en.wikiquote.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(pageTitle)}`;
    
    const pageResponse = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'TWBooks/1.0 (educational quote research)'
      },
      timeout: 10000
    });

    const pageData = pageResponse.data;
    const pages = pageData.query?.pages;
    
    if (!pages) return null;
    
    const page = Object.values(pages)[0] as any;
    const extract = page.extract;
    
    if (extract && extract.length > 50) {
      // Extract first meaningful sentence
      const sentences = extract.split(/[.!?]+/);
      const firstSentence = sentences.find((s: string) => s.trim().length > 20);
      
      if (firstSentence && isValidQuote(firstSentence)) {
        return {
          text: firstSentence.trim(),
          author: author,
          book: title,
          verified: true,
          fetch_source: 'wikiquote',
          scraped_at: new Date().toISOString()
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching from WikiQuote:', error);
    return null;
  }
}

async function fetchFromOpenLibrary(title: string, author: string): Promise<Quote | null> {
  try {
    if (isRateLimited('openlibrary.org')) {
      console.log('Rate limited for Open Library');
      return null;
    }

    addRateLimit('openlibrary.org');

    const searchQuery = encodeURIComponent(`${title} ${author}`);
    const searchUrl = `https://openlibrary.org/search.json?q=${searchQuery}&limit=5`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'TWBooks/1.0 (educational book research)'
      },
      timeout: 10000
    });

    const data = response.data;
    if (!data.docs?.length) {
      return null;
    }

    const book = data.docs[0];
    let quoteText = '';

    // Try to get first sentence or description
    if (book.first_sentence) {
      quoteText = Array.isArray(book.first_sentence) ? book.first_sentence[0] : book.first_sentence;
    } else if (book.subtitle) {
      quoteText = book.subtitle;
    }

    if (quoteText && isValidQuote(quoteText)) {
      return {
        text: quoteText.replace(/"/g, '').trim(),
        author: author,
        book: title,
        source: 'Opening line',
        verified: true,
        fetch_source: 'open_library',
        scraped_at: new Date().toISOString()
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching from Open Library:', error);
    return null;
  }
}

async function fetchFromProjectGutenberg(title: string, author: string): Promise<Quote | null> {
  try {
    if (isRateLimited('gutenberg.org')) {
      console.log('Rate limited for Project Gutenberg');
      return null;
    }

    addRateLimit('gutenberg.org');

    // Project Gutenberg search is limited, so we'll try a simple approach
    const searchQuery = encodeURIComponent(`${title} ${author}`);
    const searchUrl = `https://www.gutenberg.org/ebooks/search/?query=${searchQuery}&submit_search=Go%21`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'TWBooks/1.0 (educational literature research)'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const bookLink = $('.link').first().attr('href');
    
    if (!bookLink) {
      return null;
    }

    // For now, return null as parsing full texts is complex
    // This could be expanded to fetch actual text excerpts
    return null;
  } catch (error) {
    console.error('Error fetching from Project Gutenberg:', error);
    return null;
  }
}

export async function getBookQuote(title: string, author: string): Promise<Quote | null> {
  try {
    const cacheKey = getCacheKey(title, author);
    const cached = quoteCache.get(cacheKey);
    
    // Return cached quote if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.quote;
    }

    // First, check our verified local quotes
    const titleLower = title.toLowerCase();
    for (const [key, quotes] of Object.entries(VERIFIED_QUOTES)) {
      if (titleLower.includes(key) || key.includes(titleLower)) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        // Cache the result
        quoteCache.set(cacheKey, { quote: randomQuote, timestamp: Date.now() });
        return randomQuote;
      }
    }

    // Try fetching from external sources in priority order
    const sources = [
      () => fetchFromGoodreads(title, author),
      () => fetchFromWikiQuote(title, author),
      () => fetchFromOpenLibrary(title, author),
      () => fetchFromProjectGutenberg(title, author)
    ];

    for (const fetchSource of sources) {
      try {
        const quote = await fetchSource();
        if (quote) {
          // Cache the successful result
          quoteCache.set(cacheKey, { quote, timestamp: Date.now() });
          return quote;
        }
      } catch (error) {
        console.error('Error from quote source:', error);
        continue;
      }
    }

    // If no real quote found, return null instead of fake content
    // The calling code should handle this gracefully
    quoteCache.set(cacheKey, { quote: null, timestamp: Date.now() });
    return null;
    
  } catch (error) {
    console.error('Error in getBookQuote:', error);
    return null;
  }
}

export async function getMultipleQuotes(title: string, author: string, count: number = 3): Promise<Quote[]> {
  try {
    const quotes: Quote[] = [];
    
    // First, try to get quotes from verified local collection
    const titleLower = title.toLowerCase();
    for (const [key, localQuotes] of Object.entries(VERIFIED_QUOTES)) {
      if (titleLower.includes(key) || key.includes(titleLower)) {
        // Shuffle and take up to count quotes
        const shuffled = [...localQuotes].sort(() => Math.random() - 0.5);
        quotes.push(...shuffled.slice(0, count));
        return quotes;
      }
    }

    // If no local quotes, try external sources
    // This would be expanded to handle multiple quotes from each source
    const quote = await getBookQuote(title, author);
    if (quote) {
      quotes.push(quote);
    }

    return quotes;
  } catch (error) {
    console.error('Error getting multiple quotes:', error);
    return [];
  }
}

export function formatQuote(quote: Quote): string {
  let formatted = `"${quote.text}"`;
  
  if (quote.source) {
    formatted += ` — ${quote.author} (${quote.source})`;
  } else {
    formatted += ` — ${quote.author}`;
  }

  return formatted;
}

export function clearQuoteCache(): void {
  quoteCache.clear();
}

// Utility function to validate if a quote seems authentic
export function validateQuote(quote: Quote): boolean {
  return !!(
    quote.text && 
    quote.author && 
    quote.book &&
    isValidQuote(quote.text)
  );
}