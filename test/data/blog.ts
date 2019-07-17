export const entries = [
  {
    authors: {
      _content_type_uid: 'author',
      uid: 'a1',
    },
    no: 1,
    // tslint:disable-next-line: object-literal-sort-keys
    _content_type_uid: 'blog',
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
    uid: 'b1',
  },
  {
    _content_type_uid: 'blog',
    uid: 'b2',
    // tslint:disable-next-line: object-literal-sort-keys
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.751Z',
    title: 'Blog Two',
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
  {
    _content_type_uid: 'blog',
    uid: 'b3',
    // tslint:disable-next-line: object-literal-sort-keys
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.755Z',
    title: 'Blog Three',
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
        uid: 'b5',
      },
    ],
    no: 6,
    authors: [
      {
        _content_type_uid: 'author',
        uid: 'a2',
      },
      {
        _content_type_uid: 'author',
        uid: 'a3',
      },
    ],
  },
  {
    _content_type_uid: 'blog',
    uid: 'b9',
    // tslint:disable-next-line: object-literal-sort-keys
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.740Z',
    title: 'Blog Nine',
    authors: {
      _content_type_uid: 'author',
      uid: 'a9',
    },
    no: 2,
  },
  {
    _content_type_uid: 'blog',
    uid: 'b10',
    // tslint:disable-next-line: object-literal-sort-keys
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.730Z',
    title: 'Blog Ten',
    authors: {
      _content_type_uid: 'author',
      uid: 'a10',
    },
    no: 0,
    tags: ['last'],
  },
]
