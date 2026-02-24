import express from "express";
import getStarterPackData from "../modules/getStarterPackData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let starterPackData = [];

  if (req.query.ids) {
    const starterPackIDs = req.query.ids.split(",").slice(0, 4);

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

  res.json(starterPackData);
});

export default router;
