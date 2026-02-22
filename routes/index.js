import express from "express";
import getServerInfo from "../modules/getServerInfo.js";
import domainBlocks from "../data/domain_blocks.json" with { type: "json" };
import apps from "../data/apps.json" with { type: "json" };

const router = express.Router();

const getAppByID = (id) => apps.find((app) => app.id === id);

router.get("/", async (req, res) => {
  const server = req.query.server ?? "mastodon.social";
  const appIDs = req.query.apps ?? "1,2,3,4";

  if (!domainBlocks.includes(server)) {
    const serverInfo = await getServerInfo(server);

    try {
      res.render("../views/home.handlebars", {
        server_domain: serverInfo.domain,
        server_url: `https://${serverInfo.domain}`,
        server_name: serverInfo.nodeInfo.metadata.nodeName,
        server_description: serverInfo.nodeInfo.metadata.nodeDescription,
        server_thumbnail_url: serverInfo.instance_data?.thumbnail_url,
        server_icon_url: serverInfo.instance_data?.icon_url,
        server_contact_name: serverInfo.instance_data?.contact_name,
        server_contact_username: serverInfo.instance_data?.contact_username,
        server_post_count: new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(serverInfo.nodeInfo?.usage?.localPosts),
        server_user_count: new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(serverInfo.nodeInfo?.usage?.users.activeMonth),
        apps: appIDs.split(",").map((id) => getAppByID(id)),
        footer_scripts: process.env.FOOTER_SCRIPTS,
      });
    } catch (error) {
      res.render("../views/blocked.handlebars", {
        server,
        footer_scripts: process.env.FOOTER_SCRIPTS,
      });
    }
  } else {
    res.render("../views/blocked.handlebars", {
      server,
      footer_scripts: process.env.FOOTER_SCRIPTS,
    });
  }
});

export default router;
