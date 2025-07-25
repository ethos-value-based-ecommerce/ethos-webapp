const puppeteer = require("puppeteer");

// Helper functions to extract mission, description, and categories

// Extracts a mission statement from page text based on keywords or patterns
function extractMission(content) {
  // Regex to capture short mission-like sentences
  const shortMissionRegex = /(?:we are|our mission|we aim to|we believe) ([^.]{20,200})/i;
  const shortMatch = content.match(shortMissionRegex);

  const missionKeywords = [
    "mission", "purpose", "vision", "values", "philosophy",
    "commitment", "promise", "goal", "aim", "believe"
  ];

  // Split page text into paragraphs for easier scanning
  const paragraphs = content.split("\n").filter(p => p.trim());

  // Priority 1: Look for a paragraph explicitly mentioning "mission"
  for (let paragraph of paragraphs) {
    if (paragraph.toLowerCase().includes("mission") && paragraph.length > 30 && paragraph.length < 500) {
      return paragraph.trim();
    }
  }

  // Priority 2: Look for other mission-related keywords
  for (let keyword of missionKeywords) {
    const match = paragraphs.find(
      p => p.toLowerCase().includes(keyword) && p.length > 30 && p.length < 500
    );
    if (match) return match.trim();
  }

  // Priority 3: Fallback to regex match if no paragraph matches
  if (shortMatch && shortMatch[0]) {
    return shortMatch[0].trim();
  }

  return "";
}

// Extracts a brand description or founder story from page text
function extractDescription(content) {
  const aboutKeywords = [
    "about", "story", "history", "journey", "founded", "founder",
    "began", "started", "established", "who we are", "growing up"
  ];

  const paragraphs = content.split("\n").filter(p => p.trim());

  // Priority 1: Return sustainability information if found
  const sustainabilityMatch = paragraphs.find(
    p => p.toLowerCase().includes("sustainability") && p.length > 50
  );
  if (sustainabilityMatch) return sustainabilityMatch.trim();

  // Priority 2: Return a founder story if present
  const founderMatch = paragraphs.find(
    p => (p.toLowerCase().includes("founder") || p.toLowerCase().includes("growing up")) && p.length > 100
  );
  if (founderMatch) return founderMatch.trim();

  // Priority 3: General "about" information
  for (let keyword of aboutKeywords) {
    const match = paragraphs.find(
      p => p.toLowerCase().includes(keyword) && p.length > 50 && p.length < 1000
    );
    if (match) return match.trim();
  }

  // Priority 4: Fallback to any substantial paragraph
  return paragraphs.find(p => p.length > 100 && p.length < 1000) || "";
}

// Classifies the brand into categories based on keyword matching
function classify(content) {
  const categories = {
    "beauty": ["beauty", "cosmetics", "makeup", "skincare", "hair", "nails"],
    "sustainable": ["sustainable", "eco-friendly", "environment", "green", "recycled"],
    "personal care": ["personal care", "self-care", "hygiene", "body care", "lotion", "soap"],
    "latin-owned": ["latin", "latino", "latina", "latinx", "hispanic", "spanish"],
    "clean ingredients": ["clean", "non-toxic", "natural ingredients", "organic ingredients"],
    "eco-conscious": ["eco-conscious", "carbon neutral", "zero waste", "biodegradable"],
    "socially-responsible": ["socially responsible", "community impact", "social impact"],
    "women-founded": ["women-founded", "woman-founded", "female founder", "woman founder", "women founder"]
  };

  const lower = content.toLowerCase();
  const matched = new Set();

  // Direct keyword matches
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      matched.add(category);
    }
  }

  // Infer women-founded if pronouns or "woman founder" context are present
  if ((lower.includes("she") && lower.includes("her")) ||
      (lower.includes("founder") && lower.includes("woman"))) {
    matched.add("women-founded");
  }

  // Add eco-conscious if sustainable is detected
  if (matched.has("sustainable") && !matched.has("eco-conscious")) {
    matched.add("eco-conscious");
  }

  // Add socially-responsible if community or donation mentions are present
  if ((lower.includes("community") && lower.includes("impact")) ||
      lower.includes("donates") ||
      lower.includes("supports communities")) {
    matched.add("socially-responsible");
  }

  return Array.from(matched);
}


// Main function: scrapeBrand which scrapes the web pages using the helper functions above.

async function scrapeBrand(url) {
  // Ensure URL is properly formatted
  if (!url.startsWith("http")) url = "https://" + url;
  let browser = null;

  // Launch Puppeteer browser
  try {
    console.log("Launching Puppeteer browser...");
    browser = await puppeteer.launch({
      headless: "new", // Runs in headless mode for faster performance
      args: [
        '--no-sandbox',                // Disables sandboxing (required for some server environments)
        '--disable-setuid-sandbox',    // Further disables sandbox
        '--disable-dev-shm-usage',     // Avoids using shared memory for better stability
        '--disable-accelerated-2d-canvas', // Disables hardware acceleration
        '--disable-gpu',               // Disables GPU for compatibility
        '--window-size=1920x1080'      // Sets viewport to desktop resolution
      ],
      ignoreHTTPSErrors: true // Ignores SSL errors on misconfigured sites
    });
    console.log("Puppeteer browser launched successfully");
  } catch (browserError) {
    console.error("Error launching Puppeteer browser:", browserError);
    return {
      url,
      aboutPageUrl: url,
      mission: "",
      description: `Unable to scrape website content. Error: ${browserError.message}`,
      categories: []
    };
  }

  let page;
  try {
    // Open a new page in the browser
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000); // Allow up to 2 minutes for slow websites

    // Intercept and block unnecessary resources (images, fonts, etc.)
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (["image", "font", "media"].includes(resourceType)) {
        request.abort(); // Speeds up scraping by skipping these resources
      } else {
        request.continue();
      }
    });
  } catch (pageError) {
    console.error("Error creating new page:", pageError);
    if (browser) await browser.close();
    return {
      url,
      aboutPageUrl: url,
      mission: "",
      description: `Unable to create browser page. Error: ${pageError.message}`,
      categories: []
    };
  }

  let aboutPageUrl = url;

  try {
    // Navigate to the main page
    console.log(`Navigating to main page: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    // Look for an About or Mission page link
    aboutPageUrl = await page.$$eval("a", links => {
      const match = links.find(link =>
        /(about|our story|mission)/i.test(link.innerText) ||
        /(about|our-story|mission)/i.test(link.href)
      );
      return match ? match.href : null;
    }) || url;

    console.log(`Found about page URL: ${aboutPageUrl}`);

    // Navigate to the About page (or stay on main page if not found)
    await page.goto(aboutPageUrl, { waitUntil: "domcontentloaded", timeout: 90000 });

    // Extract meaningful textual content from the page
    const content = await page.evaluate(() => {
      // Remove non-essential elements for cleaner text extraction
      document.querySelectorAll("script, style, noscript, svg, nav, footer")
        .forEach(el => el.remove());

      let mainContent = document.body.innerText;

      // Look for a dedicated About or Mission section
      const aboutSection = Array.from(document.querySelectorAll('section, div, article'))
        .find(el => {
          const text = el.innerText.toLowerCase();
          return (text.includes('about') || text.includes('mission') ||
                  text.includes('founder') || text.includes('story')) &&
                 el.innerText.length > 200;
        });

      if (aboutSection) {
        mainContent = aboutSection.innerText + "\n\n" + mainContent;
      }

      // Look for a founder story and include if different from About section
      const founderSection = Array.from(document.querySelectorAll('section, div, article'))
        .find(el => {
          const text = el.innerText.toLowerCase();
          return (text.includes('founder') || text.includes('babba')) &&
                 el.innerText.length > 100;
        });

      if (founderSection && founderSection !== aboutSection) {
        mainContent = founderSection.innerText + "\n\n" + mainContent;
      }

      return mainContent;
    });

    // Use helper functions to extract mission, description, and categories
    const mission = extractMission(content);
    const description = extractDescription(content);
    const matchedCategories = classify(content);

    return {
      url,
      aboutPageUrl,
      mission,
      description,
      categories: matchedCategories
    };
  } catch (err) {
    console.error("Scrape error:", err);
    return {
      url,
      mission: "",
      description: "",
      categories: []
    };
  } finally {
    // Always close the browser to free memory
    await browser.close();
  }
}

module.exports = scrapeBrand;
