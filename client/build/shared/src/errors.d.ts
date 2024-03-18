export declare class PmtError extends Error {
    type: string;
    data: any[];
    constructor(type: string, ...data: any[]);
}
