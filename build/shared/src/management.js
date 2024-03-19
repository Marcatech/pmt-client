"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const constants_1 = require("./constants");
const shell_1 = require("./shell");
const errors_1 = require("./errors");
class Management {
    constructor(options) {
        this.options = options;
    }
    getClient() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client)
                return this.client;
            yield (0, env_1.setManagementEnv)();
            let PrismaClient;
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.PrismaClient) {
                PrismaClient = (_b = this.options) === null || _b === void 0 ? void 0 : _b.PrismaClient;
            }
            else {
                try {
                    PrismaClient = (0, shell_1.requireDistant)(constants_1.clientManagementPath).PrismaClient;
                }
                catch (_c) {
                    console.error(`\nError: Cannot find module '.prisma-multi-tenant/management'.\n\nTry running "prisma-multi-tenant generate"\n`);
                    process.exit(1);
                }
            }
            this.client = new PrismaClient(Object.assign({}, this.options));
            return this.client;
        });
    }
    create(tenant) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            try {
                return yield client.tenant.create({
                    data: tenant,
                });
            }
            catch (err) {
                if (err.code == 'P2002')
                    throw new errors_1.PmtError('tenant-already-exists', tenant.name);
                throw err;
            }
        });
    }
    read(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            const tenant = yield client.tenant.findOne({ where: { name } });
            if (!tenant) {
                throw new errors_1.PmtError('tenant-does-not-exist', name);
            }
            return this.sanitizeTenant(tenant);
        });
    }
    exists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            const tenant = yield client.tenant.findOne({ where: { name } });
            return !!tenant;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            const tenants = yield client.tenant.findMany();
            return tenants.map(this.sanitizeTenant);
        });
    }
    update(name, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            try {
                return yield client.tenant.update({
                    where: { name },
                    data: update,
                });
            }
            catch (err) {
                if (err.message.includes('RecordNotFound'))
                    throw new errors_1.PmtError('tenant-does-not-exist', name);
                throw err;
            }
        });
    }
    delete(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            try {
                return yield client.tenant.delete({ where: { name } });
            }
            catch (err) {
                if (err.message.includes('RecordNotFound'))
                    throw new errors_1.PmtError('tenant-does-not-exist', name);
                throw err;
            }
        });
    }
    disconnect() {
        if (!this.client)
            return Promise.resolve();
        return this.client.$disconnect();
    }
    sanitizeTenant(tenant) {
        return {
            name: tenant.name,
            url: tenant.url,
        };
    }
}
exports.default = Management;
