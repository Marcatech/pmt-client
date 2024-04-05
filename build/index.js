"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePrismaManagement = exports.MultiTenant = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const defaultMultiTenantOptions = {
    useManagement: true,
};
class MultiTenant {
    constructor(options) {
        this.options = Object.assign(Object.assign({}, defaultMultiTenantOptions), options);
        this.loadEnv();
        this.ClientTenant = this.requireTenant();
        if (this.options.useManagement) {
            this.management = new prisma_multi_tenant_shared_updated_1.Management({ PrismaClient: this.options.PrismaClientManagement });
        }
        this.tenants = {};
    }
    loadEnv() {
        try {
            const envFile = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'prisma/.env'), 'utf-8');
            const envVars = envFile
                .split(/\n/g)
                .map((l) => l.trim())
                .filter((l) => !(l == '' || l.startsWith('#')))
                .map((l) => l
                .split('=')
                .map((s) => s.trim())
                .slice(0, 2));
            envVars.forEach(([key, val]) => {
                if (!process.env[key]) {
                    process.env[key] = val;
                }
            });
        }
        catch (_a) {
        }
    }
    requireTenant() {
        if (this.options.PrismaClient) {
            return this.options.PrismaClient;
        }
        return (0, prisma_multi_tenant_shared_updated_1.requireDistant)(`@prisma/client`).PrismaClient;
    }
    isCliAvailable(method) {
        try {
            require('@prisma/cli');
        }
        catch (_a) {
            if (!process.env.PMT_TEST) {
                throw new Error(`@prisma/cli needs to be installed in order to use this MultiTenant.${method}(), but it doesn't seem to be present. Did you forget to install it?`);
            }
        }
        return true;
    }
    async get(name, options) {
        if (this.tenants[name])
            return this.tenants[name];
        if (!this.management) {
            throw new Error('Cannot use .get(name) on an unknown tenant with `useManagement: false`');
        }
        const tenant = await this.management.read(name);
        if (!tenant) {
            throw new Error(`The tenant with the name "${name}" does not exist`);
        }
        return this.directGet(tenant, options);
    }
    async directGet(tenant, options) {
        process.env.DATABASE_URL = tenant.url;
        const client = new this.ClientTenant(Object.assign(Object.assign({}, this.options.tenantOptions), options));
        client._meta = {
            name: tenant.name,
        };
        this.tenants[tenant.name] = client;
        return client;
    }
    async createTenant(tenant, options) {
        if (!this.management) {
            throw new Error('Cannot use .createTenant(tenant, options) with `useManagement: false`');
        }
        if (tenant.name == 'management') {
            throw new Error('The name "management" is reserved. You cannot use it for a tenant.');
        }
        this.isCliAvailable('createTenant');
        await this.management.create(tenant);
        await (0, prisma_multi_tenant_shared_updated_1.runDistantPrisma)('migrate dev', tenant, false);
        return this.directGet(tenant, options);
    }
    async deleteTenant(name) {
        if (!this.management) {
            throw new Error('Cannot use .deleteTenant(name) with `useManagement: false`');
        }
        this.isCliAvailable('deleteTenant');
        if (this.tenants[name]) {
            delete this.tenants[name];
        }
        const tenant = await this.management.delete(name);
        await (0, prisma_multi_tenant_shared_updated_1.runDistantPrisma)('migrate dev', tenant, false);
        return tenant;
    }
    async existsTenant(name) {
        if (!this.management) {
            throw new Error('Cannot use .existsTenant(name) with `useManagement: false`');
        }
        if (this.tenants[name])
            return true;
        return this.management.exists(name);
    }
    disconnect() {
        return Promise.all([
            ...(this.management ? [this.management.disconnect()] : []),
            ...Object.values(this.tenants).map((t) => t.$disconnect()),
        ]);
    }
}
exports.MultiTenant = MultiTenant;
const requirePrismaManagement = () => require('.prisma-multi-tenant/management').PrismaClient;
exports.requirePrismaManagement = requirePrismaManagement;
