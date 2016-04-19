/* eslint-disable no-param-reassign */
import * as t from 'babel-types';

export default function visitor({ original, replacement }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (original === path.node.source.value) {
          path.node.source = t.stringLiteral(replacement);
        }
      },

      CallExpression(path) {
        const node = path.node;
        if (node.callee.name === 'require' &&
            node.arguments && node.arguments.length === 1 &&
            t.isStringLiteral(node.arguments[0]) &&
            node.arguments[0].value === original) {
          path.node.arguments = [t.stringLiteral(replacement)];
        }
      },
    },
  };
}
