import { ServerClosure, Subscription } from '../types';
export declare const getFilteredSubs: ({ server, event }: {
    server: Omit<ServerClosure, 'gateway'>;
    event: {
        topic: string;
        payload?: Record<string, any>;
    };
}) => Promise<Subscription[]>;
export declare const collapseKeys: (obj: Record<string, any>) => Record<string, number | string | boolean>;
