/* eslint-disable @typescript-eslint/no-explicit-any */
import WebSocket from 'ws';
import { deferGenerator } from 'inside-out-async';
const URL = `ws://localhost:${process.env.PORT}`;
const messageToString = (message) => {
    if (Buffer.isBuffer(message?.reason)) {
        message.reason = message.reason.toString();
    }
    return JSON.stringify(message);
};
export const executeQuery = async function* (query, { url = URL, stayConnected = false, timeout = 20000, id = 1, } = {}) {
    const ws = new WebSocket(url, 'graphql-transport-ws');
    const incomingMessages = deferGenerator();
    ws.on('message', data => {
        const message = JSON.parse(data.toString());
        incomingMessages.queueValue(message);
        if (message.type === 'error' || message.type === 'complete') {
            incomingMessages.queueReturn();
        }
    });
    ws.on('error', error => {
        incomingMessages.queueValue({ type: 'websocketError', value: error.message });
        incomingMessages.queueReturn();
    });
    ws.on('close', (code, reason) => {
        incomingMessages.queueValue({ type: 'close', code, reason: reason.toString() });
        incomingMessages.queueReturn();
    });
    let timer = null;
    if (timeout) {
        timer = setTimeout(() => {
            incomingMessages.queueValue({ type: 'timeout', timeout });
            incomingMessages.queueReturn();
        }, timeout);
    }
    const send = (data) => new Promise(resolve => ws.send(JSON.stringify(data), () => resolve()));
    await new Promise(resolve => ws.on('open', resolve));
    await send({ type: 'connection_init' });
    const connectionAck = (await incomingMessages.generator.next()).value;
    if (connectionAck.type !== 'connection_ack') {
        throw new Error(`Bad ack ${messageToString(connectionAck)}`);
    }
    await send({
        id: `${id}`,
        type: 'subscribe',
        payload: { query },
    });
    for await (const message of incomingMessages.generator) {
        const shouldStop = yield message;
        if (shouldStop) {
            break;
        }
    }
    if (!stayConnected) {
        ws.close();
    }
    if (timer) {
        clearTimeout(timer);
    }
};
export const executeToComplete = async function (query, { url = URL, id = 1, } = {}) {
    const ws = new WebSocket(url, 'graphql-transport-ws');
    const incomingMessages = deferGenerator();
    ws.on('message', data => {
        const message = JSON.parse(data.toString());
        incomingMessages.queueValue(message);
        if (message.type === 'error' || message.type === 'complete') {
            incomingMessages.queueReturn();
        }
    });
    ws.on('error', error => {
        incomingMessages.queueValue({ type: 'websocketError', value: error.message });
        incomingMessages.queueReturn();
    });
    ws.on('close', (code, reason) => {
        incomingMessages.queueValue({ type: 'close', code, reason: reason.toString() });
        incomingMessages.queueReturn();
    });
    const send = (data) => new Promise(resolve => ws.send(JSON.stringify(data), () => resolve()));
    await new Promise(resolve => ws.on('open', resolve));
    await send({ type: 'connection_init' });
    const connectionAck = (await incomingMessages.generator.next()).value;
    if (connectionAck.type !== 'connection_ack') {
        throw new Error(`Bad ack ${messageToString(connectionAck)}`);
    }
    await send({
        id: `${id}`,
        type: 'subscribe',
        payload: { query },
    });
    return () => send({
        id,
        type: 'complete',
    });
};
export const executeToDisconnect = async function (query, { url = URL, id = 1, } = {}) {
    const ws = new WebSocket(url, 'graphql-transport-ws');
    const incomingMessages = deferGenerator();
    ws.on('message', data => {
        const message = JSON.parse(data.toString());
        incomingMessages.queueValue(message);
        if (message.type === 'error' || message.type === 'complete') {
            incomingMessages.queueReturn();
        }
    });
    ws.on('error', error => {
        incomingMessages.queueValue({ type: 'websocketError', value: error.message });
        incomingMessages.queueReturn();
    });
    ws.on('close', (code, reason) => {
        incomingMessages.queueValue({ type: 'close', code, reason: reason.toString() });
        incomingMessages.queueReturn();
    });
    const send = (data) => new Promise(resolve => ws.send(JSON.stringify(data), () => resolve()));
    await new Promise(resolve => ws.on('open', resolve));
    await send({ type: 'connection_init' });
    const connectionAck = (await incomingMessages.generator.next()).value;
    if (connectionAck.type !== 'connection_ack') {
        throw new Error(`Bad ack ${messageToString(connectionAck)}`);
    }
    await send({
        id: `${id}`,
        type: 'subscribe',
        payload: { query },
    });
    return () => ws.close();
};
export const executeDoubleQuery = async function* (query, { url = URL, stayConnected = false, timeout = 20000, id = 1, skipWaitingForFirstMessage = false, } = {}) {
    const ws = new WebSocket(url, 'graphql-transport-ws');
    const incomingMessages = deferGenerator();
    ws.on('message', data => {
        const message = JSON.parse(data.toString());
        incomingMessages.queueValue(message);
        if (message.type === 'error' || message.type === 'complete') {
            incomingMessages.queueReturn();
        }
    });
    ws.on('error', error => {
        incomingMessages.queueValue({ type: 'websocketError', value: error.message });
        incomingMessages.queueReturn();
    });
    ws.on('close', (code, reason) => {
        incomingMessages.queueValue({ type: 'close', code, reason: reason.toString() });
        incomingMessages.queueReturn();
    });
    let timer = null;
    if (timeout) {
        timer = setTimeout(() => {
            incomingMessages.queueValue({ type: 'timeout', timeout });
            incomingMessages.queueReturn();
        }, timeout);
    }
    const send = (data) => new Promise(resolve => ws.send(JSON.stringify(data), () => resolve()));
    await new Promise(resolve => ws.on('open', resolve));
    await send({ type: 'connection_init' });
    const connectionAck = (await incomingMessages.generator.next()).value;
    if (connectionAck.type !== 'connection_ack') {
        throw new Error(`Bad ack ${messageToString(connectionAck)}`);
    }
    await send({
        id: `${id}`,
        type: 'subscribe',
        payload: { query },
    });
    if (!skipWaitingForFirstMessage) {
        const firstMessage = await incomingMessages.generator.next();
        if (firstMessage.done) {
            return;
        }
        yield firstMessage.value;
    }
    await send({
        id: `${id}`,
        type: 'subscribe',
        payload: { query },
    });
    for await (const message of incomingMessages.generator) {
        yield message;
    }
    if (!stayConnected) {
        ws.close();
    }
    if (timer) {
        clearTimeout(timer);
    }
};
