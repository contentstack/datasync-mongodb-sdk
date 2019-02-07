- .connect()
New method
Use this method, to connect with the DB

- .close()
New method
This method closes the connection with the DB (mongodb-sdk-specific)

- .entry(uid?)
Method functionality updated
Pass entry `uid` that you'd want to find. If the uid is not provided, returns the 1st element found in that content type
Returns `{ entry: { ... } }` OR `{ entry: null }`

- .entries()
New method
Used for querying all entries in the `.contentType({{ uid }})` specified
Note: Call `.contentType({{ uid }})` before calling this method

- .asset(uid?)
Method functionality updated
Pass asset `uid` that you'd want to find. If the uid is not provided, returns the 1st element found in assets
Returns `{ asset: { ... } }` OR `{ asssets: null }`
Note: No need to call `.contentType({{ uid }})` while calling this

- .assets()
New method
Used for querying all assets
Note: No need to call `.contentType({{ uid }})` while calling this

- .schema(uid?)
New method
Method functionality updated
Pass asset `uid` that you'd want to find. If the uid is not provided, returns the 1st element found in content type schemas
Returns `{ content_type: { ... } }` OR `{ content_type: null }`
Note: No need to call `.contentType({{ uid }})` while calling this

- .schemas()
New method
Used for querying all the content type schemas
Note: No need to call `.contentType({{ uid }})` while calling this

- .regex(field, pattern, options?)
Implementation updated
Options field is now optional, by default, it will become `i` i.e. case insensitivity match
Ref. https://docs.mongodb.com/manual/reference/operator/query/regex/

- .where(expr)
Implementation updated
Accepts an expression, instead of 'field' and 'value'
Ref. https://docs.mongodb.com/manual/reference/operator/query/where/index.html

- .count()
New method
Returns only the count of the query filters fired

- .includeReferences()
New method
Returns all entries and their references

- .excludeReferences()
New method
Returns all entries, without any references
Note: Since assets are considered as references, they'll not be evaluated

- .queryReferences(query)
New method
Accepts a query object, which can be used to query on the reference fields
Note: This is a slow method, since it scans all documents and fires the `reference` query on them. Use `.query()` filters to reduce the total no of documents being scanned

- .find()
Implementation updated
Can be used for `.assets()`, `.assets()`, `.entry()`, `.entries()`, `.schema()` and `.schemas()`
By default, if assets are in 'published' state, their json will be attached in entries. Else, the file fields will be either `null` OR `[]`

- .findOne()
Implementation updated
Can be used for `.assets()`, `.assets()`, `.entry()`, `.entries()`, `.schema()` and `.schemas()`
By default, if assets are in 'published' state, their json will be attached in entries. Else, the file fields will be either `null` OR `{}`