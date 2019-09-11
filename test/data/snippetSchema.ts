export const schema = {
    _content_type_uid: '_content_types',
    title: 'snippets',
    uid: 'snippets',
    _version: 1,
    schema: [{
        display_name: 'Title',
        uid: 'title',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory: true,
        unique: true,
        field_metadata: {
          _default: true,
        },
        multiple: false,
      },
      {
        display_name: 'URL',
        uid: 'url',
        // tslint:disable-next-line: object-literal-sort-keys
        data_type: 'text',
        mandatory: false,
        field_metadata: {
          _default: true,
        },
        multiple: false,
        unique: false,
      },
      {
        data_type: 'snippet',
        display_name: 'Snippet',
        reference_to: 'blt981fee3f999f3c12',
        field_metadata: {
          description: ''
        },
        uid: 'snippet_test',
        multiple: true,
        max_instance: 50,
        mandatory: false,
        unique: false,
        non_localizable: false,
        schema: [{
            display_name: 'Name',
            uid: 'name',
            data_type: 'text',
            multiple: false,
            mandatory: false,
            unique: false,
            non_localizable: false,
            indexed: false,
            inbuilt_model: false
          },
          {
            data_type: 'text',
            display_name: 'Rich text editor',
            uid: 'description',
            field_metadata: {
              allow_rich_text: true,
              description: "",
              multiline: false,
              rich_text_type: 'advanced',
              options: [],
              version: 3
            },
            multiple: false,
            mandatory: false,
            unique: false,
            non_localizable: false,
            indexed: false,
            inbuilt_model: false
          },
          {
            data_type: 'file',
            display_name: 'File',
            uid: 'file',
            extensions: [],
            field_metadata: {
              description: '',
              rich_text_type: 'standard'
            },
            multiple: false,
            mandatory: false,
            unique: false,
            non_localizable: false
          }
        ]
      },
      {
        data_type: 'file',
        display_name: 'File',
        uid: 'file',
        extensions: [],
        field_metadata: {
          description: '',
          rich_text_type: 'standard'
        },
        multiple: false,
        mandatory: false,
        unique: false,
        non_localizable: false
      }

    ],
    _assets: {
      'snippet_test.img': '_assets',
      file: '_assets'
    },
    _references: {}
  }