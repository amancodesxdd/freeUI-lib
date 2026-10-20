import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(SERVER_DIR, '..');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

export const THEMES = {
  'modern-light': {
    label: 'Modern Light',
    paper: '#fdfcf9',
    footer: '#8a8478',
  },
  'dark-code': {
    label: 'Dark Code',
    paper: '#121418',
    footer: '#8b95a5',
  },
  academic: {
    label: 'Academic',
    paper: '#fffdf8',
    footer: '#7b7468',
  },
};

const cssCache = new Map();

async function readCss(relativePath) {
  const absolutePath = path.join(PUBLIC_DIR, 'css', relativePath);
  const useCache = process.env.NODE_ENV === 'production';

  if (useCache && cssCache.has(relativePath)) {
    return cssCache.get(relativePath);
  }

  const css = await fs.readFile(absolutePath, 'utf8');

  if (useCache) {
    cssCache.set(relativePath, css);
  }

  return css;
}

export function isTheme(theme) {
  return Object.hasOwn(THEMES, theme);
}

export async function getStyles(theme) {
  const [base, themeCss, print] = await Promise.all([
    readCss('base.css'),
    readCss(path.join('themes', `${theme}.css`)),
    readCss('print.css'),
  ]);

  return { base, theme: themeCss, print };
}
