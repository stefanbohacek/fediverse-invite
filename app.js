import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import Handlebars from "handlebars";
import { engine } from "express-handlebars";

import indexRoute from "./routes/index.js";

Handlebars.registerHelper("ifEquals", (firstArg, secondArg, options) => {
  return firstArg === secondArg ? options.fn(this) : options.inverse(this);
});

const app = express();

app.enable("view cache");
app.use(compression());
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.headers["accept-language"]) {
    req.headers["accept-language"] =
      req.headers["accept-language"].toLowerCase();
  }
  next();
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use("/", indexRoute);

export default app;
