import { Datasource } from './types';
interface ManagementOptions {
    PrismaClient?: any;
}
declare type Tenant = Datasource;
export default class Management {
    private options?;
    private client?;
    constructor(options?: ManagementOptions);
    private getClient;
    create(tenant: Tenant): Promise<Tenant>;
    read(name: string): Promise<Tenant>;
    exists(name: string): Promise<boolean>;
    list(): Promise<Tenant[]>;
    update(name: string, update: Tenant): Promise<Tenant>;
    delete(name: string): Promise<Tenant>;
    disconnect(): Promise<void>;
    private sanitizeTenant;
}
export {};
