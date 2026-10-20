import { Readable } from 'node:stream';
import path from 'node:path';
import express from 'express';
import { getStats, renderMarkdown, extractTitle } from './markdown.js';
import { isTheme, PUBLIC_DIR, ROOT_DIR } from './themes.js';
import { parsePageOptions } from './options.js';
import { closeBrowser, renderImage, renderPdf } from './renderer.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MAX_MARKDOWN_LENGTH = 250_000;

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: http:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  );
  next();
});

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  error.expose = true;
  return error;
}

function readMarkdown(body, { allowEmpty = false } = {}) {
  const markdown = body?.markdown;

  if (typeof markdown !== 'string') {
    throw httpError(400, 'Request body must include a Markdown string.');
  }

  if (markdown.length > MAX_MARKDOWN_LENGTH) {
    throw httpError(
      413,
      `Markdown is too large. The limit is ${MAX_MARKDOWN_LENGTH.toLocaleString()} characters.`,
    );
  }

  if (!allowEmpty && !markdown.trim()) {
    throw httpError(400, 'Add some Markdown before exporting.');
  }

  return markdown;
}

function readTheme(body) {
  const theme = body?.theme ?? 'modern-light';

  if (!isTheme(theme)) {
    throw httpError(400, 'Unknown theme.');
  }

  return theme;
}

function contentDisposition(filename) {
  const fallback = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

function sendPdf(res, result) {
  res.status(200);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', contentDisposition(result.filename));
  res.setHeader('Content-Length', result.buffer.length);
  res.setHeader('Cache-Control', 'no-store');
  Readable.from(result.buffer).pipe(res);
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/preview', (req, res) => {
  const markdown = readMarkdown(req.body, { allowEmpty: true });
  const html = markdown.trim() ? renderMarkdown(markdown) : '';

  res.json({
    html,
    title: extractTitle(markdown),
    stats: getStats(markdown),
  });
});

app.post('/api/convert/pdf', async (req, res) => {
  const markdown = readMarkdown(req.body);
  const theme = readTheme(req.body);
  const options = parsePageOptions(req.body?.page);

  const result = await renderPdf({ markdown, theme, options });
  sendPdf(res, result);
});

app.post('/api/convert/image', async (req, res) => {
  const markdown = readMarkdown(req.body);
  const theme = readTheme(req.body);
  const options = parsePageOptions(req.body?.page);

  const result = await renderImage({ markdown, theme, options });

  res.status(200);
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', contentDisposition(result.filename));
  res.setHeader('Content-Length', result.buffer.length);
  res.setHeader('Cache-Control', 'no-store');
  res.end(result.buffer);
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.use(
  express.static(PUBLIC_DIR, {
    extensions: ['html'],
    maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
  }),
);

app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT_DIR, 'public', '404.html'));
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let status = Number(error.status) || 500;
  let message = error.expose ? error.message : 'Something went wrong.';

  if (error.type === 'entity.too.large') {
    status = 413;
    message = 'That document is too large to process.';
  }

  if (
    status === 500 &&
    /could not find chrome|could not find browser|failed to launch|browser was not found/i.test(
      error.message || '',
    )
  ) {
    message =
      "PDF rendering is unavailable because Chromium could not be started. Run 'npx puppeteer browsers install chrome' or set PUPPETEER_EXECUTABLE_PATH.";
  }

  console.error(error);

  res.status(status).json({ error: message });
});

const server = app.listen(PORT, () => {
  console.log(`Margin is running at http://localhost:${PORT}`);
});

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  server.close();
  await closeBrowser();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
