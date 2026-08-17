import fs from "fs/promises";
import path from "path";

const cacheTimeout = 60 * 60 * 1000;

const resolveCacheFile = (cacheDir, cacheKey) => {
  const resolvedCacheDir = path.resolve(cacheDir);
  const cacheFile = path.join(resolvedCacheDir, `${cacheKey}.json`);

  if (!cacheFile.startsWith(resolvedCacheDir + path.sep)) {
    return null;
  }

  return cacheFile;
};

export const readCache = async (cacheDir, cacheKey) => {
  const cacheFile = resolveCacheFile(cacheDir, cacheKey);
  let cachedData = null;

  if (cacheFile) {
    try {
      const stat = await fs.stat(cacheFile);
      const cacheFileAge = Date.now() - stat.mtimeMs;
      if (cacheFileAge < cacheTimeout) {
        const cached = await fs.readFile(cacheFile, "utf-8");
        cachedData = JSON.parse(cached);
      }
    } catch {
      // noop
    }
  }

  return cachedData;
};

export const writeCache = async (cacheDir, cacheKey, data) => {
  const cacheFile = resolveCacheFile(cacheDir, cacheKey);

  if (cacheFile) {
    await fs.mkdir(path.dirname(cacheFile), { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(data), "utf-8");
  }
};
