import { ServerClosure, SubscriptionServer } from './types';
export declare const handleWebSocketEvent: (serverPromise: Promise<ServerClosure>) => SubscriptionServer['webSocketHandler'];
