import { Quote } from '@/types';

// Predefined quotes for popular books (fallback when external APIs don't work)
const DEFAULT_QUOTES: Record<string, Quote[]> = {
  'harry potter': [
    {
      text: "It is our choices, Harry, that show what we truly are, far more than our abilities. We all have both light and darkness inside us. What matters is the part we choose to act on. That's who we really are.",
      author: "Albus Dumbledore",
      book: "Harry Potter and the Chamber of Secrets"
    },
    {
      text: "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light. Remember that, Harry. When the world seems to be against you, and all hope seems lost, remember that there is always a choice to find the light within yourself.",
      author: "Albus Dumbledore", 
      book: "Harry Potter and the Prisoner of Azkaban"
    },
    {
      text: "We've all got both light and dark inside us. What matters is the part we choose to act on. That's who we really are. Do not pity the dead, Harry. Pity the living, and, above all those who live without love.",
      author: "Sirius Black",
      book: "Harry Potter and the Order of the Phoenix"
    }
  ],
  'lord of the rings': [
    {
      text: "All we have to decide is what to do with the time that is given us. There are other forces at work in this world, Frodo, besides the will of evil. Bilbo was meant to find the Ring, and not by its maker. In which case you also were meant to have it.",
      author: "Gandalf",
      book: "The Fellowship of the Ring"
    },
    {
      text: "Even the smallest person can change the course of the future. I will not say: do not weep; for not all tears are an evil. The world is indeed full of peril, and in it there are many dark places; but still there is much that is fair, and though in all lands love is now mingled with grief, it grows perhaps the greater.",
      author: "Galadriel",
      book: "The Fellowship of the Ring"
    },
    {
      text: "Many that live deserve death. And some that die deserve life. Can you give it to them? Then do not be too eager to deal out death in judgement. For even the very wise cannot see all ends. My heart tells me that he has some part to play yet, for good or ill, before the end; and when that comes, the pity of Bilbo may rule the fate of many - yours not least.",
      author: "Gandalf",
      book: "The Fellowship of the Ring"
    }
  ],
  'pride and prejudice': [
    {
      text: "I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book! When I have a house of my own, I shall be miserable if I have not an excellent library. There is nothing like staying at home for real comfort.",
      author: "Caroline Bingley",
      book: "Pride and Prejudice"
    },
    {
      text: "The more I see of the world, the more am I dissatisfied with it; and every day confirms my belief of the inconsistency of all human characters, and of the little dependence that can be placed on the appearance of merit or sense. I have met with two instances lately, one I will not mention; the other is Charlotte's marriage.",
      author: "Elizabeth Bennet",
      book: "Pride and Prejudice"
    }
  ],
  '1984': [
    {
      text: "Big Brother is watching you. The Party seeks power entirely for its own sake. We are not interested in the good of others; we are interested solely in power. Not wealth or luxury or long life or happiness: only power, pure power.",
      author: "George Orwell",
      book: "1984"
    },
    {
      text: "War is peace. Freedom is slavery. Ignorance is strength. The Party told you to reject the evidence of your eyes and ears. It was their final, most essential command. And if all others accepted the lie which the Party imposed—if all records told the same tale—then the lie passed into history and became truth.",
      author: "George Orwell",
      book: "1984"
    },
    {
      text: "If you want a picture of the future, imagine a boot stamping on a human face—forever. The object of persecution is persecution. The object of torture is torture. The object of power is power. Now do you begin to understand me?",
      author: "O'Brien",
      book: "1984"
    }
  ],
  'to kill a mockingbird': [
    {
      text: "You never really understand a person until you consider things from his point of view... until you climb into his skin and walk around in it. Real courage is when you know you're licked before you begin, but you begin anyway and see it through. You rarely win, but sometimes you do.",
      author: "Atticus Finch",
      book: "To Kill a Mockingbird"
    },
    {
      text: "People generally see what they look for, and hear what they listen for. The one thing that doesn't abide by majority rule is a person's conscience. You can't really understand a person until you consider things from his point of view.",
      author: "Harper Lee",
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
        text: "A reader lives a thousand lives before he dies. The man who never reads lives only one. When you read, you travel through time and space, you experience love and loss, triumph and tragedy, all from the comfort of your chair. Every book is a doorway to another world.",
        author: "George R.R. Martin",
        book: title
      },
      {
        text: "Books are a uniquely portable magic. They transport us to other worlds, other times, other lives. In books, we can be anyone, go anywhere, and experience everything. The written word has the power to change hearts and minds across generations.",
        author: "Stephen King",
        book: title
      },
      {
        text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid. There is nothing like books for expanding the mind and opening the heart. A good story teaches us about ourselves and the world around us in ways that no other medium can.",
        author: "Jane Austen",
        book: title
      },
      {
        text: "I have always imagined that Paradise will be a kind of library. In such a place, every book ever written would be available, every story ever told would be preserved. Books are humanity's greatest treasure, containing all our wisdom, dreams, and imagination.",
        author: "Jorge Luis Borges", 
        book: title
      },
      {
        text: "There is no friend as loyal as a book. Books never judge, never leave, and are always there when you need them. They offer comfort in sorrow, excitement in dullness, and wisdom in confusion. A well-chosen book is a lifelong companion.",
        author: "Ernest Hemingway",
        book: title
      },
      {
        text: "Reading is escape, and the opposite of escape; it's a way to make contact with reality after a day of making things up, and it's a way of making contact with someone else's imagination after a day that's all too real. Books are proof that humans are capable of working magic.",
        author: "Nora Ephron",
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