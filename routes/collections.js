import express from "express";
import linkifyHtml from "linkify-html";
import getCollectionData from "../modules/getCollectionData.js";
import isHTML from "../modules/isHTML.js";

const router = express.Router();

const linkifyOptions = {
  attributes: {
    rel: "noreferrer",
    target: "_blank",
  },
  formatHref: (href, type) => {
    if (type === "email") {
      const [user, domain] = href.replace("mailto:", "").split("@");
      return `https://${domain}/@${user}`;
    }
    return href;
  },
  format: (value, type) => {
    if (type === "email") {
      return `@${value}`;
    }
    if (type === "url") {
      try {
        const urlParsed = new URL(value);
        return (
          urlParsed.host +
          urlParsed.pathname +
          urlParsed.search +
          urlParsed.hash
        ).replace(/\/$/, "");
      } catch {
        return value;
      }
    }
    return value;
  },
};

router.get("/", async (req, res) => {
  let collectionsData = [];

  if (req.query.server && req.query.ids) {
    const server = req.query.server;
    const collectionIDs = req.query.ids.split(",").slice(0, 8);

    if (collectionIDs && collectionIDs.length) {
      try {
        collectionsData = await Promise.all(
          collectionIDs.map((id) => getCollectionData(server, id)),
        );
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
    }
  }

  collectionsData = collectionsData.map((data) => {
    if (data?.description && isHTML(data.description)) {
      return { ...data, description: data.description.replace(/<[^>]*>/g, "") };
    } else if (data?.description) {
      const description = data.description.replace(/@([\w.+-]+@[\w.-]+\.\w+)/g, "$1");
      return { ...data, description: linkifyHtml(description, linkifyOptions) };
    } else {
      return data;
    }
  });

  res.json(collectionsData);
});

export default router;
