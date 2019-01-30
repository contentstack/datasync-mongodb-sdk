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
        'data.created_by': number;
        'data.updated_by': number;
        'data.created_at': number;
        'data.updated_at': number;
        'data.publish_details': number;
        'data._version': number;
        '_id': number;
    };
    skip: number;
    uri: string;
};
