/**
 * Agent-preset entry for the yuyi tool suite: register this module from a
 * preset row (`name: dsh-yuyi/tools`) so sessions composed from that preset
 * get the seventeen `yuyi_*` tools and their prompt guidance. The host-plane
 * service must be mounted separately through the bundle patch.
 * @module dsh-yuyi/tools
 */

export * from './src/tools/index.ts'
