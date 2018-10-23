const httpHelper = require('../../http/httpHelper');
const config = require('../../config');
/** 
 * @module biz/waston
 */
/**
 * @since 1.0.0
 * @static
 * @method getAnswer
 * @description `post`
 */
module.exports.getAnswer = {
  method: "post",
  middlewares: [
    async (req, res, next) => {
      try {
        const data = await httpHelper.post(config.watson.url + "get_answer", {
          intents: req.body.intents || "",
        });
        if (data) {
          res.$local.writeData({ ...data });
          next();
        }
      } catch(e) {
        console.log(e.response);
        res.json({ err: "upload intents service Error" });
      }
    }
  ]
};