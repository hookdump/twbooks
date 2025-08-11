export function generateAmazonLink(title: string, author: string, isbn?: string): string {
  // Use ISBN if available, otherwise search by title and author
  if (isbn) {
    return `https://www.amazon.com/dp/${isbn.replace(/-/g, '')}?tag=twbooks-20`;
  }
  
  // Create a search query for Amazon
  const query = encodeURIComponent(`${title} ${author}`);
  return `https://www.amazon.com/s?k=${query}&i=stripbooks&tag=twbooks-20`;
}

export function generateKindleLink(title: string, author: string): string {
  const query = encodeURIComponent(`${title} ${author} kindle`);
  return `https://www.amazon.com/s?k=${query}&i=digital-text&tag=twbooks-20`;
}

export function generateGoodreadsLink(title: string, author: string): string {
  const query = encodeURIComponent(`${title} ${author}`);
  return `https://www.goodreads.com/search?q=${query}`;
}