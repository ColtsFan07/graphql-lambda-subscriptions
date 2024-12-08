import { deleteConnection } from '../utils/deleteConnection';
/** Handler function for 'pong' message. */
export const pong = async ({ server, event, message }) => {
    try {
        await server.onPong?.({ event, message });
        await server.models.connection.update({ id: event.requestContext.connectionId }, {
            hasPonged: true,
        });
    }
    catch (err) {
        await server.onError?.(err, { event, message });
        await deleteConnection(server)(event.requestContext);
    }
};
