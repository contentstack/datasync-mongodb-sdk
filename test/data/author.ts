export const entries = [
  {
    age: 1,
    blogs: {
      reference_to: 'blog',
      values: ['b1', 'b2', 'b3']
    },
    content_type_uid: 'author',
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.750Z',
    self_reference: {
      reference_to: 'author',
      values: [
        'a1',
        'a2',
        'a3',
      ],
    },
    sys_keys: {
      content_type_uid: 'author',
      locale: 'en-us',
      uid: 'a1',
    },
    title: 'author One',
    uid: 'a1',
  },
  {
    age: 2,
    alive: true,
    blogs: {
      reference_to: 'blog',
      values: ['b1', 'b2', 'b3'],
    },
    content_type_uid: 'author',
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.751Z',
    self_reference: {
      reference_to: 'author',
      values: [
        'a1',
        'a2',
        'a3',
        'a4',
      ],
    },
    sys_keys: {
      content_type_uid: 'author',
      locale: 'en-us',
      uid: 'a2',
    },
    tags: ['1'],
    title: 'author Two',
    uid: 'a2',
  },
  {
    content_type_uid: 'author',
    uid: 'a3',
    age: 3,
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.752Z',
    title: 'author Three',
    self_reference: {
      reference_to: 'author',
      values: [
        'a1',
        'a2',
        'a3',
        'a5'
      ]
    },
    sys_keys: {
      content_type_uid: 'author',
      locale: 'en-us',
      uid: 'a3',
    },
    tags: ['2', '3'],
    blogs: {
      reference_to: 'blog',
      values: ['b1', 'b2', 'b3']
    },
  },
  {
    content_type_uid: 'author',
    uid: 'a9',
    age: 9,
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.755Z',
    sys_keys: {
      content_type_uid: 'author',
      locale: 'en-us',
      uid: 'a9',
    },
    title: 'author nine',
    tags: ['8'],
    category: {
      reference_to: 'category',
      values: 'c1',
    },
  },
  {
    content_type_uid: 'author',
    uid: 'a10',
    age: 10,
    locale: 'en-us',
    published_at: '2019-01-25T11:47:50.760Z',
    sys_keys: {
      content_type_uid: 'author',
      locale: 'en-us',
      uid: 'a10',
    },
    title: 'author ten',
    tags: ['10'],
    category: {
      reference_to: 'category',
      values: 'c2',
    },
  },
]
