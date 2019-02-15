export const entries = [
  {
    authors: {
      reference_to: 'author',
      values: ['a1'],
    },
    no: 1,
    content_type_uid: 'product',
    files: {
      reference_to: '_assets',
      values: ['a1', 'a2'],
    },
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.750Z',
    self_reference: {
      reference_to: 'blog',
      values: [
        'b1',
        'b2',
        'b3',
      ],
    },
    single_file: {
      reference_to: '_assets',
      values: 'a1',
    },
    sys_keys: {
      content_type_uid: 'product',
      locale: 'en-us',
      uid: 'p2',
    },
    tags: ['first', 'not-last'],
    title: 'Blog One',
    uid: 'p2',
  },
  {
    content_type_uid: 'product',
    uid: 'p1',
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.751Z',
    title: 'Product Two',
    self_reference: {
      reference_to: 'blog',
      values: [
        'b1',
        'b2',
        'b3',
        'b4',
      ],
    },
    no: 3,
    sys_keys: {
      content_type_uid: 'product',
      locale: 'es-es',
      uid: 'p1',
    },
    authors: {
      reference_to: 'author',
      values: ['a2'],
    },
    tags: ['test']
  },
]
