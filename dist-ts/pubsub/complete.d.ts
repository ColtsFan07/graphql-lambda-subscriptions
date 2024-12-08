import { ServerClosure, SubscriptionServer } from '../types';
export declare const complete: (serverPromise: Promise<ServerClosure> | ServerClosure) => SubscriptionServer['complete'];
