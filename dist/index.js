"use strict";
/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = require("./stack");
class Contentstack {
    static Stack(config, db) {
        return new stack_1.Stack(config, db);
    }
}
exports.Contentstack = Contentstack;
