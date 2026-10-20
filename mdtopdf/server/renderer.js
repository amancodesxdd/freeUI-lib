import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer';
import { buildDocument } from './document.js';
import { escapeHtml } from './markdown.js';
import { THEMES } from './themes.js';

const SYSTEM_BROWSERS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const FORMAT_NAMES = {
  a4: 'A4',
  letter: 'Letter',
  legal: 'Legal',
  a5: 'A5',
};

let browserPromise = null;

async function resolveExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  try {
    const bundled = await puppeteer.executablePath();
    if (bundled && existsSync(bundled)) return undefined;
  } catch {
    // Puppeteer may not have a downloaded browser yet.
  }

  return SYSTEM_BROWSERS.find((candidate) => existsSync(candidate));
}

async function launchBrowser() {
  const executablePath = await resolveExecutablePath();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    protocolTimeout: 120_000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--hide-scrollbars',
      '--font-render-hinting=none',
      '--force-color-profile=srgb',
    ],
  });

  browser.on('disconnected', () => {
    browserPromise = null;
  });

  return browser;
}

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = launchBrowser().catch((error) => {
      browserPromise = null;
      throw error;
    });
  }
  return browserPromise;
}

async function preparePage(html, viewport) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  page.setDefaultTimeout(60_000);

  if (viewport) {
    await page.setViewport(viewport);
  }

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    const type = request.resourceType();
    const allowed =
      url === 'about:blank' ||
      url.startsWith('data:') ||
      (['image', 'font', 'stylesheet'].includes(type) && /^https?:/i.test(url));

    if (allowed) {
      request.continue().catch(() => {});
    } else {
      request.abort('blockedbyclient').catch(() => {});
    }
  });

  await page.setContent(html, { waitUntil: 'load', timeout: 30_000 });

  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      if (document.fonts?.ready) {
        await Promise.race([document.fonts.ready, wait(4_000)]);
      }
    } catch {
      // Font loading is best-effort.
    }

    const images = Array.from(document.images).map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    });

    await Promise.race([Promise.all(images), wait(8_000)]);
  });

  return page;
}

function footerTemplate(theme, title) {
  const color = THEMES[theme].footer;
  return `<div style="width:100%;padding:0 14mm;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:8px;color:${color};display:flex;align-items:center;justify-content:space-between;">
    <span style="max-width:72%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(title)}</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`;
}

function filenameFor(title, extension) {
  const base =
    title
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'document';

  return `${base}.${extension}`;
}

export async function renderPdf({ markdown, theme, options }) {
  const { document, title, metrics } = await buildDocument({
    markdown,
    theme,
    options,
    mode: 'pdf',
  });

  const page = await preparePage(document);

  try {
    await page.emulateMediaType('print');

    const pdf = await page.pdf({
      format: FORMAT_NAMES[options.size],
      landscape: options.orientation === 'landscape',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: `${metrics.marginMm}mm`,
        right: `${metrics.marginMm}mm`,
        bottom: `${metrics.marginMm}mm`,
        left: `${metrics.marginMm}mm`,
      },
      displayHeaderFooter: options.pageNumbers,
      headerTemplate: '<span></span>',
      footerTemplate: options.pageNumbers
        ? footerTemplate(theme, title)
        : '<span></span>',
      timeout: 60_000,
    });

    return {
      buffer: Buffer.from(pdf),
      title,
      filename: filenameFor(title, 'pdf'),
    };
  } finally {
    await page.close().catch(() => {});
  }
}

export async function renderImage({ markdown, theme, options }) {
  const { document, title, metrics } = await buildDocument({
    markdown,
    theme,
    options,
    mode: 'image',
  });

  const page = await preparePage(document, {
    width: metrics.widthPx,
    height: metrics.heightPx,
    deviceScaleFactor: 2,
  });

  try {
    await page.emulateMediaType('screen');

    const png = await page.screenshot({
      type: 'png',
      fullPage: true,
      captureBeyondViewport: true,
    });

    return {
      buffer: Buffer.from(png),
      title,
      filename: filenameFor(title, 'png'),
    };
  } finally {
    await page.close().catch(() => {});
  }
}

export async function closeBrowser() {
  if (!browserPromise) return;

  const current = browserPromise;
  browserPromise = null;

  try {
    const browser = await current;
    await browser.close();
  } catch {
    // The browser may already be closed.
  }
}
