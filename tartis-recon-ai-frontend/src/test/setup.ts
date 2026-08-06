import '@testing-library/jest-dom'

// Node 22+ define un `localStorage` global experimental que requiere
// --localstorage-file y termina dejando localStorage/window.localStorage en
// undefined dentro de jsdom. Polyfill mínimo en memoria para que los tests
// que usan localStorage (p.ej. use-sse.test.ts) puedan correr sin ese flag.
if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage) {
  class MemoryStorage implements Storage {
    private store: Record<string, string> = {}
    get length() {
      return Object.keys(this.store).length
    }
    clear() {
      this.store = {}
    }
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null
    }
    key(index: number) {
      return Object.keys(this.store)[index] ?? null
    }
    removeItem(key: string) {
      delete this.store[key]
    }
    setItem(key: string, value: string) {
      this.store[key] = String(value)
    }
  }

  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    writable: true,
    configurable: true,
  })
}
