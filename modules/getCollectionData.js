import { readCache, writeCache } from "./cache.js";

export default async (server, id) => {
  if (!server || !id) {
    return {};
  }

  const cacheDir = "data/collections";
  const cacheKey = `${server}-${id}`;

  const cached = await readCache(cacheDir, cacheKey);
  if (cached) {
    return cached;
  }

  let collectionData = {};

  try {
    const response = await fetch(`https://${server}/api/v1/collections/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    const json = await response.json();

    if (!json.collection) {
      return collectionData;
    }

    const { name, description, item_count, account_id } = json.collection;
    const creatorAccount = json.accounts?.find((a) => a.id === account_id);
    const creator =
      creatorAccount?.display_name || creatorAccount?.acct || null;
    collectionData = {
      name,
      description,
      url: `https://${server}/collections/${id}`,
      item_count,
      creator,
    };

    await writeCache(cacheDir, cacheKey, collectionData);
  } catch (err) {
    console.error(`Failed to fetch collection ${id} from ${server}:`, err);
  }

  return collectionData;
};
