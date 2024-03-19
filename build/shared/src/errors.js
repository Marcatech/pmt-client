"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PmtError = void 0;
class PmtError extends Error {
    constructor(type, ...data) {
        super(type);
        this.type = type;
        this.data = data;
    }
}
exports.PmtError = PmtError;
