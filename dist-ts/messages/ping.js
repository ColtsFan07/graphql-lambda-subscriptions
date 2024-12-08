import { MessageType } from 'graphql-ws';
import { postToConnection } from '../utils/postToConnection';
import { deleteConnection } from '../utils/deleteConnection';
/** Handler function for 'ping' message. */
export const ping = async ({ server, event, message }) => {
    try {
        await server.onPing?.({ event, message });
        return postToConnection(server)({
            ...event.requestContext,
            message: { type: MessageType.Pong },
        });
    }
    catch (err) {
        await server.onError?.(err, { event, message });
        await deleteConnection(server)(event.requestContext);
    }
};
