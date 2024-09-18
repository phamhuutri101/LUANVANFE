const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "/",
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000/",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
});
