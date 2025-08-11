import { Quote } from '@/types';

// Predefined quotes for popular books (fallback when external APIs don't work)
const DEFAULT_QUOTES: Record<string, Quote[]> = {
  'harry potter': [
    {
      text: "It is our choices, Harry, that show what we truly are, far more than our abilities.",
      author: "Albus Dumbledore",
      book: "Harry Potter and the Chamber of Secrets"
    },
    {
      text: "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.",
      author: "Albus Dumbledore", 
      book: "Harry Potter and the Prisoner of Azkaban"
    }
  ],
  'lord of the rings': [
    {
      text: "All we have to decide is what to do with the time that is given us.",
      author: "Gandalf",
      book: "The Fellowship of the Ring"
    },
    {
      text: "Even the smallest person can change the course of the future.",
      author: "Galadriel",
      book: "The Fellowship of the Ring"
    }
  ],
  'pride and prejudice': [
    {
      text: "I declare after all there is no enjoyment like reading!",
      author: "Caroline Bingley",
      book: "Pride and Prejudice"
    }
  ],
  '1984': [
    {
      text: "Big Brother is watching you.",
      author: "George Orwell",
      book: "1984"
    },
    {
      text: "War is peace. Freedom is slavery. Ignorance is strength.",
      author: "George Orwell",
      book: "1984"
    }
  ],
  'to kill a mockingbird': [
    {
      text: "You never really understand a person until you consider things from his point of view.",
      author: "Atticus Finch",
      book: "To Kill a Mockingbird"
    }
  ]
};

export async function getBookQuote(title: string, author: string): Promise<Quote | null> {
  try {
    // First, check our default quotes
    const titleLower = title.toLowerCase();
    for (const [key, quotes] of Object.entries(DEFAULT_QUOTES)) {
      if (titleLower.includes(key)) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return randomQuote;
      }
    }

    // For now, return a generic inspirational quote if no specific quote found
    const genericQuotes = [
      {
        text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
        author: "George R.R. Martin",
        book: title
      },
      {
        text: "Books are a uniquely portable magic.",
        author: "Stephen King",
        book: title
      },
      {
        text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
        author: "Jane Austen",
        book: title
      },
      {
        text: "I have always imagined that Paradise will be a kind of library.",
        author: "Jorge Luis Borges", 
        book: title
      },
      {
        text: "There is no friend as loyal as a book.",
        author: "Ernest Hemingway",
        book: title
      }
    ];

    const randomGeneric = genericQuotes[Math.floor(Math.random() * genericQuotes.length)];
    return {
      ...randomGeneric,
      author: `${author} • ${randomGeneric.author}`
    };
    
  } catch (error) {
    console.error('Error fetching quote:', error);
    return {
      text: "Every book is a new adventure waiting to be discovered.",
      author: author,
      book: title
    };
  }
}

export function formatQuote(quote: Quote): string {
  return `"${quote.text}" — ${quote.author}`;
}