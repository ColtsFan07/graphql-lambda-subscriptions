import { ApiGatewayManagementApi } from 'aws-sdk';
export const deleteConnection = (server) => async ({ connectionId: ConnectionId, domainName, stage, }) => {
    server.log('deleteConnection', { connectionId: ConnectionId });
    const api = server.apiGatewayManagementApi ??
        new ApiGatewayManagementApi({
            apiVersion: 'latest',
            endpoint: `${domainName}/${stage}`,
        });
    await api.deleteConnection({ ConnectionId }).promise();
};
