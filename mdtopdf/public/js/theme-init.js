(() => {
  try {
    const saved = localStorage.getItem('margin:ui-theme');
    const dark =
      saved === 'dark' ||
      (saved !== 'light' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  } catch {
    document.documentElement.dataset.theme = 'light';
  }
})();
