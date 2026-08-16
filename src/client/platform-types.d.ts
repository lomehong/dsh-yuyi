/**
 * Minimal ambient faces for the platform modules the browser half references
 * through type-only imports. The published @deepseek-ai client packages
 * depend on family members that are not on npm yet, so the standalone build
 * cannot install them; these declarations model exactly the surface this
 * plugin consumes (erased at bundle time, and narrower than the real faces
 * on purpose). When the family finishes publishing, `pnpm add` the real
 * packages and delete this file.
 */

declare module '@deepseek-ai/dsh-client-runtime/client' {
  /** Opaque session id handed to session-scoped slot inject thunks. */
  export type SessionId = string
  /** One settings scope over a namespace section (browser mirror of the Host seam). */
  export interface SettingsScope<T> {
    getSnapshot(): { status: 'loading' | 'ready' | 'unavailable'; value: T | undefined; user: unknown; writable: boolean }
    subscribe(listener: () => void): () => void
    set(field: string, value: unknown): Promise<void>
    unset(field: string): Promise<void>
  }
  /** The browser root context as this plugin uses it. */
  export interface ClientContext {
    effect(register: () => unknown, name?: string): () => void
    locale: {
      register(ns: string, dictionaries: { zh: object; en: object }): () => void
      bind(ns: string): (key: string) => string
    }
    remote: {
      $mount(contribution: unknown): Promise<() => void>
      [namespace: string]: unknown
    }
    settingsScope: {
      bind<T>(spec: { namespace: string }): SettingsScope<T>
    }
    slots: {
      inject(slot: string, register: () => unknown): void
      register(options: { name: string } & Record<string, unknown>, component: unknown): () => void
    }
  }
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  /** Bare observable source (getSnapshot + subscribe pair). */
  export interface HostObservable<T> {
    getSnapshot(): T
    subscribe(listener: () => void): () => void
  }
  /** The locale seat: a translate bound to the registration's namespace. */
  export type PropsLocale<NS extends string> = { t: (key: string) => string }
  /** Runtime share for a slot with no children declaration beyond the owner's. */
  export type PropsRuntime<K extends string> = object
  /**
   * The component-side view of an inject face: the reserved `hooks`
   * compartment arrives as bound `use<Name>` selector hooks; every other
   * member passes through verbatim.
   */
  export type InjectFace<I extends object> = I extends { hooks: infer HS extends object }
    ? Omit<I, 'hooks'> & {
        [N in keyof HS & string as `use${Capitalize<N>}`]:
          HS[N] extends HostObservable<infer T> ? <R>(selector: (snapshot: T) => R) => R : never
      }
    : I
}
