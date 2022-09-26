module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete('svg')
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            "vue-loader-v16",
            "vue-svg-loader"  
          ]
        }
      ]
    }
  }
}