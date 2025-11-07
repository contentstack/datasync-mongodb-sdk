/**
 * Type definitions for centralized error messages and warnings
 */

export declare const ErrorMessages: {
  readonly INVALID_MONGODB_URI: (uri: any) => string;
  readonly INVALID_DBNAME: string;
  readonly INVALID_ASCENDING_PARAMS: string;
  readonly INVALID_DESCENDING_PARAMS: string;
  readonly INVALID_LANGUAGE_PARAMS: string;
  readonly INVALID_AND_PARAMS: string;
  readonly INVALID_OR_PARAMS: string;
  readonly INVALID_LESSTHAN_PARAMS: string;
  readonly INVALID_LESSTHAN_OR_EQUAL_PARAMS: string;
  readonly INVALID_GREATERTHAN_PARAMS: string;
  readonly INVALID_GREATERTHAN_OR_EQUAL_PARAMS: string;
  readonly INVALID_NOTEQUAL_PARAMS: string;
  readonly INVALID_CONTAINED_IN_PARAMS: string;
  readonly INVALID_NOT_CONTAINED_IN_PARAMS: string;
  readonly INVALID_EXISTS_PARAMS: string;
  readonly INVALID_NOT_EXISTS_PARAMS: string;
  readonly MISSING_CONTENT_TYPE_UID: string;
  readonly MISSING_CONTENT_TYPE_FOR_ENTRY: string;
  readonly MISSING_CONTENT_TYPE_FOR_ENTRIES: string;
  readonly INVALID_LIMIT_VALUE: string;
  readonly INVALID_SKIP_VALUE: string;
  readonly INVALID_ONLY_PARAMS: string;
  readonly INVALID_EXCEPT_PARAMS: string;
  readonly INVALID_REGEX_PARAMS: string;
  readonly INVALID_TAGS_PARAMS: string;
  readonly INVALID_WHERE_PARAMS: string;
  readonly INVALID_QUERY_REFERENCES_PARAMS: string;
  readonly INVALID_INCLUDE_PARAMS: string;
  readonly INVALID_QUERY: string;
  readonly INVALID_QUERIES: string;
};

export declare const WarningMessages: {
  readonly SLOW_INCLUDE_REFERENCES: string;
};

