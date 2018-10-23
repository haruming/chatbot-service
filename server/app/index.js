// ---------------------------- Init Project -----------------------------------↓
const express = require("express");
const config = require("../config");
const db = require("../runtime/db");
const logger = require("../logger");
// ---------------------------- Mongoose Schema --------------------------------↓
/**
 * Bootstrap chatbot app service
 * @param {*} next
 * Following steps:
 * 1. Middleware vendoring.
 * 2. BIZ interfaces.
 * 3. Mongoose restify interfaces.
 * 4. Error handling.
 */
module.exports.bootstrap = next => {
  const app = express();
  _vendorMiddlewares(app);
  _appMiddlewares(app);
  _biz(app);
  _rest(app);
  _errHandler(app);
  app.listen(config.app.port);
  next();
};

const _vendorMiddlewares = app => {
  const session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    responseTime = require("response-time"),
    methodOverride = require("method-override"),
    config = require("../config");

  app.use(responseTime());
  // CORS
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );

  app.use(methodOverride());
  // Cookie parser
  // app.use(cookieParser(config.app.secret));
  // Session
  app.use(
    session({
      secret: config.app.secret,
      cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000
      },
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        url: db.url,
        ttl: 365 * 24 * 60 * 60 // = 365 days
      })
    })
  );
  // Body parser
  app.use(
    bodyParser.json({
      limit: "50mb"
    })
  );
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true
    })
  );
};

const _appMiddlewares = app => {
  // inject accessors
  const localsAccessor = require("./accessors/localAccessor");
  // log every api request
  app.use((req, res, next) => {
    logger.info(`in ${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body,
      ip: req.header("X-Real-IP") || req.connection.remoteAddress,
      session: req.session
    });
    next();
  });
  // prepare the output
  app.use((req, res, next) => {
    req.$injection = {};
    res.locals = {};
    res.$locals = new localsAccessor(res.locals);
    next();
  });
};

const _biz = app => {
  const router = express.Router();
  const biz = require("./biz");

  const output = (req, res) => {
    res.json(res.$locals.getData());
  };
  for (let categoryName in biz) {
    const category = biz[categoryName];
    for (let apiName in category) {
      const api = category[apiName];
      router[api.method](
        `/${categoryName}/${apiName}${api.wildcard ? "/*" : ""}`,
        api.middlewares,
        api.output || output
      );
    }
  }
  app.use("/services/biz", router);
};

const _rest = app => {
  const restify = require("express-restify-mongoose");

  const router = express.Router();
  const restifyOption = {
    prefix: '/rest',
    version: "",
    // Whether to use .findOneAndUpdate() or .findById() and then .save(), allowing document middleware to be called. For more information regarding mongoose middleware, read the docs.
    findOneAndUpdate: false,
    findOneAndRemove: false
  };
  restify.defaults(restifyOption);
  const rest = require("./rest");
  for (let categoryName in rest) {
    const category = rest[categoryName];
    category.options = category.options || {};
    category.options.name = category.options.name || categoryName;
    restify.serve(router, category.model, category.options);
  }
  app.use("/services", router);
};

const _errHandler = app => {
  app.use((err, req, res, next) => {
    const json = { message: err.message };
    if (err instanceof Error) {
      json.message = err.message;
      json.stacks = err.stack.split("\n");
    } else {
      json.message = err;
    }
    // Log
    logger.error(`err ${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body,
      ip: req.header("X-Real-IP") || req.connection.remoteAddress,
      session: req.session,
      err: json
    });
    res.json({ err: json });
  });
};