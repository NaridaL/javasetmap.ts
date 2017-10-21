import {Equalable, JavaMap, int} from '..';
import {describe, it} from 'mocha';
import {assert} from 'chai';

class Key {
    constructor(public id: int, public data: int) {}
    equals(o: any) {
        return o == this || o.id == this.id && o.data == this.data
    }
    hashCode() {
        return this.id;
    }
}
declare global {
    interface Array<T> extends Equalable {}
    interface Number extends Equalable {}
}
Array.prototype.equals = function (o) {
    return this == o || this.length == o.length && this.every((el, i) => el.equals(o[i]))
}
Array.prototype.hashCode = function () {
    return this.reduce((acc, current) => acc * 31 + current.hashCode(), 0)
}
Number.prototype.equals = function (o) { return this == o }
Number.prototype.hashCode = function () { return this | 0 }
describe('JavaSet', () => {
    it('should be possible to add and test for elements', () => {

        const myMap = new JavaMap<any, string>()

        myMap.set([1, 2], "foo")
        assert.equal(myMap.has([1, 2]), true)
        assert.equal(myMap.get([1, 2]), "foo")
        assert.equal(myMap.has([1, 3]), false)
        assert.equal(myMap.get([2, 1]), undefined)
    });
});