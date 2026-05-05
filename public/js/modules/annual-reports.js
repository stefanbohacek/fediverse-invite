export default () => {
  const select = document.getElementById("annual-reports");
  if (select) {
    select.addEventListener("change", () => {
      if (select.value) {
        window.open(select.value, "_blank");
        select.selectedIndex = 0;
      }
    });
  }
};
