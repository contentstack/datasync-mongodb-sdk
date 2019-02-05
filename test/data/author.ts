export const entries = [
  {
    age: 1,
    blogs: {
      reference_to: 'blog',
      values: ['b1', 'b2', 'b3']
    },
    content_type_uid: 'author',
    locale: 'en-us',
    self_reference: {
      reference_to: 'author',
      values: [
        'a1',
        'a2',
        'a3',
      ],
    },
    title: 'author One',
    uid: 'a1',
  },
  {
    content_type_uid: 'author',
    uid: 'a2',
    locale: 'en-us',
    alive: true,
    title: 'author Two',
    age: 2,
    self_reference: {
      reference_to: 'author',
      values: [
        'a1',
        'a2',
        'a3',
        'a4'
      ]
    },
    tags: ['1'],
    blogs: {
      reference_to: 'blog',
      values: ['b1', 'b2', 'b3']
    }
  },
  {
    content_type_uid: 'author',
    uid: 'a3',
    age: 3,
    locale: 'en-us',
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
    tags: ['2', '3'],
    blogs: {
      reference_to: 'blog',
      values: ['b1', 'b2', 'b3']
    }
  },
  {
    content_type_uid: 'author',
    uid: 'a9',
    age: 9,
    locale: 'en-us',
    title: 'author nine',
    tags: ['8'],
    category: {
      reference_to: 'category',
      values: ['c1']
    }
  },
  {
    content_type_uid: 'author',
    uid: 'a10',
    age: 10,
    locale: 'en-us',
    title: 'author ten',
    tags: ['10'],
    category: {
      reference_to: 'category',
      values: ['c2']
    }
  }
]