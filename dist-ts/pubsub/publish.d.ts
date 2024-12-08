import { ServerClosure, SubscriptionServer } from '../types';
export declare const publish: (serverPromise: Promise<ServerClosure> | ServerClosure) => SubscriptionServer['publish'];
