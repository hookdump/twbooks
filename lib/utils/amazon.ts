// Function to search and extract ASIN from Amazon search results
async function searchForASIN(title: string, author: string, isKindle = false): Promise<string | null> {
  try {
    // This would typically require scraping or using Amazon's API
    // For now, we'll return null to fall back to search links
    // In a real implementation, you'd search for the book and extract the ASIN
    return null;
  } catch (error) {
    console.error('Error searching for ASIN:', error);
    return null;
  }
}

export function generateAmazonLink(title: string, author: string, isbn?: string, asin?: string): string {
  // Use ASIN if available (alphanumeric like B0C3WMJFWB)
  if (asin && /^[A-Z0-9]{10}$/.test(asin)) {
    return `https://www.amazon.com/dp/${asin}?tag=twbooks-20`;
  }
  
  // Use ISBN if available, otherwise search by title and author
  if (isbn) {
    return `https://www.amazon.com/dp/${isbn.replace(/-/g, '')}?tag=twbooks-20`;
  }
  
  // Create a search query for Amazon
  const query = encodeURIComponent(`${title} ${author}`);
  return `https://www.amazon.com/s?k=${query}&i=stripbooks&tag=twbooks-20`;
}

export function generateKindleLink(title: string, author: string, asin?: string): string {
  // If we have a Kindle ASIN, use the Kindle reader URL
  if (asin && /^[A-Z0-9]{10}$/.test(asin)) {
    return `https://read.amazon.com/?asin=${asin}`;
  }
  
  // Search specifically for Kindle edition using digital-text category
  const query = encodeURIComponent(`${title} ${author}`);
  return `https://www.amazon.com/s?k=${query}&i=digital-text`;
}

export function generateGoodreadsLink(title: string, author: string): string {
  const query = encodeURIComponent(`${title} ${author}`);
  return `https://www.goodreads.com/search?q=${query}`;
}