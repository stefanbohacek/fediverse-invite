import { getUrlParam } from "./urlParams.js";

export default async () => {
  const starterPackIDs = getUrlParam("starterpacks");
  if (starterPackIDs) {
    const resp = await fetch(`/starterpacks?ids=${starterPackIDs}`);
    const starterPackData = await resp.json();

    if (starterPackData?.length) {
      const starterPackCount = starterPackData.length;
      const starterPacksResults = document.getElementById("starter-packs");
      let starterPackHTML = "";
      let colClass;

      if (starterPackCount <= 2) {
        colClass = "col-12 col-sm-6";
      } else if (starterPackCount === 3) {
        colClass = "col-12 col-sm-6 col-md-4";
      } else {
        colClass = "col-12 col-sm-6 col-md-4 col-lg-3";
      }

      starterPackData.forEach((starterPack) => {
        starterPackHTML += /* html */ `
          <div class="${colClass} pb-4">
            <div class="card h-100">
              <div class="card-body">
                <span class="badge rounded-pill text-bg-info float-end fs-7">${starterPack.accounts.length.toLocaleString()} ${window.translations.accounts}</span>
                <h5 class="card-title">${starterPack.title}</h5>
                <p class="card-text fs-5">${starterPack.description}</p>
              </div>
              <div class="card-footer border-0 pb-3">
                <a href="${starterPack.url}" class="fs-6 btn btn-primary">${window.translations.explore}</a>
              </div>
            </div>
          </div>        
        `;
      });

      starterPacksResults.classList.add("mt-5");

      starterPacksResults.innerHTML = starterPackHTML;
    }
  }
};
