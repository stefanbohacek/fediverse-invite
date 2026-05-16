export default () => {
  const currentParams = new URLSearchParams(window.location.search);
  if (currentParams.size === 0) return;

  document.querySelectorAll("a:not([href^='http'])").forEach((link) => {
    const url = new URL(link.href);
    currentParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    link.href = url.toString();
  });
};
