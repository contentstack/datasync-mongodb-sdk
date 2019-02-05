/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
export declare const config: {
    collectionName: string;
    dbName: string;
    limit: number;
    locales: any[];
    options: {
        autoReconnect: boolean;
        connectTimeoutMS: number;
        keepAlive: boolean;
        noDelay: boolean;
        reconnectInterval: number;
        reconnectTries: number;
        userNewUrlParser: boolean;
    };
    projections: {
        _id: number;
        _version: number;
        created_at: number;
        sys_keys: number;
        updated_at: number;
        updated_by: number;
    };
    skip: number;
    uri: string;
};
