import type { Browser } from "puppeteer";

let browserPromise: Promise<Browser> | null = null;

/**
 * Lazy singleton Puppeteer browser — prefer reusing across jobs in one worker process.
 */
export async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = (async () => {
      const puppeteer = await import("puppeteer");
      return puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });
    })();
  }
  return browserPromise;
}

export async function closeBrowser(): Promise<void> {
  if (browserPromise) {
    const b = await browserPromise.catch(() => null);
    browserPromise = null;
    if (b) {
      await b.close();
    }
  }
}

export async function fetchRenderedHtml(url: string, timeoutMs = 45_000): Promise<string> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    page.setDefaultTimeout(timeoutMs);
    await page.goto(url, { waitUntil: "networkidle2" });
    return await page.content();
  } finally {
    await page.close();
  }
}
