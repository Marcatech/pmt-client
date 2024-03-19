export declare const translateDatasourceUrl: (url: string, cwd?: string) => string;
export declare const getManagementEnv: () => Promise<{
    [name: string]: string;
}>;
export declare const setManagementEnv: () => Promise<void>;
export declare const envPaths: string[];
export declare const getEnvPath: (schemaPath?: string) => Promise<string>;
export declare const readEnvFile: (schemaPath?: string) => Promise<string>;
export declare const writeEnvFile: (content: string, schemaPath?: string) => Promise<void>;
export declare const schemaPaths: string[];
export declare const getSchemaPath: () => Promise<string>;
export declare const readSchemaFile: (schemaPath?: string) => Promise<string>;
export declare const writeSchemaFile: (content: string, schemaPath?: string) => Promise<void>;
