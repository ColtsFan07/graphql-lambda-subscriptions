import { StepFunctions } from 'aws-sdk';
import { MessageType } from 'graphql-ws';
import { postToConnection } from '../utils/postToConnection';
import { deleteConnection } from '../utils/deleteConnection';
import { defaultTTL } from '../utils/defaultTTL';
/** Handler function for 'connection_init' message. */
export const connection_init = async ({ server, event, message }) => {
    try {
        const payload = await server.onConnectionInit?.({ event, message }) ?? message.payload ?? {};
        if (server.pingpong) {
            await new StepFunctions()
                .startExecution({
                stateMachineArn: server.pingpong.machine,
                name: event.requestContext.connectionId,
                input: JSON.stringify({
                    connectionId: event.requestContext.connectionId,
                    domainName: event.requestContext.domainName,
                    stage: event.requestContext.stage,
                    state: 'PING',
                    choice: 'WAIT',
                    seconds: server.pingpong.delay,
                }),
            })
                .promise();
        }
        // Write to persistence
        await server.models.connection.put({
            id: event.requestContext.connectionId,
            createdAt: Date.now(),
            requestContext: event.requestContext,
            payload,
            hasPonged: false,
            ttl: defaultTTL(),
        });
        return postToConnection(server)({
            ...event.requestContext,
            message: { type: MessageType.ConnectionAck },
        });
    }
    catch (err) {
        await server.onError?.(err, { event, message });
        await deleteConnection(server)(event.requestContext);
    }
};
