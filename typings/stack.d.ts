/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
export declare class Stack {
    private q;
    private config;
    private contentStore;
    private client;
    private collection;
    private internal;
    private db;
    constructor(stackConfig: any, existingDB?: any);
    ascending(field?: any): this;
    descending(field?: any): this;
    connect(overrides?: {}): Promise<{}>;
    private createIndexes;
    close(): void;
    language(code: any): this;
    and(queries: any): this;
    or(queries: any): this;
    lessThan(key: any, value: any): this;
    lessThanOrEqualTo(key: any, value: any): this;
    greaterThan(key: any, value: any): this;
    greaterThanOrEqualTo(key: any, value: any): this;
    notEqualTo(key: any, value: any): this;
    containedIn(key: any, value: any): this;
    notContainedIn(key: any, value: any): this;
    exists(key: any): this;
    notExists(key: any): this;
    contentType(uid: any): Stack;
    entry(uid?: any): this;
    entries(): this;
    asset(uid?: any): Stack;
    assets(): Stack;
    schema(uid?: any): Stack;
    schemas(): Stack;
    limit(no: any): this;
    skip(no: any): this;
    query(queryObject?: {}): this;
    only(fields: any): this;
    except(fields: any): this;
    regex(field: any, pattern: any, options?: string): this;
    tags(values: any): this;
    where(expr: any): this;
    includeCount(): this;
    includeSchema(): this;
    includeContentType(): this;
    includeReferences(): this;
    excludeReferences(): this;
    queryReferences(query: any): this;
    queryReferencesBeta(query: any): this;
    getQuery(): any;
    include(fields: any): this;
    find(query?: {}): Promise<{}>;
    count(query?: any): Promise<{}>;
    findOne(query?: {}): Promise<{}>;
    private queryOnReferences;
    private preProcess;
    private cleanup;
    private postProcess;
    private includeReferencesI;
    private isPartOfInclude;
    private includeSpecificReferences;
    queryBuilder(query: any, language: any, ct: any): Promise<{}>;
}
