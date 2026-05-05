const SUPPORTED_THEMES = ["happy-hues-12", "simple"];
const DEFAULT_THEME = "happy-hues-12";

export default (query) => {
  const theme = SUPPORTED_THEMES.includes(query) ? query : DEFAULT_THEME;

  if (theme === "simple") {
    return null;
  } else {
    return `/css/themes/${theme}.css`;
  }
};
