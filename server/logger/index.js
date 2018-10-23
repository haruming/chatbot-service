const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

const config = require("../config");

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const dailyFileOpts = {
  level: config.log.DailyRotateFile.level,
  dirname: config.log.DailyRotateFile.dirname,
  filename: config.log.DailyRotateFile.filename,
  maxSize: config.log.DailyRotateFile.maxSize,
  maxFiles: config.log.DailyRotateFile.maxFiles,
  colorize: config.log.DailyRotateFile.colorize,
  datePattern: config.log.DailyRotateFile.datePattern,
  handleExceptions: config.log.DailyRotateFile.handleExceptions,
  json: config.log.DailyRotateFile.json
};

const consoleOpts = {
  level: config.log.Console.level,
  handleExceptions: config.log.Console.handleExceptions,
  json: config.log.Console.json,
  colorize: config.log.Console.colorize
};
/**
 * @static winston logger.
 * @since 1.0.0
 */
const logger = createLogger({
  format: combine(label({ label: "chatbot-service" }), timestamp(), myFormat),
  transports: [
    new transports.Console(consoleOpts),
    new DailyRotateFile(dailyFileOpts)
  ],
  exitOnError: false
});

module.exports = logger;