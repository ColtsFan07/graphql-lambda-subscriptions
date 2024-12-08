export declare const executeQuery: (query: string, { url, stayConnected, timeout, id, }?: {
    url?: string | undefined;
    stayConnected?: boolean | undefined;
    timeout?: number | undefined;
    id?: number | undefined;
}) => AsyncGenerator<unknown, void, unknown>;
export declare const executeToComplete: (query: string, { url, id, }?: {
    url?: string | undefined;
    id?: number | undefined;
}) => Promise<() => Promise<void>>;
export declare const executeToDisconnect: (query: string, { url, id, }?: {
    url?: string | undefined;
    id?: number | undefined;
}) => Promise<() => void>;
export declare const executeDoubleQuery: (query: string, { url, stayConnected, timeout, id, skipWaitingForFirstMessage, }?: {
    url?: string | undefined;
    stayConnected?: boolean | undefined;
    timeout?: number | undefined;
    id?: number | undefined;
    skipWaitingForFirstMessage?: boolean | undefined;
}) => AsyncGenerator<unknown, void, unknown>;
