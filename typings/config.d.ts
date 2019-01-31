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
        '_id': number;
        'data._version': number;
        'data.created_at': number;
        'data.created_by': number;
        'data.publish_details': number;
        'data.updated_at': number;
        'data.updated_by': number;
    };
    skip: number;
    uri: string;
};
