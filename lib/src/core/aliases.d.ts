export type AliasMap = Record<string, string>;
export declare function load(): AliasMap;
/**
 * 记录一个会话别名。
 * 先重新读盘再写，避免同设备多个 opencode 实例并发注册时相互覆盖。
 */
export declare function set(sessionID: string, name: string): void;
export declare function remove(sessionID: string): void;
