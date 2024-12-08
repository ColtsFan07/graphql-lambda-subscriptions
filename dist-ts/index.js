import { publish } from './pubsub/publish';
import { complete } from './pubsub/complete';
import { handleWebSocketEvent } from './handleWebSocketEvent';
import { handleStepFunctionEvent } from './handleStepFunctionEvent';
import { buildServerClosure } from './buildServerClosure';
export const makeServer = (opts) => {
    const closure = buildServerClosure(opts);
    return {
        webSocketHandler: handleWebSocketEvent(closure),
        stepFunctionsHandler: handleStepFunctionEvent(closure),
        publish: publish(closure),
        complete: complete(closure),
    };
};
export { subscribe } from './pubsub/subscribe';
