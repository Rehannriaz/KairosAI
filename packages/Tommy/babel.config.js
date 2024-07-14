module.exports = {
  "presets": [
    ["@babel/env", {
      "targets": {
        "node": "current"
      }
    }]
  ],
  "plugins": [
    'module-resolver',
    {
      alias: {
        '@/config': './src/config',
        '@/database': './src/database',
        '@/repository': './src/database/repository',
        '@/models': './src/database/models',
        '@/services': './src/services',
        '@/utils': './src/utils'
      },
    },
  ]
}
