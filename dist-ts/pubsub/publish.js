import { parse, execute } from 'graphql';
import { MessageType } from 'graphql-ws';
import { postToConnection } from '../utils/postToConnection';
import { buildContext } from '../utils/buildContext';
import { getFilteredSubs } from './getFilteredSubs';
export const publish = (serverPromise) => async (event) => {
    const server = await serverPromise;
    server.log('pubsub:publish', { event });
    const subscriptions = await getFilteredSubs({ server, event });
    server.log('pubsub:publish', { subscriptions: subscriptions.map(({ connectionId, filter, subscription }) => ({ connectionId, filter, subscription })) });
    const iters = subscriptions.map(async (sub) => {
        const payload = await execute({
            schema: server.schema,
            document: parse(sub.subscription.query),
            rootValue: event,
            contextValue: await buildContext({ server, connectionInitPayload: sub.connectionInitPayload, connectionId: sub.connectionId }),
            variableValues: sub.subscription.variables,
            operationName: sub.subscription.operationName,
        });
        const message = {
            id: sub.subscriptionId,
            type: MessageType.Next,
            payload,
        };
        await postToConnection(server)({
            ...sub.requestContext,
            message,
        });
    });
    await Promise.all(iters);
};
