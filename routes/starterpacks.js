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
  format: (value, type) => {
    if (type === "url") {
      const urlParsed = new URL(value);
      return (
        urlParsed.host +
        urlParsed.pathname +
        urlParsed.search +
        urlParsed.hash
      ).replace(/\/$/, "");
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
    if (pack?.description && !isHTML(pack.description)) {
      return {
        ...pack,
        description: linkifyHtml(pack.description, linkifyOptions),
      };
    }
    return pack;
  });

  res.json(starterPackData);
});

export default router;
