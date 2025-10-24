import puppeteer from 'puppeteer';

interface ScrapedData {
  company: string | null;
  position: string | null;
  experience: string | null;
  keywords: string[];
  deadline: string | null;
}

export async function scrapeJobPosting(url: string): Promise<ScrapedData> {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set user agent to avoid blocking
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract data based on common job posting sites
    const scrapedData = await page.evaluate(() => {
      // Helper function to get text content
      const getText = (selector: string): string | null => {
        const element = document.querySelector(selector);
        return element?.textContent?.trim() || null;
      };

      // Helper function to get all text content
      const getAllText = (selector: string): string[] => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements)
          .map((el) => el.textContent?.trim())
          .filter((text): text is string => !!text);
      };

      let company: string | null = null;
      let position: string | null = null;
      let experience: string | null = null;
      let keywords: string[] = [];
      let deadline: string | null = null;

      // Try common selectors for job posting sites
      // These are generic selectors that might work across multiple sites

      // Company name
      company =
        getText('[class*="company"]') ||
        getText('[class*="Company"]') ||
        getText('[class*="employer"]') ||
        getText('meta[property="og:site_name"]') ||
        null;

      // Position/Job title
      position =
        getText('h1') ||
        getText('[class*="title"]') ||
        getText('[class*="job-title"]') ||
        getText('[class*="position"]') ||
        getText('meta[property="og:title"]') ||
        null;

      // Experience level
      const experienceText =
        getText('[class*="experience"]') ||
        getText('[class*="career"]') ||
        null;

      if (experienceText) {
        if (
          experienceText.includes('신입') ||
          experienceText.includes('New')
        ) {
          experience = 'new';
        } else if (
          experienceText.includes('경력') ||
          experienceText.includes('Experienced')
        ) {
          experience = 'experienced';
        } else if (
          experienceText.includes('무관') ||
          experienceText.includes('Any')
        ) {
          experience = 'any';
        }
      }

      // Keywords/Skills (look for tags or skill lists)
      keywords = getAllText('[class*="skill"]')
        .concat(getAllText('[class*="tag"]'))
        .concat(getAllText('[class*="keyword"]'))
        .slice(0, 10); // Limit to 10 keywords

      // Deadline
      const deadlineText =
        getText('[class*="deadline"]') ||
        getText('[class*="due"]') ||
        getText('[class*="closing"]') ||
        null;

      if (deadlineText) {
        // Try to extract date in various formats
        const dateMatch = deadlineText.match(
          /\d{4}[-./]\d{1,2}[-./]\d{1,2}/
        );
        if (dateMatch) {
          deadline = dateMatch[0].replace(/[./]/g, '-');
        }
      }

      return { company, position, experience, keywords, deadline };
    });

    return scrapedData;
  } catch (error) {
    console.error('Scraping error:', error);
    // Return empty data if scraping fails
    return {
      company: null,
      position: null,
      experience: null,
      keywords: [],
      deadline: null,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
