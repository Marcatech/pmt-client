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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSchemaFile = exports.readSchemaFile = exports.getSchemaPath = exports.schemaPaths = exports.writeEnvFile = exports.readEnvFile = exports.getEnvPath = exports.envPaths = exports.setManagementEnv = exports.getManagementEnv = exports.translateDatasourceUrl = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const errors_1 = require("./errors");
const shell_1 = require("./shell");
const translateDatasourceUrl = (url, cwd) => {
    if (url.startsWith('"') && url.endsWith('"')) {
        url = url.slice(1, -1);
    }
    if (url.startsWith('file:') && !url.startsWith('file:/')) {
        return 'file:' + path_1.default.join(cwd || process.cwd(), url.replace('file:', '')).replace(/\\/g, '/');
    }
    return url;
};
exports.translateDatasourceUrl = translateDatasourceUrl;
const getManagementEnv = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MANAGEMENT_URL) {
        throw new errors_1.PmtError('missing-env', { name: 'MANAGEMENT_URL' });
    }
    const managementUrl = (0, exports.translateDatasourceUrl)(process.env.MANAGEMENT_URL);
    return {
        PMT_MANAGEMENT_URL: managementUrl,
        PMT_OUTPUT: 'PMT_TMP',
    };
});
exports.getManagementEnv = getManagementEnv;
const setManagementEnv = () => __awaiter(void 0, void 0, void 0, function* () {
    const managementEnv = yield (0, exports.getManagementEnv)();
    Object.entries(managementEnv).forEach(([key, value]) => (process.env[key] = value));
});
exports.setManagementEnv = setManagementEnv;
exports.envPaths = [
    'C:/Users/Domme/Documents/Coding/Marcatech/GithubOrg/Backend/onestaff-backend/.env',
];
const getEnvPath = (schemaPath) => __awaiter(void 0, void 0, void 0, function* () {
    if (schemaPath) {
        const envPath = path_1.default.join(path_1.default.dirname(schemaPath), '.env');
        if (yield (0, shell_1.fileExists)(envPath)) {
            return envPath;
        }
    }
    for (const envPath of exports.envPaths) {
        if (yield (0, shell_1.fileExists)(envPath)) {
            return envPath;
        }
    }
    throw new Error("Couldn't find the prisma/.env file");
});
exports.getEnvPath = getEnvPath;
const readEnvFile = (schemaPath) => __awaiter(void 0, void 0, void 0, function* () {
    const path = yield (0, exports.getEnvPath)(schemaPath);
    return fs_1.default.promises.readFile(path, 'utf-8');
});
exports.readEnvFile = readEnvFile;
const writeEnvFile = (content, schemaPath) => __awaiter(void 0, void 0, void 0, function* () {
    let path;
    try {
        path = yield (0, exports.getEnvPath)(schemaPath);
    }
    catch (_a) {
        path = 'prisma/.env';
    }
    return fs_1.default.promises.writeFile(path, content);
});
exports.writeEnvFile = writeEnvFile;
exports.schemaPaths = [
    'C:/Users/Domme/Documents/Coding/Marcatech/GithubOrg/Backend/onestaff-backend/prisma/schema.prisma',
];
const getSchemaPath = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(exports.schemaPaths);
    for (const schemaPath of exports.schemaPaths) {
        if (yield (0, shell_1.fileExists)(schemaPath)) {
            return schemaPath;
        }
    }
    throw new Error("Couldn't find the schema file");
});
exports.getSchemaPath = getSchemaPath;
const readSchemaFile = (schemaPath) => __awaiter(void 0, void 0, void 0, function* () {
    const path = schemaPath || (yield (0, exports.getSchemaPath)());
    return fs_1.default.promises.readFile(path, 'utf-8');
});
exports.readSchemaFile = readSchemaFile;
const writeSchemaFile = (content, schemaPath) => __awaiter(void 0, void 0, void 0, function* () {
    const path = schemaPath || (yield (0, exports.getSchemaPath)());
    return fs_1.default.promises.writeFile(path, content, 'utf-8');
});
exports.writeSchemaFile = writeSchemaFile;
