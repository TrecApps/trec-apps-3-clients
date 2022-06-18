const PROXY_CONFIG = {
    "/Review/*": {
      "target": "http://localhost:8082",
      "secure": false,
      "logLevel": "debug",
      "changeOrigin": true,
      "pathRewrite": {"^/Review" : ""}
    },
    "/submit/*": {
      "target": "http://localhost:8081",
      "secure": false,
      "logLevel": "debug",
      "changeOrigin": true,
      "pathRewrite":  function (path, req) {
        let ret = path.replace("/submit/", "/");
        console.log("Rewriting path {} to {}",path, ret);
        return ret;
      }
    },
    "/search/*": {
      "target": "http://localhost:8080",
      "secure": false,
      "logLevel": "debug",
      "changeOrigin": true,
      "pathRewrite": {"^/search" : ""}
    },
    "/resources/*": {
      "target": "http://localhost:8083",
      "secure": false,
      "logLevel": "debug",
      "changeOrigin": true,
      "pathRewrite": {"^/resources" : ""}
    }
  }

module.exports = PROXY_CONFIG;