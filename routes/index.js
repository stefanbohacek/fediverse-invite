import express from "express";
import { linkifyUrlsToHtml } from "linkify-urls";
import getServerInfo from "../modules/getServerInfo.js";
import slugify from "../modules/slugify.js";
import validateDomain from "../modules/validateDomain.js";
import domainBlocks from "../data/domain_blocks.json" with { type: "json" };
import apps from "../data/apps.json" with { type: "json" };

const router = express.Router();

const appPlatforms = apps.map((app) => slugify(app.platform));
const appTags = [...new Set(apps.flatMap((app) => app.tags ?? []))];

const getAppByID = (id) => apps.find((app) => app.id === id);
const getAppByTag = (tag) =>
  apps.filter((app) => app.tags && app.tags.includes(tag));

router.get("/", async (req, res) => {
  const server = req.query.server?.trim().toLowerCase() ?? "mastodon.social";
  const appIDs = req.query.apps ?? "1,2,3,4";
  const currentLocale = req.query.lang || "en-us";

  let appList = [];

  if (appIDs === "all") {
    appList = apps;
  } else if (appPlatforms.includes(slugify(appIDs))) {
    appList = apps.filter((app) => slugify(app.platform) === slugify(appIDs));
  } else if (appTags.includes(appIDs.toLowerCase())) {
    appList = appIDs
      .split(",")
      .flatMap((tag) => getAppByTag(tag.toLowerCase()));
  } else {
    appList = appIDs.split(",").map((id) => getAppByID(id));
  }

  if (validateDomain(server) && !domainBlocks.includes(server)) {
    const serverInfo = await getServerInfo(server);
    const recommendText = res
      .__("home_recommend")
      .replace(/#SERVER_DOMAIN#/g, server);

    // console.log(serverInfo);

    const downloadURLs = ["apps.apple.com", "play.google.com"];

    apps.forEach((app) => {
      app.name = res.__(`apps_app_${app.id}_name`);
      app.description = res.__(`apps_app_${app.id}_description`);
      if (downloadURLs.some((url) => app.get_link_url.includes(url))) {
        app.get_link_label = res.__("apps_download_link_label");
      } else {
        app.get_link_label = res.__("apps_learn_more_link_label");
      }
    });

    const serverDescription = linkifyUrlsToHtml(
      serverInfo.nodeInfo.metadata.nodeDescription,
      {
        attributes: {
          rel: "noreferrer",
          target: "_blank",
        },
        value: (url) => {
          const urlParsed = new URL(url);
          return (
            urlParsed.host +
            urlParsed.pathname +
            urlParsed.search +
            urlParsed.hash
          );
        },
      },
    );

    try {
      res.render("../views/home.handlebars", {
        supported_languages: JSON.stringify(res.locals.languages),
        translations: res.translations,
        current_locale: currentLocale,
        server_domain: serverInfo.domain,
        server_url: `https://${serverInfo.domain}`,
        server_name: serverInfo.nodeInfo.metadata.nodeName,
        server_description: serverDescription,
        server_thumbnail_url: serverInfo.instance_data?.thumbnail_url,
        server_icon_url: serverInfo.instance_data?.icon_url,
        server_contact_name: serverInfo.instance_data?.contact_name,
        server_contact_username: serverInfo.instance_data?.contact_username,
        server_post_count: serverInfo.nodeInfo?.usage?.localPosts
          ? new Intl.NumberFormat(currentLocale, {
              notation: "compact",
            }).format(serverInfo.nodeInfo.usage.localPosts)
          : null,
        server_user_count: serverInfo.nodeInfo?.usage?.users?.activeMonth
          ? new Intl.NumberFormat(currentLocale, {
              notation: "compact",
            }).format(serverInfo.nodeInfo.usage.users.activeMonth)
          : null,
        recommend: recommendText,
        apps: appList,
        show_one_app: appList.length === 1,
        footer_scripts: process.env.FOOTER_SCRIPTS,
      });
    } catch (error) {
      console.log(error);
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
