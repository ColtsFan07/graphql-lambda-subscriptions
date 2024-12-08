import { ServerClosure, SubscriptionServer } from './types';
export declare const handleStepFunctionEvent: (serverPromise: Promise<ServerClosure>) => SubscriptionServer['stepFunctionsHandler'];
