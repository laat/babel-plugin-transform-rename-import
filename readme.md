# babel-plugin-transform-rename-import [![Build Status][travis-image]][travis-url] [![npm][npm-image]][npm-url]
[npm-image]: https://img.shields.io/npm/v/babel-plugin-transform-rename-import.svg?style=flat
[npm-url]: https://npmjs.org/package/babel-plugin-transform-rename-import
[travis-image]: https://travis-ci.org/laat/babel-plugin-transform-rename-import.svg?branch=master
[travis-url]: https://travis-ci.org/laat/babel-plugin-transform-rename-import

> replace import sources

## Install

```
$ npm install --save babel-plugin-transform-rename-import
```

## babelrc
```js
{
  "plugins": [["transform-rename-import", { original: 'assert', replacement: 'power-assert' }]]
}
```

## Programatic Usage

```javascript
import plugin from 'babel-plugin-transform-rename-import'
import { transform } from 'babel-core'

function replace (code, original, replacement) {
  return transform(code, {
    babelrc: false,
    plugins: [
      [plugin, { original, replacement} ],
    ],
  }).code;
}

replace("require('foo')", 'foo', 'bar')
//=> "require('bar');"

replace("import foo from 'foo'", 'foo', 'bar')
//=> "import foo from 'bar';"

replace("require('foo/thingy')", 'foo', 'bar')
//=> "require('bar/thingy');"
```

## License

MIT © [Sigurd Fosseng](https://github.com/laat)
