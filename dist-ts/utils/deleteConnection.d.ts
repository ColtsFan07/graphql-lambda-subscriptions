import { ServerClosure } from '../types';
export declare const deleteConnection: (server: ServerClosure) => ({ connectionId: ConnectionId, domainName, stage, }: {
    connectionId: string;
    domainName: string;
    stage: string;
}) => Promise<void>;
