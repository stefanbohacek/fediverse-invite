import { readCache, writeCache } from "./cache.js";

export default async (starterPackID) => {
  let starterPackData = {};

  if (!starterPackID) {
    return starterPackData;
  }

  const cacheDir = "data/starter-packs";
  const cacheKey = starterPackID;

  const cached = await readCache(cacheDir, cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`https://fedidevs.com/s/${starterPackID}/`, {
      headers: {
        Accept: "application/json",
      },
    });

    starterPackData = await response.json();

    await writeCache(cacheDir, cacheKey, starterPackData);
  } catch (err) {
    console.error(`Failed to fetch starter pack ${starterPackID}:`, err);
  }

  return starterPackData;
};
