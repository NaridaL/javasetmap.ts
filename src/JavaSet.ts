import {Equalable, int} from './Equalable'

export class JavaSet<T extends Equalable & {hashCodes?(): int[], like?(x: any): boolean }> implements Set<T> {
	[Symbol.toStringTag]: 'Set' = 'Set'

	forEach(callbackfn: (value: T, index: T, set: Set<T>)=>void, thisArg?: any): void {
		for (const value of this.entries()) {
			callbackfn.call(thisArg, value, value, this)
		}
	}
	protected _map: Map<int, T[]>
    protected _size: int

	constructor(iterable?: Iterable<T>) {
		this._map = new Map()
		this._size = 0
		if (iterable) {
			this.addAll(iterable)
		}
	}

	add(val: T): this {
		this.add2(val)
		return this
	}

	add2(val: T): boolean {
		// you can't use this.canonicalize here, as there is no way to differentiate if val
		// is new or if val was === the exisitng value (not only .equals)
		const hashCode = val.hashCode(), bucket = this._map.get(hashCode)
		if (bucket) {
			if (bucket.some(x => x.equals(val))) {
				return false
			}
			bucket.push(val)
		} else {
			this._map.set(hashCode, [val])
		}
		this._size++
		return true
	}

	addAll(iterable: Iterable<T>): this {
		for (const val of iterable) {
			this.add(val)
		}
		return this
	}

	canonicalize(val: T): T {
		const hashCode = val.hashCode(), bucket = this._map.get(hashCode)
		if (bucket) {
			const existing = bucket.find(x => x.equals(val))
			if (existing) {
				return existing
			}
			bucket.push(val)
		} else {
			this._map.set(hashCode, [val])
		}
		this._size++
		return val
	}

	has(val: T): boolean {
		const hashCode = val.hashCode(), bucket = this._map.get(hashCode)
		return undefined !== bucket && bucket.some(x => x.equals(val))
	}

	getLike(val: T) {
		for (const hashCode of val.hashCodes!()) {
			const bucket = this._map.get(hashCode)
			const canonVal = bucket && bucket.find(x => x.like!(val))
			if (canonVal) return canonVal
		}
	}

	canonicalizeLike(val: T) {
		// if this.getLike(val) is defined, return it, otherwise add val and return val
		return this.getLike(val) || this.canonicalize(val)
	}

	addLike(val: T) {
		return !this.getLike(val) && this.add(val)
	}

	'delete'(val: T) {
		const hashCode = val.hashCode(), bucket = this._map.get(hashCode)
		if (bucket) {
			const index = bucket.findIndex(x => x.equals(val))
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

	deleteLike(val: T) {
		for (const hashCode of val.hashCodes!()) {
			const bucket = this._map.get(hashCode)
			if (bucket) {
				const index = bucket.findIndex(x => x.like!(val))
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

	*values(): IterableIterator<T> {
		for (const bucket of this._map.values()) {
			yield* bucket
		}
	}
	*entries(): IterableIterator<[T, T]> {
		for (const bucket of this._map.values()) {
			for (const value of bucket) {
				yield [value, value]
			}
		}
	}

	clear(): void {
		this._map.clear()
		this._size = 0
	}

	get size(): int {
		return this._size
	}

	toString() {
		return '{' + Array.from(this.values()).join(', ') + '}'
	}

	[Symbol.iterator] = JavaSet.prototype.values
	keys = JavaSet.prototype.values
}

export class Pair<L extends Equalable, R extends Equalable> implements Equalable {

	constructor(public left: L, public right: R) {}

	hashCode() {
		return this.left.hashCode() * 31 + this.right.hashCode()
	}

	equals(other: any) {
		return this == other || Object.getPrototypeOf(other) == Pair.prototype && this.left.equals(other.left) && this.right.equals(other.right)
	}

	toString() {
		return '(' + this.left.toString() + ', ' + this.right.toString() + ')'
	}

	toSource() {
		return 'new Pair(' + (this.left as any).toSource() + ', ' + (this.right as any).toSource() + ')'
	}
}