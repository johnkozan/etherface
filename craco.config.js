const path = require("path");

module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        "\\.(css|sass)$": "identity-obj-proxy",
      },
    }
  }
};
