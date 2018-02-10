exports.config = {
  buildEs5: true,
  buildStats: true,
  emptyDist: true,
  emptyWWW: true,
  enableCache: true,
  generateDistribution: true,
  generateDocs: false,
  generateWWW: true,
  hydratedCssClass: 'hydrated',
  logLevel: 'info',
  namespace: 'sti',
  serviceWorker: false,
  globalStyle: [
    'src/styles/global.css'
  ],
  copy: {
    statics: {
      src: 'statics/**/**',
      dest: '.'
    },
    images: {
      src: 'images/**/**'
    },
  },
  plugins: [
    require('./plugins/postcss')({
      plugins: [
        require('postcss-url')(),
        require('postcss-cssnext')(),
        require('postcss-reporter')()
      ]
    })
  ]
};
