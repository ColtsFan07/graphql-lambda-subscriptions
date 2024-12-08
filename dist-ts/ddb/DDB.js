import { DynamoDB } from 'aws-sdk';
export const DDB = ({ dynamodb, tableName, log, }) => {
    const documentClient = new DynamoDB.DocumentClient({ service: dynamodb });
    const get = async (Key) => {
        log('get', { tableName: tableName, Key });
        try {
            const { Item } = await documentClient.get({
                TableName: tableName,
                Key,
            }).promise();
            log('get:result', { Item });
            return Item ?? null;
        }
        catch (e) {
            log('get:error', e);
            throw e;
        }
    };
    const put = async (Item, putOptions) => {
        log('put', { tableName: tableName, Item });
        try {
            const { Attributes } = await documentClient.put({
                TableName: tableName,
                Item,
                ReturnValues: 'ALL_OLD',
                ...putOptions,
            }).promise();
            return Attributes;
        }
        catch (e) {
            log('put:error', e);
            throw e;
        }
    };
    const update = async (Key, obj) => {
        log('update', { tableName: tableName, Key, obj });
        try {
            const AttributeUpdates = Object.entries(obj)
                .map(([key, Value]) => ({ [key]: { Value, Action: 'PUT' } }))
                .reduce((memo, val) => ({ ...memo, ...val }));
            const { Attributes } = await documentClient.update({
                TableName: tableName,
                Key,
                AttributeUpdates,
                ReturnValues: 'ALL_NEW',
            }).promise();
            return Attributes;
        }
        catch (e) {
            log('update:error', e);
            throw e;
        }
    };
    const deleteFunction = async (Key) => {
        log('delete', { tableName: tableName, Key });
        try {
            const { Attributes } = await documentClient.delete({
                TableName: tableName,
                Key,
                ReturnValues: 'ALL_OLD',
            }).promise();
            return Attributes;
        }
        catch (e) {
            log('delete:error', e);
            throw e;
        }
    };
    const queryOnce = async (options) => {
        log('queryOnce', { tableName: tableName, options });
        try {
            const response = await documentClient.query({
                TableName: tableName,
                Select: 'ALL_ATTRIBUTES',
                ...options,
            }).promise();
            const { Items, LastEvaluatedKey, Count } = response;
            return {
                items: (Items ?? []),
                lastEvaluatedKey: LastEvaluatedKey,
                count: Count ?? 0,
            };
        }
        catch (e) {
            log('queryOnce:error', e);
            throw e;
        }
    };
    async function* query(options) {
        log('query', { tableName: tableName, options });
        try {
            const results = await queryOnce(options);
            yield* results.items;
            let lastEvaluatedKey = results.lastEvaluatedKey;
            while (lastEvaluatedKey) {
                const results = await queryOnce({ ...options, ExclusiveStartKey: lastEvaluatedKey });
                yield* results.items;
                lastEvaluatedKey = results.lastEvaluatedKey;
            }
        }
        catch (e) {
            log('query:error', e);
            throw e;
        }
    }
    return {
        get,
        put,
        update,
        query,
        delete: deleteFunction,
    };
};
