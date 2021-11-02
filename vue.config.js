module.exports = {
  runtimeCompiler: true,
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  },
  transpileDependencies: ["vuetify"]
};
