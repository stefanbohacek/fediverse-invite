import { getUrlParam } from "./urlParams.js";

export default async () => {
  const starterPackIDs = getUrlParam("starterpacks");
  if (starterPackIDs) {
    const resp = await fetch(`/starterpacks?ids=${starterPackIDs}`);
    const starterPackData = await resp.json();

    if (starterPackData?.length) {
      const starterPacksResults = document.getElementById("starter-packs");
      let starterPackHTML = "";

      starterPackData.forEach((starterPack) => {
        starterPackHTML += /* html */ `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 pb-4">
            <div class="card h-100">
              <div class="card-body">
                <span class="badge rounded-pill text-bg-info float-end fs-6">${starterPack.accounts.length.toLocaleString()} accounts</span>
                <h5 class="card-title">${starterPack.title}</h5>
                <p class="card-text fs-5">${starterPack.description}</p>
              </div>
              <div class="card-footer bg-body border-0 pb-3">
                <a href="${starterPack.url}" class="fs-6 btn btn-primary">Explore</a>
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
