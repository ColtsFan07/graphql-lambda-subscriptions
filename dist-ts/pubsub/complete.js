import AggregateError from 'aggregate-error';
import { parse } from 'graphql';
import { MessageType } from 'graphql-ws';
import { buildExecutionContext } from 'graphql/execution/execute';
import { postToConnection } from '../utils/postToConnection';
import { buildContext } from '../utils/buildContext';
import { getResolverAndArgs } from '../utils/getResolverAndArgs';
import { isArray } from '../utils/isArray';
import { getFilteredSubs } from './getFilteredSubs';
export const complete = (serverPromise) => async (event) => {
    const server = await serverPromise;
    const subscriptions = await getFilteredSubs({ server, event });
    server.log('pubsub:complete', { event, subscriptions });
    const iters = subscriptions.map(async (sub) => {
        const message = {
            id: sub.subscriptionId,
            type: MessageType.Complete,
        };
        await postToConnection(server)({
            ...sub.requestContext,
            message,
        });
        await server.models.subscription.delete({ id: sub.id });
        const execContext = buildExecutionContext({
            schema: server.schema,
            document: parse(sub.subscription.query),
            contextValue: await buildContext({ server, connectionInitPayload: sub.connectionInitPayload, connectionId: sub.connectionId }),
            variableValues: sub.subscription.variables,
            operationName: sub.subscription.operationName,
        });
        if (isArray(execContext)) {
            throw new AggregateError(execContext);
        }
        const { field, root, args, context, info } = getResolverAndArgs({ execContext });
        const onComplete = field?.subscribe?.onComplete;
        server.log('pubsub:complete:onComplete', { onComplete: !!onComplete });
        await onComplete?.(root, args, context, info);
    });
    await Promise.all(iters);
};
