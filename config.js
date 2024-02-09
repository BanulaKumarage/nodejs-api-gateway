const dotenv = require("dotenv");

dotenv.config();
exports.serverPort = 3000;
exports.sessionSecret = process.env.SESSION_SECRET;
exports.proxies = {
  "/api/fake": {
    protected: true,
    target: "http://localhost:3001/",
    changeOrigin: true,
    pathRewrite: {
        [`^/api/fake`]: "/fakeapi",
    },
  },
};