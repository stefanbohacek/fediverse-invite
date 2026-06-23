import { getUrlParam } from "./urlParams.js";

export default async () => {
  const starterPackIDs = getUrlParam("starterpacks");
  const collectionIDs = getUrlParam("collections");

  const requests = [];

  if (collectionIDs) {
    const server = getUrlParam("server");
    requests.push(
      fetch(`/collections?server=${server}&ids=${collectionIDs}`)
        .then((resp) => resp.json())
        .then((data) =>
          data.map((collection) => ({
            title: collection.name,
            description: collection.description,
            url: collection.url,
            count: collection.item_count,
            creator: collection.creator,
          })),
        ),
    );
  }

  if (starterPackIDs) {
    requests.push(
      fetch(`/starterpacks?ids=${starterPackIDs}`)
        .then((resp) => resp.json())
        .then((data) =>
          data.map((pack) => ({
            title: pack.title,
            description: pack.description,
            url: pack.url,
            count: pack.accounts.length,
          })),
        ),
    );
  }

  if (!requests.length) {
    return;
  }

  const results = await Promise.all(requests);
  const items = results
    .flat()
    .filter((item) => item.title && item.url && item.count != null);

  if (!items.length) {
    return;
  }

  const itemCount = items.length;
  const starterPacksResults = document.getElementById("starter-packs");
  let colClass;

  if (itemCount <= 2) {
    colClass = "col-12 col-sm-6";
  } else if (itemCount === 3) {
    colClass = "col-12 col-sm-6 col-md-4";
  } else {
    colClass = "col-12 col-sm-6 col-md-4 col-lg-3";
  }

  let html = "";

  items.forEach((item) => {
    html += /* html */ `
      <div class="${colClass} pb-4">
        <div class="card h-100">
          <div class="card-body">
            <span class="badge rounded-pill text-bg-info float-end fs-7">${item.count.toLocaleString()} ${window.translations.accounts}</span>
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text fs-5">${item.description || (item.creator ? `A collection by ${item.creator}.` : "")}</p>
          </div>
          <div class="card-footer border-0 pb-3">
            <a href="${item.url}" class="fs-6 btn btn-primary">${window.translations.explore}</a>
          </div>
        </div>
      </div>
    `;
  });

  starterPacksResults.classList.add("mt-5");
  starterPacksResults.innerHTML = html;
};
