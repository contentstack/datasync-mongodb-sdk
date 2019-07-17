export const config = {
  contentStore: {
    collection: {
      asset: 'contents',
      entry: 'contents',
      schema: 'content_types',
    },
    dbName: 'sync-test',
  },
  locales: [
    {
      code: 'en-us',
      relative_url_prefix: '/',
    },
    {
      code: 'es-es',
      relative_url_prefix: '/es/',
    },
  ],
}
