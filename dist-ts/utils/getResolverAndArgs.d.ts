import { buildResolveInfo, ExecutionContext, getFieldDef } from 'graphql/execution/execute';
interface ResolverAndArgs {
    field: ReturnType<typeof getFieldDef>;
    root: null;
    args: ExecutionContext['variableValues'];
    context: ExecutionContext['contextValue'];
    info: ReturnType<typeof buildResolveInfo>;
}
export declare const getResolverAndArgs: ({ execContext }: {
    execContext: ExecutionContext;
}) => ResolverAndArgs;
export {};
