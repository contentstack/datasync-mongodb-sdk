export declare const config: {
    collectionName: string;
    dbName: string;
    limit: number;
    locales: {
        code: string;
        relative_url_prefix: string;
    }[];
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
        created_by: number;
        updated_by: number;
        created_at: number;
        updated_at: number;
    };
    skip: number;
    uri: string;
};
