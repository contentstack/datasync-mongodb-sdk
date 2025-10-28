/**
 * Centralized error messages and warnings for the DataSync MongoDB SDK
 * This file contains all user-facing messages for consistency and maintainability
 */

export const ErrorMessages = {
  // Configuration errors
  INVALID_MONGODB_URI: (uri: any) => `MongoDB connection URL: ${uri} must be of type string`,
  INVALID_DBNAME: 'Content store dbName should be of type string and not empty',

  // Sorting errors
  INVALID_ASCENDING_PARAMS: 'Invalid parameters for .ascending(). Expected a valid string field name',
  INVALID_DESCENDING_PARAMS: 'Invalid parameters for .descending(). Expected a valid string field name',

  // Language errors
  INVALID_LANGUAGE_PARAMS: 'Invalid parameters for .language(). Expected a valid language code string',

  // Logical operator errors
  INVALID_AND_PARAMS: 'Invalid parameters for .and(). Expected an array of query objects',
  INVALID_OR_PARAMS: 'Invalid parameters for .or(). Expected an array of query objects',

  // Comparison operator errors
  INVALID_LESSTHAN_PARAMS: 'Invalid key or value parameters for .lessThan(). Expected a string key and a value',
  INVALID_LESSTHAN_OR_EQUAL_PARAMS: 'Invalid key or value parameters for .lessThanOrEqualTo(). Expected a string key and a value',
  INVALID_GREATERTHAN_PARAMS: 'Invalid key or value parameters for .greaterThan(). Expected a string key and a value',
  INVALID_GREATERTHAN_OR_EQUAL_PARAMS: 'Invalid key or value parameters for .greaterThanOrEqualTo(). Expected a string key and a value',
  INVALID_NOTEQUAL_PARAMS: 'Invalid key or value parameters for .notEqualTo(). Expected a string key and a value',
  INVALID_CONTAINED_IN_PARAMS: 'Invalid key or value parameters for .containedIn(). Expected a string key and an array value',
  INVALID_NOT_CONTAINED_IN_PARAMS: 'Invalid key or value parameters for .notContainedIn(). Expected a string key and an array value',
  INVALID_EXISTS_PARAMS: 'Invalid key parameter for .exists(). Expected a valid string field name',
  INVALID_NOT_EXISTS_PARAMS: 'Invalid key parameter for .notExists(). Expected a valid string field name',

  // Content type errors
  MISSING_CONTENT_TYPE_UID: 'Content type UID is required. Please provide a valid content type UID',
  MISSING_CONTENT_TYPE_FOR_ENTRY: 'Please call .contentType() before .entry()',
  MISSING_CONTENT_TYPE_FOR_ENTRIES: 'Please call .contentType() before .entries()',

  // Pagination errors
  INVALID_LIMIT_VALUE: 'Invalid value for .limit(). Expected a positive numeric value',
  INVALID_SKIP_VALUE: 'Invalid value for .skip(). Expected a non-negative numeric value',

  // Projection errors
  INVALID_ONLY_PARAMS: 'Invalid field values for .only(). Expected a non-empty array of field names',
  INVALID_EXCEPT_PARAMS: 'Invalid field values for .except(). Expected a non-empty array of field names',

  // Query errors
  INVALID_REGEX_PARAMS: 'Invalid field or pattern parameters for .regex(). Expected string values for both field and pattern',
  INVALID_TAGS_PARAMS: 'Invalid field values for .tags(). Expected an array of tag values',
  INVALID_WHERE_PARAMS: 'Invalid expression for .where(). Expected a valid expression or function',
  INVALID_QUERY_REFERENCES_PARAMS: 'Invalid query object for .queryReferences(). Expected a valid query object',
  INVALID_INCLUDE_PARAMS: 'Invalid reference field path for .include(). Expected a valid string or array of strings',

  // Query validation errors
  INVALID_QUERY: 'Invalid query provided. Please ensure your query is properly formatted',
  INVALID_QUERIES: 'Invalid queries provided. Please ensure all queries are properly formatted',
} as const

export const WarningMessages = {
  // Performance warnings
  SLOW_INCLUDE_REFERENCES: '.includeReferences(...) is a relatively slow query. Consider limiting the depth or using .include() for specific references',
} as const

