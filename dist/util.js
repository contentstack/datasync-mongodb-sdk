"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.append = (field) => {
    return `data.${field}`;
};
exports.validateURI = (uri) => {
    if (typeof uri !== 'string' || uri.length === 0) {
        throw new Error(`Mongodb connection url: ${uri} must be of type string`);
    }
    return uri;
};
//# sourceMappingURL=util.js.map