import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
export declare const name = "@tangyuewei/dsh-client-ui-pet";
/** Required service: the slot registry (cordis fiber inject). */
export declare const inject: readonly ["slots"];
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        'shell.overlay': {
            kind: 'list';
            scope: 'root';
        };
    }
}
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map