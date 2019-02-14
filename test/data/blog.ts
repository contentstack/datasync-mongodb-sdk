export const entries = [
  {
    authors: {
      reference_to: 'author',
      values: ['a1'],
    },
    no: 1,
    content_type_uid: 'blog',
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
      content_type_uid: 'blog',
      locale: 'en-us',
      uid: 'b1',
    },
    tags: ['first', 'not-last'],
    title: 'Blog One',
    uid: 'b1',
  },
  {
    content_type_uid: 'blog',
    uid: 'b2',
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.751Z',
    title: 'Blog Two',
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
      content_type_uid: 'blog',
      locale: 'en-us',
      uid: 'b1',
    },
    authors: {
      reference_to: 'author',
      values: ['a2'],
    },
    tags: ['test']
  },
  {
    content_type_uid: 'blog',
    uid: 'b3',
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.755Z',
    title: 'Blog Three',
    self_reference: {
      reference_to: 'blog',
      values: [
        'b1',
        'b2',
        'b3',
        'b5',
      ],
    },
    no: 6,
    authors: {
      reference_to: 'author',
      values: ['a3', 'a2'],
    },
    sys_keys: {
      content_type_uid: 'blog',
      locale: 'en-us',
      uid: 'b1',
    },
  },
  {
    content_type_uid: 'blog',
    uid: 'b9',
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.740Z',
    title: 'Blog Nine',
    authors: {
      reference_to: 'author',
      values: ['a9'],
    },
    no: 2,
    sys_keys: {
      content_type_uid: 'blog',
      locale: 'en-us',
      uid: 'b1',
    },
  },
  {
    content_type_uid: 'blog',
    uid: 'b10',
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.730Z',
    title: 'Blog Ten',
    authors: {
      reference_to: 'author',
      values: ['a10'],
    },
    no: 0,
    sys_keys: {
      content_type_uid: 'blog',
      locale: 'en-us',
      uid: 'b1',
    },
    tags: ['last']
  },
]
