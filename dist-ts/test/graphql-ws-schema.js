/* eslint-disable @typescript-eslint/no-explicit-any */
import ws from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
const PORT = 4000;
const typeDefs = `
  type Query {
    hello: String
    dontResolve: String
  }
  type Subscription {
    greetings: String
    onSubscribeError: String
    onResolveError: String
    oneEvent: String
  }
`;
const resolvers = {
    Query: {
        hello: () => 'Hello World!',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        dontResolve: () => new Promise(() => { }),
    },
    Subscription: {
        greetings: {
            subscribe: async function* () {
                yield { greetings: 'yoyo' };
                yield { greetings: 'hows it' };
                yield { greetings: 'howdy' };
            },
        },
        onSubscribeError: {
            // eslint-disable-next-line require-yield
            subscribe: async function* () {
                throw new Error('onSubscribeError');
            },
        },
        onResolveError: {
            subscribe: async function* () {
                yield { greetings: 'yoyo' };
            },
            resolve() {
                throw new Error('resolver error');
            },
        },
        oneEvent: {
            subscribe: async function* () {
                yield { oneEvent: 'lets start!' };
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                await new Promise(() => { });
            },
        },
    },
};
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
export const startGqlWSServer = async () => {
    const server = new ws.Server({
        port: PORT,
        path: '/',
    });
    server.on('connection', connection => {
        // connection.on('message', msg => console.log({ msg: msg.toString() }))
        const send = connection.send;
        connection.send = (data, cb) => {
            // console.log({ send: data })
            return send.call(connection, data, cb);
        };
        const close = connection.close;
        connection.close = (code, data) => {
            // console.log({ close: { code, data: data?.toString() } })
            return close.call(connection, code, data);
        };
    });
    useServer({
        schema,
        async onSubscribe(ctx, message) {
            if (message?.payload?.query === 'subscription { onSubscribeError }') {
                return [
                    new GraphQLError('onSubscribeError'),
                ];
            }
        },
    }, server);
    await new Promise(resolve => server.on('listening', resolve));
    // console.log('server started')
    const stop = () => new Promise(resolve => server.close(() => resolve()));
    return {
        url: `ws://localhost:${PORT}`,
        stop,
    };
};
