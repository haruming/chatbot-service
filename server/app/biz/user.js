/** 
 * @module biz/user
 */
/**
 * @since 1.0.0
 * @static
 * @method userInfo
 * @description `get`
 */
module.exports.userInfo = {
  method: "get",
  middlewares: [
    (req, res, next) => {
      if (req.user) {
        // res.json({ userInfo: req.user });
        res.$locals.writeData({ userInfo: req.user});
        next();
      } else {
        next(new Error("Login session expired."));
      }
    }
  ]
};