/*global describe, it */
import visitor from './index.js'
import traverse from 'babel-traverse'
import generate from 'babel-generator'
import { transform } from 'babel-core'
import { expect } from 'chai'

function testGeneration (code, expectedCode) {
  const { ast } = transform(code)
  traverse(ast, visitor({
    replacement: '.',
    original: 'foobar'
  }).visitor)
  const transformedCode = generate(ast, {}, code).code
  expect(transformedCode.trim()).to.equal(expectedCode.trim())
}

describe('Babel replace import', () => {
  it('should replace normal imports', () => {
    testGeneration(`
import foo from 'foobar';
`, `
import foo from '.';
`)
  })
  it('should replace * imports', () => {
    testGeneration(`
import * as foo from 'foobar';
`, `
import * as foo from '.';
`)
  })
  it('should replace {} imports', () => {
    testGeneration(`
import { foo } from 'foobar';
`, `
import { foo } from '.';
`)
  })
  it('should replace {default as foobar} imports', () => {
    testGeneration(`
import { default as foobar } from 'foobar';
`, `
import { default as foobar } from '.';
`)
  })
  it('should replace require', () => {
    testGeneration(`
require('foobar')
`, `
require('.');
`)
  })
})
