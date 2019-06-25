/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
export declare const config: {
    contentStore: {
        collection: {
            entry: string;
            asset: string;
            schema: string;
        };
        dbName: string;
        indexes: {
            event_at: number;
            _content_type_uid: number;
            locale: number;
            uid: number;
        };
        internalContentTypes: {
            content_types: string;
            assets: string;
        };
        limit: number;
        locale: string;
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
            _content_type_uid: number;
            _synced_at: number;
            app_user_object_uid: number;
            created_at: number;
            updated_at: number;
            updated_by: number;
        };
        skip: number;
        uri: string;
    };
};
