import * as babel from "@babel/core";
import assert from "assert-simple-tap";
import plugin from "./index";

const testGeneration = (message, code, expectedCode) => {
  const transformedCode = babel.transform(code, {
    babelrc: false,
    plugins: [[plugin, { replacement: ".", original: "foobar" }]]
  }).code;
  assert.equal(transformedCode.trim(), expectedCode.trim(), message);
};

testGeneration(
  "replace normal imports",
  `
import foo from "foobar";
`,
  `
import foo from ".";
`
);

testGeneration(
  "replace * imports",
  `
import * as foo from "foobar";
`,
  `
import * as foo from ".";
`
);

testGeneration(
  "replace {} imports",
  `
import { foo } from "foobar";
`,
  `
import { foo } from ".";
`
);

testGeneration(
  "replace {default as foobar} imports",
  `
import { default as foobar } from "foobar";
`,
  `
import { default as foobar } from ".";
`
);

testGeneration(
  "replace require",
  `
require("foobar")
`,
  `
require(".");
`
);

testGeneration(
  "support addressing files in module",
  `
require("foobar/file");
`,
  `
require("./file");
`
);

testGeneration(
  "support importing of files within a module",
  `
import foo from "foobar/file";
`,
  `
import foo from "./file";
`
);

testGeneration(
  "support importing inside export statement",
  `
export { something } from "foobar";
`,
  `
export { something } from ".";
`
);

const testMultipleReplacements = (message, code, expectedCode) => {
  const transformedCode = babel.transform(code, {
    babelrc: false,
    plugins: [
      [
        plugin,
        {
          replacements: [
            { replacement: ".", original: "foobar" },
            { replacement: "baz", original: "bar" }
          ]
        }
      ]
    ]
  }).code;
  assert.equal(transformedCode.trim(), expectedCode.trim(), message);
};

testMultipleReplacements(
  "support importing of files within a module",
  `
import foo from "bar";

require("foobar");
`,
  `
import foo from "baz";

require(".");
`
);

const testMultipleReplacementsBabel7 = (message, code, expectedCode) => {
  const transformedCode = babel.transform(code, {
    babelrc: false,
    plugins: [
      [
        plugin,
        {
          replacements: [
            { replacement: ".", original: "foobar" },
            { replacement: "baz", original: "bar" }
          ]
        }
      ]
    ]
  }).code;
  assert.equal(transformedCode.trim(), expectedCode.trim(), message);
};

testMultipleReplacementsBabel7(
  "support importing of files within a module",
  `
import foo from "bar";

require("foobar");
`,
  `
import foo from "baz";

require(".");
`
);

const testRegexp = (message, { original, replacement }, code, expectedCode) => {
  const transformedCode = babel.transform(code, {
    babelrc: false,
    plugins: [[plugin, { replacements: [{ replacement, original }] }]]
  }).code;
  assert.equal(transformedCode.trim(), expectedCode.trim(), message);
};

testRegexp(
  "replaces with RegExp",
  {
    original: "^(.+?)\\.less$",
    replacement: "$1.css"
  },
  `
import css1 from "./foo.less";

const css2 = require("../bar.less");
`,
  `
import css1 from "./foo.css";

const css2 = require("../bar.css");
`
);
