/*!
 * Contentstack DataSync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
export declare const config: {
    contentStore: {
        collection: {
            asset: string;
            entry: string;
            schema: string;
        };
        dbName: string;
        indexes: {
            _content_type_uid: number;
            locale: number;
            uid: number;
            updated_at: number;
        };
        internal: {
            types: {
                assets: string;
                content_types: string;
                references: string;
            };
        };
        limit: number;
        locale: string;
        options: {
            connectTimeoutMS: number;
            noDelay: boolean;
            useNewUrlParser: boolean;
        };
        projections: {
            _content_type_uid: number;
            _id: number;
        };
        referenceDepth: number;
        skip: number;
        url: string;
    };
};
