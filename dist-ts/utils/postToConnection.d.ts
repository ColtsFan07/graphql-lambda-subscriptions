import { ConnectionAckMessage, NextMessage, CompleteMessage, ErrorMessage, PingMessage, PongMessage } from 'graphql-ws';
import { ServerClosure } from '../types';
declare type GraphqlWSMessages = ConnectionAckMessage | NextMessage | CompleteMessage | ErrorMessage | PingMessage | PongMessage;
export declare const postToConnection: (server: ServerClosure) => ({ connectionId: ConnectionId, domainName, stage, message, }: {
    connectionId: string;
    domainName: string;
    stage: string;
    message: GraphqlWSMessages;
}) => Promise<void>;
export {};
