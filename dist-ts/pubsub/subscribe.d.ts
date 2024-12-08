import { PubSubEvent, SubscribeArgs, SubscribeOptions, SubscribePseudoIterable } from '../types';
/**
 * Creates subscribe handler for use in your graphql schema.
 *
 * `subscribe` is the most important method in the library. It is the primary difference between `graphql-ws` and `graphql-lambda-subscriptions`. It returns a {@link SubscribePseudoIterable} that pretends to be an async iterator that you put on the `subscribe` resolver for your Subscription. In reality it includes a few properties that we use to subscribe to events and fire lifecycle functions. See {@link SubscribeOptions} for information about the callbacks.
 *
 * @param topic - Subscriptions are made to a `string` topic and can be filtered based upon the topics payload.
 * @param options - Optional callbacks for filtering, and lifecycle events.
 */
export declare const subscribe: <T extends PubSubEvent, TRoot extends unknown = any, TArgs extends Record<string, any> = any, TContext extends unknown = any>(topic: T["topic"], options?: SubscribeOptions<T, SubscribeArgs<TRoot, TArgs, TContext>>) => SubscribePseudoIterable<T, SubscribeArgs<TRoot, TArgs, TContext>>;
