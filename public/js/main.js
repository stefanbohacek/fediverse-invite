import onReady from "./modules/onReady.js";
import showStarterPacks from "./modules/showStarterPacks.js";
import switchLanguage from "./modules/language-switcher.js";
import initThemeSwitcher from "./modules/theme-switcher.js";
import fixLinkLocale from "./modules/fix-link-locale.js";

onReady(async () => {
  // switchLanguage();
  showStarterPacks();
  initThemeSwitcher();
  fixLinkLocale();
});
