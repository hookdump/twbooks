const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewport({ width: 1440, height: 900 });
  
  // Navigate to the app
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });
  
  // Wait for the page to load
  await new Promise(r => setTimeout(r, 2000));
  
  // Take screenshot
  await page.screenshot({ path: 'homepage.png', fullPage: true });
  console.log('Screenshot saved as homepage.png');
  
  // Navigate to search page
  await page.goto('http://localhost:3002/search', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'search.png', fullPage: true });
  console.log('Screenshot saved as search.png');
  
  // Navigate to profile page
  await page.goto('http://localhost:3002/profile', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'profile.png', fullPage: true });
  console.log('Screenshot saved as profile.png');
  
  await browser.close();
})();