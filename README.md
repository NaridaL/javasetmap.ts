<!--- header generated automatically, don't edit --->
[![Travis](https://img.shields.io/travis/NaridaL/javasetmap.ts.svg?style=flat-square)](https://travis-ci.org/NaridaL/javasetmap.ts)
[![npm](https://img.shields.io/npm/v/javasetmap.ts.svg?style=flat-square)](https://www.npmjs.com/package/javasetmap.ts)
[![David](https://img.shields.io/david/expressjs/express.svg?style=flat-square)](https://david-dm.org/NaridaL/javasetmap.ts)

# javasetmap.ts
Java-style Set and Map collections (on `{ hashCode(): int, equals(x: any): boolean}` objects) written in TypeScript.

## Installation
NPM:  `npm install javasetmap.ts --save`
    
In the browser, you can include the [UMD bundle](./dist/bundle.js) in a script tag, and the module will be available under the global `javasetmap_ts` 
    
<!--- CONTENT-START --->
## Usage
```ts
import {JavaMap} from 'javasetmap.ts'
// node: const {JavaMap} = require('javasetmap.ts')
// browser: const {JavaMap} = nla

declare global { // remove this block if not using TypeScript
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

const myMap = new JavaMap<[number, number], string>() // new JavaMap() if not using TypeScript

myMap.set([1, 2], "foo")
myMap.has([1, 2]) // === true
myMap.get([1, 2]) // === "foo"
myMap.has([1, 3]) // === false
myMap.get([2, 1]) // === undefined
```



<!--- CONTENT-END --->
<!--- footer generated automatically, don't edit --->
LICENSE
MIT
