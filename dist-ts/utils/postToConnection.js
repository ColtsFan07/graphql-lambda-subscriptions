import { ApiGatewayManagementApi } from 'aws-sdk';
export const postToConnection = (server) => async ({ connectionId: ConnectionId, domainName, stage, message, }) => {
    server.log('sendMessage', { connectionId: ConnectionId, message });
    const api = server.apiGatewayManagementApi ??
        new ApiGatewayManagementApi({
            apiVersion: 'latest',
            endpoint: `${domainName}/${stage}`,
        });
    await api
        .postToConnection({
        ConnectionId,
        Data: JSON.stringify(message),
    })
        .promise();
};
