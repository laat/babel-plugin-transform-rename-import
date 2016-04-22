/* eslint-disable no-param-reassign */
import * as t from 'babel-types';

function isModule(value, original) {
  const pattern = new RegExp(`^(${original}|${original}/.*)$`);
  return pattern.test(value);
}

function replace(value, original, replacement) {
  const pattern = new RegExp(`^${original}`);
  return value.replace(pattern, replacement);
}

export default function visitor({ original, replacement }) {
  const source = (value) => t.stringLiteral(replace(value, original, replacement));
  return {
    visitor: {
      ImportDeclaration(path) {
        const value = path.node.source.value;
        if (isModule(value, original)) {
          path.node.source = source(value);
        }
      },

      CallExpression(path) {
        const node = path.node;
        if (node.callee.name === 'require' &&
            node.arguments && node.arguments.length === 1 &&
            t.isStringLiteral(node.arguments[0]) &&
            isModule(node.arguments[0].value, original)) {
          path.node.arguments = [source(node.arguments[0].value)];
        }
      },
    },
  };
}
