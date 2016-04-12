# babel-plugin-transform-rename-import

[![npm][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/babel-plugin-transform-rename-import.svg?style=flat
[npm-url]: https://npmjs.org/package/babel-plugin-transform-rename-import
[travis-image]: https://travis-ci.org/laat/babel-plugin-transform-rename-import.svg?branch=master
[travis-url]: https://travis-ci.org/laat/babel-plugin-transform-rename-import

> replace import sources

## Install

```
$ npm install --save babel-plugin-transform-rename-import
```

## Usage

```javascript
import visitor from 'babel-plugin-transform-rename-import'
import traverse from 'babel-traverse'
import generate from 'babel-generator'
import { transform } from 'babel-core'

function replace (code, original, replacement) {
  const { ast } = transform(code)
  traverse(ast, visitor({ replacement, original }).visitor)
  return generate(ast, {}, code).code.trim()
}

replace("require('foo')", 'foo', 'bar')
//=> "require('bar');"

replace("import foo from 'foo'", 'foo', 'bar')
//=> "import foo from 'bar';"
```

## License

MIT © [Sigurd Fosseng](https://github.com/laat)
