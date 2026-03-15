import { getUrlParam } from "./urlParams.js";

export default () => {
  const langParam = getUrlParam("lang");
  if (!langParam) return;

  document.querySelectorAll("a:not([href^='http'])").forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set("lang", langParam);
    link.href = url.toString();
  });
};
