const config = {
  app: {
    addr: '127.0.0.1',
    port: 8000,
    secret: "secret"
  },
  db: {
    url: 'sjnitapp20.sjn.its.paypalcorp.com',
    port: '27017',
    dbName: 'chatbot_db'
  },
  watson: {
    url: '',
    port: ''
  },
  log: {
    DailyRotateFile: {
      enabled: true,
      level: "info",
      filename: "mon-%DATE%.log",
      handleExceptions: true,
      dirname: "./logs",
      maxSize: "20m",
      maxFiles: "15d",
      datePattern: "YYYY-MM-DD",
      json: true,
      colorize: false
    },
    Console: {
      enabled: true,
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true
    }
  },
};

module.exports = config;