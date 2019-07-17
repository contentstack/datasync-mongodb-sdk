export const entries = [
  {
    authors: {
      _content_type_uid: 'author',
      uid: 'a1',
    },
    no: 1,
    // tslint:disable-next-line: object-literal-sort-keys
    _content_type_uid: 'product',
    files: ['a1', 'a2'],
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.750Z',
    self_reference: [
      {
        _content_type_uid: 'blog',
        uid: 'b1',
      },
      {
        _content_type_uid: 'blog',
        uid: 'b2',
      },
      {
        _content_type_uid: 'blog',
        uid: 'b3',
      },
    ],
    single_file: 'a1',
    tags: ['first', 'not-last'],
    title: 'Blog One',
    uid: 'p2',
  },
  {
    _content_type_uid: 'product',
    uid: 'p1',
    // tslint:disable-next-line: object-literal-sort-keys
    locale: 'es-es',
    published_at: '2019-01-25T11:47:50.751Z',
    title: 'Product Two',
    self_reference: [
      {
        _content_type_uid: 'blog',
        uid: 'b1',
      },
      {
        _content_type_uid: 'blog',
        uid: 'b2',
      },
      {
        _content_type_uid: 'blog',
        uid: 'b3',
      },
      {
        _content_type_uid: 'blog',
        uid: 'b4',
      },
    ],
    no: 3,
    authors: {
      _content_type_uid: 'author',
      uid: 'a2',
    },
    tags: ['test'],
  },
]
