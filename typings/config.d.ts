/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
export declare const config: {
    contentStore: {
        collectionName: string;
        dbName: string;
        indexes: {
            content_type_uid: number;
            locale: number;
            uid: number;
        };
        limit: number;
        locales: any[];
        options: {
            autoReconnect: boolean;
            connectTimeoutMS: number;
            keepAlive: boolean;
            noDelay: boolean;
            reconnectInterval: number;
            reconnectTries: number;
            useNewUrlParser: boolean;
        };
        projections: {
            _id: number;
            _version: number;
            content_type_uid: number;
            created_at: number;
            sys_keys: number;
            updated_at: number;
            updated_by: number;
        };
        skip: number;
        uri: string;
    };
};
