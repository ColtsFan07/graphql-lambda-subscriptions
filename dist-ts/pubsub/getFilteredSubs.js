/* eslint-disable @typescript-eslint/no-explicit-any */
import { collect } from 'streaming-iterables';
export const getFilteredSubs = async ({ server, event }) => {
    if (!event.payload || Object.keys(event.payload).length === 0) {
        server.log('getFilteredSubs', { event });
        const iterator = server.models.subscription.query({
            IndexName: 'TopicIndex',
            ExpressionAttributeNames: { '#a': 'topic' },
            ExpressionAttributeValues: { ':1': event.topic },
            KeyConditionExpression: '#a = :1',
        });
        return await collect(iterator);
    }
    const flattenPayload = collapseKeys(event.payload);
    const filterExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    let attributeCounter = 0;
    for (const [key, value] of Object.entries(flattenPayload)) {
        const aliasNumber = attributeCounter++;
        expressionAttributeNames[`#${aliasNumber}`] = key;
        expressionAttributeValues[`:${aliasNumber}`] = value;
        filterExpressions.push(`(#filter.#${aliasNumber} = :${aliasNumber} OR attribute_not_exists(#filter.#${aliasNumber}))`);
    }
    console.log('getFilteredSubs', { event, expressionAttributeNames, expressionAttributeValues, filterExpressions });
    const iterator = server.models.subscription.query({
        IndexName: 'TopicIndex',
        ExpressionAttributeNames: {
            '#hashKey': 'topic',
            '#filter': 'filter',
            ...expressionAttributeNames,
        },
        ExpressionAttributeValues: {
            ':hashKey': event.topic,
            ...expressionAttributeValues,
        },
        KeyConditionExpression: '#hashKey = :hashKey',
        FilterExpression: filterExpressions.join(' AND ') || undefined,
    });
    console.log('iterator', iterator);
    return await collect(iterator);
};
export const collapseKeys = (obj) => {
    const record = {};
    for (const [k1, v1] of Object.entries(obj)) {
        if (typeof v1 === 'string' || typeof v1 === 'number' || typeof v1 === 'boolean') {
            record[k1] = v1;
            continue;
        }
        if (v1 && typeof v1 === 'object') {
            const next = {};
            for (const [k2, v2] of Object.entries(v1)) {
                next[`${k1}.${k2}`] = v2;
            }
            for (const [k1, v1] of Object.entries(collapseKeys(next))) {
                record[k1] = v1;
            }
        }
    }
    return record;
};
