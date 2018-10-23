const _ = require("lodash");
/**
 * @static ResLocalsAccessor for request middlewares data interactions.
 * @since 1.0.0
 */
const ResLocalsAccessor = (module.exports = function(locals) {
  this.locals = locals;
  this.locals.data = this.locals.data || { success: true };
});

ResLocalsAccessor.prototype.writeData = function(data) {
  this.locals.data = _.extend(this.locals.data, data);
};

ResLocalsAccessor.prototype.getData = function(ref) {
  return this.locals.data;
};