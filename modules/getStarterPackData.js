import fs from "fs/promises";
import path from "path";

const cacheTimeout = 60 * 60 * 1000;

export default async (starterPackID) => {
  if (!starterPackID) return starterPackData;
  let starterPackData = {};

  const cacheFile = path.join("data/starter-packs", `${starterPackID}.json`);

  try {
    const stat = await fs.stat(cacheFile);
    const cacheFileAge = Date.now() - stat.mtimeMs;
    if (cacheFileAge < cacheTimeout) {
      const cached = await fs.readFile(cacheFile, "utf-8");
      return JSON.parse(cached);
    }
  } catch {
    // noop
  }

  try {
    const response = await fetch(`https://fedidevs.com/s/${starterPackID}/`, {
      headers: {
        Accept: "application/json",
      },
    });

    starterPackData = await response.json();

    await fs.mkdir("data/starter-packs", { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(starterPackData), "utf-8");
  } catch (error) {
    console.error(`Failed to fetch starter pack ${starterPackID}:`, error);
  }

  return starterPackData;
};
