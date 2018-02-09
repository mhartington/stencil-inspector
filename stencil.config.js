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
  copy: {
    statics: {
      src: 'statics/**/**',
      dest: '.'
    },
    images: {
      src: 'images/**/**'
    },
  }
};
