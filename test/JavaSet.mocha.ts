import { JavaSet, int } from ".."
import { describe, it } from "mocha"
import { assert } from "chai"

class Key {
  constructor(public id: int, public data: int) {}
  equals(o: any) {
    return o == this || (o.id == this.id && o.data == this.data)
  }
  hashCode() {
    return this.id
  }
}

describe("JavaMap", () => {
  it("should be possible to add and test for elements", () => {
    const set = new JavaSet()
    const key0 = new Key(23, 32)
    set.add(key0)
    assert.ok(set.has(key0)) // same instance
    assert.ok(set.has(new Key(23, 32))) // different, identical instance
    assert.notOk(set.has(new Key(23, 42))) // same hashCode, not equal
    assert.notOk(set.has(new Key(22, 42))) // different hashCode, not equal
  })
})
