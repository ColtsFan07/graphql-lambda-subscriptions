import { ServerArgs, ServerClosure } from '../types';
export declare const mockServerArgs: (args?: Partial<ServerArgs>) => Promise<ServerArgs>;
export declare const mockServerContext: (args?: Partial<ServerArgs>) => Promise<ServerClosure>;
