module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 按需加载elementui
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
