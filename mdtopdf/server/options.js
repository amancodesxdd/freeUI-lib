export const PAGE_SIZES = {
  a4: { label: 'A4', width: 210, height: 297 },
  letter: { label: 'Letter', width: 215.9, height: 279.4 },
  legal: { label: 'Legal', width: 215.9, height: 355.6 },
  a5: { label: 'A5', width: 148, height: 210 },
};

export const MARGINS = {
  compact: { label: 'Compact', mm: 12 },
  normal: { label: 'Normal', mm: 20 },
  wide: { label: 'Wide', mm: 28 },
};

export const FONT_SIZES = {
  small: { label: 'Small', px: 14 },
  normal: { label: 'Normal', px: 16 },
  large: { label: 'Large', px: 18 },
};

export const ORIENTATIONS = ['portrait', 'landscape'];

export const DEFAULT_PAGE = {
  size: 'a4',
  orientation: 'portrait',
  margin: 'normal',
  fontSize: 'normal',
  pageNumbers: true,
};

export function parsePageOptions(input) {
  const raw = input && typeof input === 'object' ? input : {};

  return {
    size: Object.hasOwn(PAGE_SIZES, raw.size) ? raw.size : DEFAULT_PAGE.size,
    orientation: ORIENTATIONS.includes(raw.orientation)
      ? raw.orientation
      : DEFAULT_PAGE.orientation,
    margin: Object.hasOwn(MARGINS, raw.margin) ? raw.margin : DEFAULT_PAGE.margin,
    fontSize: Object.hasOwn(FONT_SIZES, raw.fontSize)
      ? raw.fontSize
      : DEFAULT_PAGE.fontSize,
    pageNumbers:
      typeof raw.pageNumbers === 'boolean'
        ? raw.pageNumbers
        : DEFAULT_PAGE.pageNumbers,
  };
}

export function getPageMetrics(options) {
  const base = PAGE_SIZES[options.size];
  const landscape = options.orientation === 'landscape';
  const widthMm = landscape ? base.height : base.width;
  const heightMm = landscape ? base.width : base.height;
  const marginMm = MARGINS[options.margin].mm;
  const fontPx = FONT_SIZES[options.fontSize].px;

  return {
    widthMm,
    heightMm,
    marginMm,
    fontPx,
    widthPx: Math.round((widthMm * 96) / 25.4),
    heightPx: Math.round((heightMm * 96) / 25.4),
    marginPx: Number(((marginMm * 96) / 25.4).toFixed(2)),
  };
}
