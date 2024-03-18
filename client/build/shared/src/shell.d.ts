/// <reference types="node" />
import { Datasource } from './types';
export declare const runShell: (cmd: string, options?: {
    cwd: string;
    env?: {
        [name: string]: string | undefined;
    } | undefined;
} | undefined) => Promise<string | Buffer>;
export declare const spawnShell: (cmd: string) => Promise<number>;
export declare const fileExists: (path: string) => Promise<boolean>;
export declare const getNodeModules: (cwd?: string | undefined) => Promise<string>;
export declare const runLocal: (cmd: string, env?: {
    [name: string]: string;
} | undefined) => Promise<string | Buffer>;
export declare const runDistant: (cmd: string, tenant?: Datasource | undefined) => Promise<string | Buffer>;
export declare const getPrismaCliPath: () => Promise<string>;
export declare const isPrismaCliLocallyInstalled: () => Promise<boolean>;
export declare const runLocalPrisma: (cmd: string) => Promise<string | Buffer>;
export declare const runDistantPrisma: (cmd: string, tenant?: Datasource | undefined, withTimeout?: boolean) => Promise<string | Buffer>;
export declare const requireDistant: (name: string) => any;
