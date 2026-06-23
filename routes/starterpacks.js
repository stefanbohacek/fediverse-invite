import express from "express";
import linkifyHtml from "linkify-html";
import getStarterPackData from "../modules/getStarterPackData.js";
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
  let starterPackData = [];

  if (req.query.ids) {
    const starterPackIDs = req.query.ids.split(",").slice(0, 8);

    if (starterPackIDs && starterPackIDs.length) {
      try {
        starterPackData = await Promise.all(
          starterPackIDs.map((id) => getStarterPackData(id)),
        );
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
      }
    }
  }

  starterPackData = starterPackData.map((pack) => {
    if (pack?.description && isHTML(pack.description)) {
      return { ...pack, description: pack.description.replace(/<[^>]*>/g, "") };
    } else if (pack?.description) {
      const description = pack.description.replace(/@([\w.+-]+@[\w.-]+\.\w+)/g, "$1");
      return { ...pack, description: linkifyHtml(description, linkifyOptions) };
    } else {
      return pack;
    }
  });

  res.json(starterPackData);
});

export default router;
