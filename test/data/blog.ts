export const entries = [
  {
    authors: {
      reference_to: 'author',
      values: ['a1'],
    },
    content_type_uid: 'blog',
    files: {
      reference_to: '_assets',
      values: ['a1', 'a2'],
    },
    locale: 'en-us',
    single_file: {
      reference_to: '_assets',
      values: 'a1',
    },
    self_reference: {
      reference_to: 'blog',
      values: [
        'b1',
        'b2',
        'b3',
      ],
    },
    title: 'Blog One',
    uid: 'b1',
  },
  {
    content_type_uid: 'blog',
    uid: 'b2',
    locale: 'en-us',
    title: 'Blog Two',
    self_reference: {
      reference_to: 'blog',
      values: [
        'b1',
        'b2',
        'b3',
        'b4'
      ]
    },
    authors: {
      reference_to: 'author',
      values: ['a2']
    }
  },
  {
    content_type_uid: 'blog',
    uid: 'b3',
    locale: 'en-us',
    title: 'Blog Three',
    self_reference: {
      reference_to: 'blog',
      values: [
        'b1',
        'b2',
        'b3',
        'b5'
      ]
    },
    authors: {
      reference_to: 'author',
      values: ['a3', 'a2']
    }
  },
  {
    content_type_uid: 'blog',
    uid: 'b9',
    locale: 'en-us',
    title: 'Blog Nine',
    authors: {
      reference_to: 'author',
      values: ['a9']
    }
  },
  {
    content_type_uid: 'blog',
    uid: 'b10',
    locale: 'en-us',
    title: 'Blog Ten',
    authors: {
      reference_to: 'author',
      values: ['a10']
    }
  }
]