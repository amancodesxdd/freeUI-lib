import { escapeHtml, renderMarkdown, extractTitle } from './markdown.js';
import { getPageMetrics } from './options.js';
import { getStyles, THEMES } from './themes.js';

export async function buildDocument({ markdown, theme, options, mode }) {
  const [html, styles] = await Promise.all([
    Promise.resolve(renderMarkdown(markdown)),
    getStyles(theme),
  ]);

  const meta = THEMES[theme];
  const metrics = getPageMetrics(options);
  const title = extractTitle(markdown);

  const pageCss =
    mode === 'image'
      ? `
    html, body {
      margin: 0;
      padding: 0;
      background: ${meta.paper};
    }
    body {
      width: ${metrics.widthPx}px;
      min-height: ${metrics.heightPx}px;
      padding: ${metrics.marginPx}px;
      box-sizing: border-box;
    }
    .md-body pre,
    .md-body pre code {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  `
      : `
    @page {
      background: ${meta.paper};
    }
    html, body {
      margin: 0;
      padding: 0;
      background: ${meta.paper};
    }
    body {
      width: auto;
    }
  `;

  const document = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
${styles.base}
${styles.theme}
${styles.print}
${pageCss}
</style>
</head>
<body class="md-body" data-theme="${theme}" data-mode="${mode}" style="--md-font-size:${metrics.fontPx}px">
${html}
</body>
</html>`;

  return { document, html, title, metrics };
}
