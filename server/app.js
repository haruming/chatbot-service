const runtime = require("./runtime");
const app = require("./app");

runtime.init(() => {
  const logger = require("./logger");
  app.bootstrap(() => {
    logger.info("app bootstrap completed.");
  });
}); 