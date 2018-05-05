/* eslint-disable no-param-reassign */
function isModule(value, original) {
  const pattern = new RegExp(`^(${original}|${original}/.*)$`);
  return pattern.test(value);
}

function replace(value, original, replacement) {
  const pattern = new RegExp(`^${original}`);
  return value.replace(pattern, replacement);
}

function getReplacements(state) {
  if (state.opts instanceof Array) {
    return state.opts;
  } else if (state.opts && state.opts.replacements instanceof Array) {
    return state.opts.replacements;
  }
  return [state.opts];
}

export default function visitor({ types: t }) {
  const source = (value, original, replacement) =>
    t.stringLiteral(replace(value, original, replacement));
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const replacements = getReplacements(state);
        replacements.forEach(({ original, replacement }) => {
          const { value } = path.node.source;
          if (isModule(value, original)) {
            path.node.source = source(value, original, replacement);
          }
        });
      },

      CallExpression(path, state) {
        const replacements = getReplacements(state);
        replacements.forEach(({ original, replacement }) => {
          const { node } = path;
          if (
            node.callee.name === "require" &&
            node.arguments &&
            node.arguments.length === 1 &&
            t.isStringLiteral(node.arguments[0]) &&
            isModule(node.arguments[0].value, original)
          ) {
            path.node.arguments = [
              source(node.arguments[0].value, original, replacement)
            ];
          }
        });
      }
    }
  };
}
