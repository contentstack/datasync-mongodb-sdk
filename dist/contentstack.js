"use strict";
/*!
 * Contentstack Sync Mongodb SDK
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = require("./stack");
class Contentstack {
    Stack(...args) {
        return new stack_1.Stack(...args);
    }
}
module.exports = new Contentstack();
