const PAGE_SIZES = {
  a4: { label: 'A4', width: 210, height: 297 },
  letter: { label: 'Letter', width: 215.9, height: 279.4 },
  legal: { label: 'Legal', width: 215.9, height: 355.6 },
  a5: { label: 'A5', width: 148, height: 210 },
};

const MARGINS = {
  compact: { label: 'Compact', mm: 12 },
  normal: { label: 'Normal', mm: 20 },
  wide: { label: 'Wide', mm: 28 },
};

const FONT_SIZES = {
  small: { label: 'Small', px: 14 },
  normal: { label: 'Normal', px: 16 },
  large: { label: 'Large', px: 18 },
};

const THEMES = {
  'modern-light': { label: 'Modern Light' },
  'dark-code': { label: 'Dark Code' },
  academic: { label: 'Academic' },
};

const DEFAULT_STATE = {
  theme: 'modern-light',
  options: {
    size: 'a4',
    orientation: 'portrait',
    margin: 'normal',
    fontSize: 'normal',
    pageNumbers: true,
  },
};

const STORAGE_KEY = 'margin:workspace:v1';
const MM_TO_PX = 96 / 25.4;
const numberFormat = new Intl.NumberFormat('en-US');

const $ = (selector) => document.querySelector(selector);

const root = document.documentElement;
const editor = $('#editor');
const previewBody = $('#previewBody');
const previewStage = $('#previewStage');
const sheetWrap = $('#sheetWrap');
const workspace = $('#workspace');
const splitter = $('#splitter');
const pagePanel = $('#pagePanel');
const pageSetupBtn = $('#pageSetupBtn');
const closePagePanel = $('#closePagePanel');
const pageNumbersSwitch = $('#pageNumbersSwitch');
const resetLayout = $('#resetLayout');
const pageBadge = $('#pageBadge');
const panelNote = $('#panelNote');
const previewStatus = $('#previewStatus');
const previewDot = $('#previewDot');
const previewMeta = $('#previewMeta');
const wordCount = $('#wordCount');
const wordUnit = $('#wordUnit');
const readTime = $('#readTime');
const saveState = $('#saveState');
const exportPdfBtn = $('#exportPdf');
const exportImageBtn = $('#exportImage');
const themeToggle = $('#themeToggle');
const themeColor = $('#themeColor');
const themeSwitch = $('#themeSwitch');
const themePill = $('#themePill');
const viewSwitch = $('#viewSwitch');
const viewPill = $('#viewPill');
const setupPageValue = $('#setupPageValue');
const setupTypeValue = $('#setupTypeValue');
const setupItems = [...document.querySelectorAll('.setup-item')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const loadSampleBtn = $('#loadSample');
const clearEditorBtn = $('#clearEditor');
const toast = $('#toast');

const SAMPLE = $('#sampleMarkdown').textContent.trim();

const EMPTY_PREVIEW = `
  <div class="preview-empty">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6.5 3.5h7l4 4v13h-11z"></path>
      <path d="M13.5 3.5v4h4M9 12h6M9 15.5h6M9 19h3.5"></path>
    </svg>
    <strong>Your document appears here.</strong>
    <span>Start typing on the left, or load the sample to explore the themes.</span>
  </div>`;

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function applyTheme(theme, persist = true) {
  const next = theme === 'dark' ? 'dark' : 'light';
  const dark = next === 'dark';

  root.dataset.theme = next;
  themeToggle?.setAttribute('aria-pressed', String(dark));
  themeToggle?.setAttribute(
    'aria-label',
    dark ? 'Switch to light mode' : 'Switch to dark mode',
  );
  themeColor?.setAttribute('content', dark ? '#0b0c10' : '#f6f5f2');

  if (persist) {
    try {
      localStorage.setItem('margin:ui-theme', next);
    } catch {
      // Theme still applies if storage is unavailable.
    }
  }
}

function animateCount(element, value) {
  if (!element) return;

  const text = numberFormat.format(value);

  if (element.dataset.value === String(value)) return;

  element.dataset.value = String(value);
  element.textContent = text;

  if (reducedMotion.matches) return;

  element.classList.remove('is-ticking');
  void element.offsetWidth;
  element.classList.add('is-ticking');
  element.addEventListener(
    'animationend',
    () => element.classList.remove('is-ticking'),
    { once: true },
  );
}

function positionPill(container, pill, active) {
  if (!container || !pill || !active) return;

  const containerRect = container.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();

  if (!containerRect.width || !activeRect.width) return;

  pill.style.width = `${activeRect.width}px`;
  pill.style.transform = `translateX(${activeRect.left - containerRect.left}px)`;
}

function syncPills() {
  positionPill(
    themeSwitch,
    themePill,
    document.querySelector('[data-theme-option].is-active'),
  );
  positionPill(
    viewSwitch,
    viewPill,
    document.querySelector('[data-view-option][aria-pressed="true"]'),
  );
}

function setSetupItem(item, open) {
  item.classList.toggle('is-open', open);

  const trigger = item.querySelector('.setup-trigger');
  const panel = item.querySelector('.setup-panel');

  trigger?.setAttribute('aria-expanded', String(open));

  if (panel) {
    panel.style.height = open ? `${panel.scrollHeight}px` : '0px';
  }
}

function refreshSetupHeights() {
  setupItems.forEach((item) => {
    const panel = item.querySelector('.setup-panel');

    if (!panel) return;

    panel.style.height = item.classList.contains('is-open')
      ? `${panel.scrollHeight}px`
      : '0px';
  });
}

function sanitizeOptions(raw) {
  const input = raw && typeof raw === 'object' ? raw : {};

  return {
    size: Object.hasOwn(PAGE_SIZES, input.size) ? input.size : DEFAULT_STATE.options.size,
    orientation: ['portrait', 'landscape'].includes(input.orientation)
      ? input.orientation
      : DEFAULT_STATE.options.orientation,
    margin: Object.hasOwn(MARGINS, input.margin)
      ? input.margin
      : DEFAULT_STATE.options.margin,
    fontSize: Object.hasOwn(FONT_SIZES, input.fontSize)
      ? input.fontSize
      : DEFAULT_STATE.options.fontSize,
    pageNumbers:
      typeof input.pageNumbers === 'boolean'
        ? input.pageNumbers
        : DEFAULT_STATE.options.pageNumbers,
  };
}

function loadState() {
  let saved = null;

  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    saved = null;
  }

  return {
    markdown:
      saved && typeof saved.markdown === 'string' ? saved.markdown : SAMPLE,
    theme:
      saved && Object.hasOwn(THEMES, saved.theme)
        ? saved.theme
        : DEFAULT_STATE.theme,
    options: sanitizeOptions(saved?.options),
  };
}

const state = loadState();

function pageMetrics() {
  const base = PAGE_SIZES[state.options.size];
  const landscape = state.options.orientation === 'landscape';
  const widthMm = landscape ? base.height : base.width;
  const heightMm = landscape ? base.width : base.height;
  const marginMm = MARGINS[state.options.margin].mm;

  return {
    widthMm,
    heightMm,
    marginMm,
    widthPx: Math.round(widthMm * MM_TO_PX),
    heightPx: Math.round(heightMm * MM_TO_PX),
    marginPx: Number((marginMm * MM_TO_PX).toFixed(2)),
    fontPx: FONT_SIZES[state.options.fontSize].px,
  };
}

function computeStats(markdown) {
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

function updateStats() {
  const stats = computeStats(state.markdown);
  const wordLabel = stats.words === 1 ? 'word' : 'words';

  animateCount(wordCount, stats.words);
  wordUnit.textContent = wordLabel;
  readTime.textContent = stats.words
    ? `${stats.minutes} min read`
    : '0 min read';
  previewMeta.textContent = state.markdown.trim()
    ? `${numberFormat.format(stats.words)} ${wordLabel} / ${numberFormat.format(
        stats.characters,
      )} chars`
    : 'Empty document';
}

function updatePageVars() {
  const metrics = pageMetrics();

  previewBody.style.setProperty('--page-width', `${metrics.widthPx}px`);
  previewBody.style.setProperty('--page-height', `${metrics.heightPx}px`);
  previewBody.style.setProperty('--page-margin', `${metrics.marginPx}px`);
  previewBody.style.setProperty('--md-font-size', `${metrics.fontPx}px`);

  requestAnimationFrame(updateScale);
}

function updateScale() {
  const stageWidth = previewStage.clientWidth;

  if (stageWidth === 0) return;

  const stageStyle = getComputedStyle(previewStage);
  const paddingLeft = Number.parseFloat(stageStyle.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(stageStyle.paddingRight) || 0;
  const available = stageWidth - paddingLeft - paddingRight - 2;
  const metrics = pageMetrics();
  const scale = clamp(available / metrics.widthPx, 0.2, 1);

  previewBody.style.transform = `scale(${scale})`;
  sheetWrap.style.width = `${Math.round(metrics.widthPx * scale)}px`;
  sheetWrap.style.height = `${Math.round(previewBody.offsetHeight * scale)}px`;
}

function syncControls() {
  document.querySelectorAll('[data-theme-option]').forEach((button) => {
    const active = button.dataset.themeOption === state.theme;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  previewBody.dataset.theme = state.theme;

  document.querySelectorAll('[data-group][data-value]').forEach((button) => {
    const group = button.dataset.group;
    const active = state.options[group] === button.dataset.value;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  pageNumbersSwitch.setAttribute(
    'aria-checked',
    String(state.options.pageNumbers),
  );

  const size = PAGE_SIZES[state.options.size];
  const metrics = pageMetrics();
  const orientation =
    state.options.orientation === 'landscape' ? 'Landscape' : 'Portrait';

  pageBadge.textContent = `${size.label} / ${orientation}`;
  panelNote.textContent = `${size.label} / ${Math.round(
    metrics.widthMm,
  )} x ${Math.round(metrics.heightMm)} mm`;

  if (setupPageValue) {
    setupPageValue.textContent = `${size.label} / ${orientation}`;
  }

  if (setupTypeValue) {
    setupTypeValue.textContent = `${MARGINS[state.options.margin].label} / ${
      FONT_SIZES[state.options.fontSize].label
    }`;
  }

  updatePageVars();
  requestAnimationFrame(syncPills);
}

function setPreviewStatus(kind, message) {
  previewDot.classList.toggle('is-busy', kind === 'busy');
  previewDot.classList.toggle('is-error', kind === 'error');
  previewStatus.textContent = message;
}

let previewTimer;
let previewSequence = 0;
let previewController = null;

function schedulePreview(delay = 180) {
  window.clearTimeout(previewTimer);
  previewTimer = window.setTimeout(renderPreview, delay);
}

async function renderPreview() {
  const sequence = ++previewSequence;

  previewController?.abort();
  previewController = new AbortController();

  if (!state.markdown.trim()) {
    previewBody.innerHTML = EMPTY_PREVIEW;
    setPreviewStatus('idle', 'Empty document');
    requestAnimationFrame(updateScale);
    return;
  }

  setPreviewStatus('busy', 'Typesetting…');

  try {
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown: state.markdown }),
      signal: previewController.signal,
    });

    if (sequence !== previewSequence) return;

    if (!response.ok) {
      let message = 'Preview failed.';
      try {
        const data = await response.json();
        message = data.error || message;
      } catch {
        // Keep the default message.
      }
      throw new Error(message);
    }

    const data = await response.json();

    if (sequence !== previewSequence) return;

    previewBody.innerHTML = data.html || EMPTY_PREVIEW;
    setPreviewStatus('idle', 'Live preview');
    requestAnimationFrame(updateScale);
  } catch (error) {
    if (error.name === 'AbortError' || sequence !== previewSequence) return;

    setPreviewStatus('error', 'Preview failed');
    showToast(error.message || 'Preview failed.', 'error');
  }
}

let saveTimer;

function scheduleSave(delay = 450) {
  saveState.textContent = 'Saving…';
  saveState.classList.add('is-saving');
  saveState.classList.remove('is-error');

  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(persistState, delay);
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveState.textContent = 'Saved locally';
    saveState.classList.remove('is-saving', 'is-error');
  } catch {
    saveState.textContent = 'Not saved';
    saveState.classList.remove('is-saving');
    saveState.classList.add('is-error');
  }
}

let toastTimer;

function showToast(message, type = 'info', duration = 3800) {
  toast.textContent = message;
  toast.classList.toggle('is-error', type === 'error');
  toast.classList.add('is-visible');

  window.clearTimeout(toastTimer);

  if (duration > 0) {
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, duration);
  }
}

function setPagePanel(open) {
  pagePanel.hidden = !open;
  pageSetupBtn.setAttribute('aria-expanded', String(open));

  if (open) {
    closePagePanel.focus();
    requestAnimationFrame(refreshSetupHeights);
  }
}

function insertIndent() {
  editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

let exporting = false;

function filenameFromHeader(header, fallback) {
  if (!header) return fallback;

  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1]);
    } catch {
      // Fall through to the plain filename.
    }
  }

  const plain = header.match(/filename="?([^";]+)"?/i);
  return plain ? plain[1] : fallback;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

async function exportDocument(kind) {
  if (exporting) return;

  if (!state.markdown.trim()) {
    showToast('Add some Markdown before exporting.', 'error');
    editor.focus();
    return;
  }

  const button = kind === 'pdf' ? exportPdfBtn : exportImageBtn;
  const label = kind === 'pdf' ? 'PDF' : 'PNG';

  exporting = true;
  exportPdfBtn.disabled = true;
  exportImageBtn.disabled = true;
  button.classList.add('is-loading');

  showToast(`Rendering ${label}…`, 'info', 0);

  try {
    const response = await fetch(`/api/convert/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        markdown: state.markdown,
        theme: state.theme,
        page: state.options,
      }),
    });

    if (!response.ok) {
      let message = 'Export failed.';
      try {
        const data = await response.json();
        message = data.error || message;
      } catch {
        // Keep the default message.
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    const filename = filenameFromHeader(
      response.headers.get('Content-Disposition'),
      kind === 'pdf' ? 'document.pdf' : 'document.png',
    );

    downloadBlob(blob, filename);
    showToast(`${label} downloaded.`);
  } catch (error) {
    showToast(error.message || 'Export failed.', 'error', 6_000);
  } finally {
    exporting = false;
    exportPdfBtn.disabled = false;
    exportImageBtn.disabled = false;
    button.classList.remove('is-loading');
  }
}

editor.addEventListener('input', () => {
  state.markdown = editor.value;
  updateStats();
  schedulePreview();
  scheduleSave();
});

editor.addEventListener('keydown', (event) => {
  if (
    event.key === 'Tab' &&
    !event.shiftKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey
  ) {
    event.preventDefault();
    insertIndent();
  }
});

document.querySelectorAll('[data-theme-option]').forEach((button) => {
  button.addEventListener('click', () => {
    state.theme = button.dataset.themeOption;
    syncControls();
    scheduleSave(180);
  });
});

document.querySelectorAll('[data-group][data-value]').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.dataset.group;

    if (!Object.hasOwn(state.options, group)) return;

    state.options[group] = button.dataset.value;
    syncControls();
    scheduleSave(180);
  });
});

pageNumbersSwitch.addEventListener('click', () => {
  state.options.pageNumbers = !state.options.pageNumbers;
  syncControls();
  scheduleSave(180);
});

resetLayout.addEventListener('click', () => {
  state.options = sanitizeOptions(DEFAULT_STATE.options);
  syncControls();
  scheduleSave(180);
  showToast('Page layout reset.');
});

themeToggle?.addEventListener('click', () => {
  applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  requestAnimationFrame(syncPills);
});

setupItems.forEach((item) => {
  const trigger = item.querySelector('.setup-trigger');

  trigger?.addEventListener('click', () => {
    const open = item.classList.contains('is-open');

    setupItems.forEach((other) => {
      setSetupItem(other, other === item ? !open : false);
    });

    requestAnimationFrame(refreshSetupHeights);
  });
});

document.querySelectorAll('[data-spotlight]').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;

    const rect = element.getBoundingClientRect();

    element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  });
});

pageSetupBtn.addEventListener('click', () => {
  setPagePanel(pagePanel.hidden);
});

closePagePanel.addEventListener('click', () => {
  setPagePanel(false);
  pageSetupBtn.focus();
});

document.addEventListener('pointerdown', (event) => {
  if (pagePanel.hidden) return;
  if (pagePanel.contains(event.target) || pageSetupBtn.contains(event.target)) {
    return;
  }
  setPagePanel(false);
});

loadSampleBtn.addEventListener('click', () => {
  editor.value = SAMPLE;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  editor.focus();
  showToast('Sample document loaded.');
});

clearEditorBtn.addEventListener('click', () => {
  if (!editor.value) {
    editor.focus();
    return;
  }

  editor.value = '';
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  editor.focus();
  showToast('Editor cleared.');
});

exportPdfBtn.addEventListener('click', () => exportDocument('pdf'));
exportImageBtn.addEventListener('click', () => exportDocument('image'));

document.querySelectorAll('[data-view-option]').forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.viewOption;
    document.body.dataset.view = view;

    document.querySelectorAll('[data-view-option]').forEach((candidate) => {
      candidate.setAttribute(
        'aria-pressed',
        String(candidate.dataset.viewOption === view),
      );
    });

    if (view === 'preview') {
      requestAnimationFrame(() => {
        updateScale();
        syncPills();
        refreshSetupHeights();
      });
    } else {
      requestAnimationFrame(syncPills);
    }
  });
});

let resizing = false;

splitter.addEventListener('pointerdown', (event) => {
  if (window.matchMedia('(max-width: 900px)').matches) return;

  event.preventDefault();
  resizing = true;
  splitter.setPointerCapture(event.pointerId);
  document.body.classList.add('is-resizing');
});

splitter.addEventListener('pointermove', (event) => {
  if (!resizing) return;

  const rect = workspace.getBoundingClientRect();
  const ratio = clamp((event.clientX - rect.left) / rect.width, 0.3, 0.68);

  workspace.style.setProperty('--editor-width', `${(ratio * 100).toFixed(2)}%`);
  splitter.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
  updateScale();
});

function stopResize(event) {
  if (!resizing) return;

  resizing = false;
  document.body.classList.remove('is-resizing');

  try {
    splitter.releasePointerCapture(event.pointerId);
  } catch {
    // The pointer may already be released.
  }
}

splitter.addEventListener('pointerup', stopResize);
splitter.addEventListener('pointercancel', stopResize);

splitter.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

  event.preventDefault();

  const editorPane = document.querySelector('.editor-pane');
  const rect = workspace.getBoundingClientRect();
  const current = editorPane.getBoundingClientRect().width / rect.width;
  const next = clamp(
    current + (event.key === 'ArrowRight' ? 0.02 : -0.02),
    0.3,
    0.68,
  );

  workspace.style.setProperty('--editor-width', `${(next * 100).toFixed(2)}%`);
  splitter.setAttribute('aria-valuenow', String(Math.round(next * 100)));
  updateScale();
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    exportDocument(event.shiftKey ? 'image' : 'pdf');
    return;
  }

  const target = event.target;
  const typing =
    target instanceof HTMLElement &&
    (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT');

  if (
    !typing &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    event.code === 'KeyT'
  ) {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    requestAnimationFrame(syncPills);
    return;
  }

  if (event.key === 'Escape' && !pagePanel.hidden) {
    setPagePanel(false);
    pageSetupBtn.focus();
  }
});

const previewResizeObserver = new ResizeObserver(() => updateScale());
previewResizeObserver.observe(previewBody);

const controlsResizeObserver = new ResizeObserver(() => syncPills());
controlsResizeObserver.observe(themeSwitch);
controlsResizeObserver.observe(viewSwitch);

let uiFrame;

function syncLayout() {
  cancelAnimationFrame(uiFrame);
  uiFrame = requestAnimationFrame(() => {
    updateScale();
    syncPills();
    refreshSetupHeights();
  });
}

window.addEventListener('resize', syncLayout);

applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
editor.value = state.markdown;
updateStats();
syncControls();
refreshSetupHeights();
renderPreview();
persistState();
requestAnimationFrame(() => {
  syncPills();
  refreshSetupHeights();
});

document.fonts?.ready.then(() => {
  syncPills();
  refreshSetupHeights();
  updateScale();
});
