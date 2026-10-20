import { Marked } from 'marked';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'a',
  'p',
  'br',
  'hr',
  'strong',
  'em',
  'del',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'img',
  'input',
  'span',
  'div',
  'sup',
  'sub',
  'kbd',
  'mark',
  'details',
  'summary',
  'dl',
  'dt',
  'dd',
];

const ALLOWED_ATTRIBUTES = {
  '*': ['class', 'id', 'title', 'dir', 'lang', 'align'],
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height', 'loading'],
  pre: ['data-lang'],
  code: ['class'],
  input: ['type', 'checked', 'disabled'],
  ol: ['start', 'type'],
  li: ['value'],
  th: ['colspan', 'rowspan', 'scope'],
  td: ['colspan', 'rowspan'],
};

const SANITIZE_OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    a: ['http', 'https', 'mailto'],
    img: ['http', 'https', 'data'],
  },
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
  },
};

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

function slugify(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z0-9#]+;/gi, '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createMarked() {
  const usedSlugs = new Map();
  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const base = slugify(text) || 'section';
        const seen = usedSlugs.get(base) ?? 0;
        usedSlugs.set(base, seen + 1);
        const id = seen === 0 ? base : `${base}-${seen + 1}`;
        return `<h${depth} id="${escapeAttribute(id)}">${text}</h${depth}>\n`;
      },

      code({ text, lang }) {
        const requested = (lang || '').trim().split(/\s+/)[0];
        const known = requested && hljs.getLanguage(requested) ? requested : null;
        const highlighted = known
          ? hljs.highlight(text, { language: known, ignoreIllegals: true }).value
          : hljs.highlightAuto(text).value;
        const languageClass = known
          ? ` language-${escapeAttribute(known)}`
          : '';
        const label = escapeAttribute(known || 'code');

        return `<pre class="code-block" data-lang="${label}"><code class="hljs${languageClass}">${highlighted}</code></pre>\n`;
      },

      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${escapeAttribute(title)}"` : '';
        return `<a href="${escapeAttribute(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
      },

      image({ href, title, text }) {
        const titleAttr = title ? ` title="${escapeAttribute(title)}"` : '';
        return `<img src="${escapeAttribute(href)}" alt="${escapeAttribute(
          text || '',
        )}"${titleAttr} />`;
      },
    },
  });

  return marked;
}

export function renderMarkdown(markdown) {
  const marked = createMarked();
  const rendered = marked.parse(markdown, { async: false });
  return sanitizeHtml(rendered, SANITIZE_OPTIONS);
}

export function extractTitle(markdown) {
  const match = markdown.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/m);
  if (!match) return 'Untitled document';

  const title = match[1]
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return title.slice(0, 120) || 'Untitled document';
}

export function getStats(markdown) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = plain ? plain.split(' ').length : 0;

  return {
    words,
    characters: markdown.length,
    minutes: words === 0 ? 0 : Math.max(1, Math.ceil(words / 220)),
  };
}
