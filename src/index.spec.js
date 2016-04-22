/* global describe, it */
import visitor from './index.js';
import traverse from 'babel-traverse';
import generate from 'babel-generator';
import { transform } from 'babel-core';
import test from 'tape';

test('rename import', (t) => {
  const testGeneration = (message, code, expectedCode) => {
    const { ast } = transform(code);
    traverse(ast, visitor({
      replacement: '.',
      original: 'foobar',
    }).visitor);
    const transformedCode = generate(ast, {}, code).code;
    t.equal(transformedCode.trim(), expectedCode.trim(), message);
  };

  testGeneration('replace normal imports', `
import foo from 'foobar';
`, `
import foo from '.';
`);
  testGeneration('replace * imports', `
import * as foo from 'foobar';
`, `
import * as foo from '.';
`);
  testGeneration('replace {} imports', `
import { foo } from 'foobar';
`, `
import { foo } from '.';
`);
  testGeneration('replace {default as foobar} imports', `
import { default as foobar } from 'foobar';
`, `
import { default as foobar } from '.';
`);
  testGeneration('replace require', `
require('foobar')
`, `
require('.');
`);
  testGeneration('support addressing files in module', `
require('foobar/file');
`, `
require('./file');
`);
  testGeneration('support importing of files within a module', `
import foo from 'foobar/file';
`, `
import foo from './file';
`);
  t.end();
});
