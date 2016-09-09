import * as babel from 'babel-core';
import assert from 'assert-simple-tap';
import plugin from './index.js';

const testGeneration = (message, code, expectedCode) => {
  const transformedCode = babel.transform(code, { babelrc: false,
    plugins: [
      [plugin, { replacement: '.', original: 'foobar' }],
    ],
  }).code;
  assert.equal(transformedCode.trim(), expectedCode.trim(), message);
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
