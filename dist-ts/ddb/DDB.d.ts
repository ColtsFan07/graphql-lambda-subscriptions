import { DynamoDB } from 'aws-sdk';
import { LoggerFunction, DDBType } from '../types';
export interface DDBClient<T extends DDBType, TKey> {
    get: (Key: TKey) => Promise<T | null>;
    put: (obj: T, putOptions?: Partial<DynamoDB.DocumentClient.PutItemInput>) => Promise<T>;
    update: (Key: TKey, obj: Partial<T>) => Promise<T>;
    delete: (Key: TKey) => Promise<T>;
    query: (options: Omit<DynamoDB.DocumentClient.QueryInput, 'TableName' | 'Select'>) => AsyncGenerator<T, void, undefined>;
}
export declare const DDB: <T extends DDBType, TKey>({ dynamodb, tableName, log, }: {
    dynamodb: DynamoDB;
    tableName: string;
    log: LoggerFunction;
}) => DDBClient<T, TKey>;
