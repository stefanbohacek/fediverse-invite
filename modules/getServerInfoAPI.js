import { readCache, writeCache } from "./cache.js";

export default async (server) => {
  let response = {};

  if (!server) {
    return response;
  }

  const cacheDir = "data/server-info-api";
  const cacheKey = server;

  const cached = await readCache(cacheDir, cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const resp = await fetch(`https://${server}/api/v1/instance`);
    response = await resp.json();

    await writeCache(cacheDir, cacheKey, response);
  } catch (err) {
    console.error(`Failed to fetch server info (via API) for ${server}:`, err);
  }

  return response;
};
