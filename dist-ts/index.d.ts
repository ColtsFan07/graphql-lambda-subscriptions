import { ServerArgs, SubscriptionServer } from './types';
export declare const makeServer: (opts: ServerArgs) => SubscriptionServer;
export { subscribe } from './pubsub/subscribe';
export { ServerArgs, SubscriptionServer, APIGatewayWebSocketRequestContext, SubscribeOptions, SubscribeArgs, SubscribePseudoIterable, MaybePromise, ApiGatewayManagementApiSubset, APIGatewayWebSocketEvent, LoggerFunction, WebSocketResponse, StateFunctionInput, PubSubEvent, SubscriptionFilter, Connection, Subscription, } from './types';
