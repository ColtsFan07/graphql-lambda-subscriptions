export declare const startGqlWSServer: () => Promise<{
    url: string;
    stop: () => Promise<void>;
}>;
