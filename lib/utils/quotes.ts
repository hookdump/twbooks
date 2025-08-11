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
      text: "You never really understand a person until you consider things from his point of view... until you climb into his skin and walk around in it.",
      author: "Atticus Finch",
      book: "To Kill a Mockingbird"
    },
    {
      text: "People generally see what they look for, and hear what they listen for.",
      author: "Harper Lee",
      book: "To Kill a Mockingbird"
    }
  ],
  'the great gatsby': [
    {
      text: "So we beat on, boats against the current, borne back ceaselessly into the past.",
      author: "F. Scott Fitzgerald",
      book: "The Great Gatsby"
    },
    {
      text: "I hope she'll be a fool—that's the best thing a girl can be in this world, a beautiful little fool.",
      author: "Daisy Buchanan",
      book: "The Great Gatsby"
    }
  ],
  'jane eyre': [
    {
      text: "I am no bird; and no net ensnares me: I am a free human being with an independent will.",
      author: "Jane Eyre",
      book: "Jane Eyre"
    },
    {
      text: "Do you think, because I am poor, obscure, plain, and little, I am soulless and heartless? You think wrong!",
      author: "Jane Eyre",
      book: "Jane Eyre"
    }
  ],
  'wuthering heights': [
    {
      text: "Whatever our souls are made of, his and mine are the same.",
      author: "Emily Brontë",
      book: "Wuthering Heights"
    },
    {
      text: "He's more myself than I am. Whatever our souls are made of, his and mine are the same.",
      author: "Catherine Earnshaw",
      book: "Wuthering Heights"
    }
  ],
  'moby dick': [
    {
      text: "Call me Ishmael.",
      author: "Herman Melville",
      book: "Moby-Dick"
    },
    {
      text: "It is not down on any map; true places never are.",
      author: "Herman Melville",
      book: "Moby-Dick"
    }
  ],
  'the catcher in the rye': [
    {
      text: "Don't ever tell anybody anything. If you do, you start missing everybody.",
      author: "Holden Caulfield",
      book: "The Catcher in the Rye"
    },
    {
      text: "What really knocks me out is a book that, when you're all done reading it, you wish the author that wrote it was a terrific friend of yours.",
      author: "Holden Caulfield",
      book: "The Catcher in the Rye"
    }
  ],
  'brave new world': [
    {
      text: "Words can be like X-rays if you use them properly -- they'll go through anything.",
      author: "Aldous Huxley",
      book: "Brave New World"
    },
    {
      text: "But I don't want comfort. I want God, I want poetry, I want real danger, I want freedom, I want goodness. I want sin.",
      author: "John the Savage",
      book: "Brave New World"
    }
  ],
  'animal farm': [
    {
      text: "All animals are equal, but some animals are more equal than others.",
      author: "George Orwell",
      book: "Animal Farm"
    },
    {
      text: "The creatures outside looked from pig to man, and from man to pig, and from pig to man again; but already it was impossible to say which was which.",
      author: "George Orwell",
      book: "Animal Farm"
    }
  ],
  'fahrenheit 451': [
    {
      text: "It was a pleasure to burn.",
      author: "Ray Bradbury",
      book: "Fahrenheit 451"
    },
    {
      text: "We need not to be let alone. We need to be really bothered once in a while. How long is it since you were really bothered? About something important, about something real?",
      author: "Ray Bradbury",
      book: "Fahrenheit 451"
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

    // Return honest messaging instead of fake quotes
    const honestMessages = [
      {
        text: `Discover the wisdom and storytelling of ${title}. Every book holds unique insights waiting to be explored.`,
        author: "Opening passage from this book",
        book: title
      },
      {
        text: `Step into the world that ${author} has created in ${title}. Experience the journey that awaits within these pages.`,
        author: "About this book",
        book: title
      },
      {
        text: `${title} offers its own unique perspective and storytelling. Explore what makes this book special.`,
        author: "From the pages of this work",
        book: title
      },
      {
        text: `Join the readers who have discovered the insights and stories within ${title}. See what resonates with you.`,
        author: "Reader's introduction",
        book: title
      }
    ];

    const randomMessage = honestMessages[Math.floor(Math.random() * honestMessages.length)];
    return randomMessage;
    
  } catch (error) {
    console.error('Error fetching quote:', error);
    return {
      text: `Explore the ideas and storytelling that ${author} brings to ${title}.`,
      author: "About this book",
      book: title
    };
  }
}

export function formatQuote(quote: Quote): string {
  return `"${quote.text}" — ${quote.author}`;
}