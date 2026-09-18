import type { StateTree } from 'pinia'

declare module 'pinia' {
  interface DefineStoreOptionsBase<S extends StateTree = StateTree, Store = unknown> {
    persist?: boolean | Record<string, unknown> | (boolean | Record<string, unknown>)[]
  }
}
