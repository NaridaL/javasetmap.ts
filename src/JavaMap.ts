import { Equalable, int } from "./Equalable"

/**
 * Java style map.
 */
export class JavaMap<
  K extends Equalable & { hashCodes?(): int[]; like?(x: any): boolean },
  V
> implements Map<K, V> {
  [Symbol.toStringTag]: "Map" = "Map"

  toString() {
    return (
      "{" +
      Array.from(this.entries2())
        .map(({ key, value }) => key + ":" + value)
        .join(", ") +
      "}"
    )
  }

  forEach(
    callbackfn: (value: V, index: K, map: Map<K, V>) => void,
    thisArg?: any
  ): void {
    for (const bucket of this._map.values()) {
      for (const { key, value } of bucket) {
        callbackfn.call(thisArg, value, key, this)
      }
    }
  }

  *keys(): IterableIterator<K> {
    for (const bucket of this._map.values()) {
      for (const { key } of bucket) {
        yield key
      }
    }
  }

  *values(): IterableIterator<V> {
    for (const bucket of this._map.values()) {
      for (const { value } of bucket) {
        yield value
      }
    }
  }

  protected _map: Map<int, { key: K; value: V }[]>
  protected _size: int

  constructor() {
    this._map = new Map()
    this._size = 0
  }

  [Symbol.iterator]() {
    return this.entries()
  }

  set(key: K, value: V): this {
    this.set2(key, value)
    return this
  }

  /**
   * Like {@link #set} except it returns true if key was new and false if the value was only updated.
   *
   */
  set2(key: K, val: V): boolean {
    const hashCode = key.hashCode(),
      bucket = this._map.get(hashCode)
    //assert(hashCode === (hashCode | 0))
    if (bucket) {
      const pairIndex = bucket.findIndex((pair) => pair.key.equals(key))
      if (-1 == pairIndex) {
        bucket.push({ key: key, value: val })
      } else {
        bucket[pairIndex].value = val
        return false
      }
    } else {
      this._map.set(hashCode, [{ key: key, value: val }])
    }
    this._size++
    return true
  }

  has(key: K): boolean {
    const hashCode = key.hashCode(),
      bucket = this._map.get(hashCode)
    //assert(hashCode === (hashCode | 0))
    return undefined !== bucket && bucket.some((pair) => pair.key.equals(key))
  }

  get(key: K): V | undefined {
    const hashCode = key.hashCode(),
      bucket = this._map.get(hashCode),
      pair = bucket && bucket.find((pair) => pair.key.equals(key))
    return pair && pair.value
  }

  getLike(key: K) {
    for (const hashCode of key.hashCodes!()) {
      const bucket = this._map.get(hashCode)
      const canonVal = bucket && bucket.find((x) => x.key.like!(key))
      if (canonVal) return canonVal
    }
  }

  setLike(key: K, val: V) {
    return !this.getLike(key) && this.set(key, val)
  }

  delete(key: K) {
    const hashCode = key.hashCode(),
      bucket = this._map.get(hashCode)
    if (bucket) {
      const index = bucket.findIndex((x) => x.key.equals(key))
      if (-1 != index) {
        if (1 == bucket.length) {
          this._map.delete(hashCode)
        } else {
          bucket.splice(index, 1)
        }
        this._size--
        return true
      }
    }
    return false
  }

  deleteLike(key: K) {
    for (const hashCode of key.hashCodes!()) {
      const bucket = this._map.get(hashCode)
      if (bucket) {
        const index = bucket.findIndex((x) => x.key.like!(key))
        if (-1 != index) {
          const deleted = bucket[index]
          if (1 == bucket.length) {
            this._map.delete(hashCode)
          } else {
            bucket.splice(index, 1)
          }
          this._size--
          return deleted
        }
      }
    }
  }

  *entries2(): IterableIterator<{ key: K; value: V }> {
    for (const bucket of this._map.values()) {
      yield* bucket
    }
  }

  *entries(): IterableIterator<[K, V]> {
    for (const bucket of this._map.values()) {
      for (const { key, value } of bucket) {
        yield [key, value]
      }
    }
  }

  clear() {
    this._map.clear()
    this._size = 0
  }

  get size() {
    return this._size
  }
}
