// tslint:disable-next-line: variable-name
export const content_types = [
  {
    _content_type_uid: '_content_types',
    locale: 'en-us',
    published_at: '2019-02-07T14:52:37.617Z',
    schema: [
      {
        display_name : 'Title',
        uid : 'title',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory : true,
        unique : true,
        field_metadata : {
          _default : true,
        },
        multiple : false,
      },
      {
        display_name : 'URL',
        uid : 'url',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory : false,
        field_metadata : {
          _default : true,
        },
        multiple : false,
        unique : false,
      },
    ],
    title: 'Blog',
    uid: 'blog',
    // tslint:disable-next-line: object-literal-sort-keys
    _references: {
      authors: 'author',
      self_reference: 'blog',
    },
    _assets: {
      single_file: '_assets',
    },
  },
  {
    _content_type_uid: '_content_types',
    locale: 'en-us',
    published_at: '2019-02-07T14:52:37.618Z',
    schema: [
      {
        display_name : 'Title',
        uid : 'title',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory : true,
        unique : true,
        field_metadata : {
          _default : true,
        },
        multiple : false,
      },
      {
        display_name : 'URL',
        uid : 'url',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory : false,
        field_metadata : {
          _default : true,
        },
        multiple : false,
        unique : false,
      },
    ],
    title: 'Author',
    uid: 'author',
    // tslint:disable-next-line: object-literal-sort-keys
    references: {
      blogs: 'blog',
      category: 'category',
      self_reference: 'author',
    },
    _assets: {

    },
  },
  {
    _content_type_uid: '_content_types',
    locale: 'en-us',
    published_at: '2019-02-07T14:52:37.616Z',
    schema: [
      {
        display_name : 'Title',
        uid : 'title',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory : true,
        unique : true,
        field_metadata : {
          _default : true,
        },
        multiple : false,
      },
      {
        display_name : 'URL',
        uid : 'url',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory : false,
        field_metadata : {
          _default : true,
        },
        multiple : false,
        unique : false,
      },
    ],
    title: 'Category',
    uid: 'category',
    // tslint:disable-next-line: object-literal-sort-keys
    _references: {},
    _assets: {},
  },
  {
    _content_type_uid: '_content_types',
    locale: 'en-us',
    published_at: '2019-02-07T14:52:37.616Z',
    schema: [
      {
        display_name : 'Title',
        uid : 'title',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory : true,
        unique : true,
        field_metadata : {
          _default : true,
        },
        multiple : false,
      },
      {
        display_name : 'URL',
        uid : 'url',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory : false,
        field_metadata : {
          _default : true,
        },
        multiple : false,
        unique : false,
      },
    ],
    title: 'Products',
    uid: 'products',
    // tslint:disable-next-line: object-literal-sort-keys
    _references: {
      authors: 'author',
      self_reference: 'blog',
    },
    _assets: {
      files: '_assets',
      single_file: '_assets',
    },
  },
]
