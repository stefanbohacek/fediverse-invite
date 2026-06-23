import fs from "fs/promises";
import path from "path";

const cacheTimeout = 60 * 60 * 1000;

export default async (server, id) => {
  if (!server || !id) {
    return {};
  }

  const cacheFile = path.join("data/collections", `${server}-${id}.json`);

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

    await fs.mkdir("data/collections", { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(collectionData), "utf-8");
  } catch (err) {
    console.error(`Failed to fetch collection ${id} from ${server}:`, err);
  }

  return collectionData;
};
