import { COLORS, THEMES } from '../utils/Constants';

export function colorRootElement(theme) {
  const rootElement = document.getElementById("root");
  const htmlElement = document.documentElement;

  if (!rootElement || !htmlElement) return;

  if (theme === THEMES.DARK) {
    rootElement.style.backgroundColor = COLORS.BLACK;
    htmlElement.style.backgroundColor = COLORS.BLACK;
  } else if (theme === THEMES.LIGHT) {
    rootElement.style.backgroundColor = COLORS.WHITE;
    htmlElement.style.backgroundColor = COLORS.WHITE;
  } else if (theme === THEMES.COLORFUL) {
    rootElement.style.backgroundColor = '#dcff7a';
    htmlElement.style.backgroundColor = '#d6ff65';
  }
}
