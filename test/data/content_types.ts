export const content_types = [
  {
    content_type_uid: '_content_types',
    published_at: '2019-02-07T14:52:37.617Z',
    schema: [
      {
        'display_name' : 'Title',
        'uid' : 'title',
        'data_type' : 'text',
        'mandatory' : true,
        'unique' : true,
        'field_metadata' : {
          '_default' : true,
        },
        'multiple' : false,
      },
      {
        'display_name' : 'URL',
        'uid' : 'url',
        'data_type' : 'text',
        'mandatory' : false,
        'field_metadata' : {
          '_default' : true,
        },
        'multiple' : false,
        'unique' : false,
      },
    ],
    sys_keys: {
      content_type_uid : '_content_types',
      uid: 'blog',
    },
    title: 'Blog',
    uid: 'blog',
    references: {
      authors: 'author',
      self_reference: 'blog'
    }
  },
  {
    content_type_uid: '_content_types',
    published_at: '2019-02-07T14:52:37.618Z',
    schema: [
      {
        'display_name' : 'Title',
        'uid' : 'title',
        'data_type' : 'text',
        'mandatory' : true,
        'unique' : true,
        'field_metadata' : {
          '_default' : true,
        },
        'multiple' : false,
      },
      {
        'display_name' : 'URL',
        'uid' : 'url',
        'data_type' : 'text',
        'mandatory' : false,
        'field_metadata' : {
          '_default' : true,
        },
        'multiple' : false,
        'unique' : false,
      },
    ],
    sys_keys: {
      content_type_uid : '_content_types',
      uid: 'author',
    },
    title: 'Author',
    uid: 'author',
    references: {
      blogs: 'blog',
      self_reference: 'author'
    }
  },
  {
    content_type_uid: '_content_types',
    published_at: '2019-02-07T14:52:37.616Z',
    schema: [
      {
        'display_name' : 'Title',
        'uid' : 'title',
        'data_type' : 'text',
        'mandatory' : true,
        'unique' : true,
        'field_metadata' : {
          '_default' : true,
        },
        'multiple' : false,
      },
      {
        'display_name' : 'URL',
        'uid' : 'url',
        'data_type' : 'text',
        'mandatory' : false,
        'field_metadata' : {
          '_default' : true,
        },
        'multiple' : false,
        'unique' : false,
      },
    ],
    sys_keys: {
      content_type_uid : '_content_types',
      uid: 'category',
    },
    title: 'Category',
    uid: 'category',
  },
]
