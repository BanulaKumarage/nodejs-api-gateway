const cors = require("cors");
const express = require("express");
const session = require("express-session");
const routers = require("./routes");
const middleware = require("./middleware");
const expressWinston = require("express-winston");
const helmet = require("helmet");
const { createProxyMiddleware } = require("http-proxy-middleware");
const winston = require("winston");
const config = require("./config");

const app = express();
const port = config.serverPort;
const secret = config.sessionSecret;
const store = new session.MemoryStore();

const alwaysAllow = (_1, _2, next) => {
  next();
};

const protect = middleware.protect;

app.disable("x-powered-by");

app.use(helmet());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    statusLevels: true,
    meta: false,
    level: "debug",
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);

app.use(cors());

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true,
    store,
  })
);

app.use('/', routers);

Object.keys(config.proxies).forEach((path) => {
  const { protected, ...options } = config.proxies[path];
  const check = protected ? protect : alwaysAllow;
  app.use(path, check, createProxyMiddleware(options));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
