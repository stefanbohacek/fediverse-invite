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

  items.forEach((item) => {
    const col = document.createElement("div");
    col.className = `${colClass} pb-4`;

    const card = document.createElement("div");
    card.className = "card h-100";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const badge = document.createElement("span");
    badge.className = "badge rounded-pill text-bg-info float-end fs-7";
    badge.textContent = `${item.count.toLocaleString()} ${window.translations.accounts}`;

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = item.title;

    const descriptionEl = document.createElement("p");
    descriptionEl.className = "card-text fs-5";
    if (item.description) {
      descriptionEl.innerHTML = item.description;
    } else if (item.creator) {
      descriptionEl.textContent = `A collection by ${item.creator}.`;
    }

    cardBody.appendChild(badge);
    cardBody.appendChild(title);
    cardBody.appendChild(descriptionEl);

    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer border-0 pb-3";

    const link = document.createElement("a");
    link.className = "fs-6 btn btn-primary";
    link.textContent = window.translations.explore;
    if (item.url?.startsWith("https://")) {
      link.href = item.url;
    }

    cardFooter.appendChild(link);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    col.appendChild(card);

    starterPacksResults.appendChild(col);
  });

  starterPacksResults.classList.add("mt-5");
};
