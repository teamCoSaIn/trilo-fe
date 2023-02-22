const path = require('path');

const tsconfigPath = require('./tsconfig.path.json');

const aliases = Object.entries(tsconfigPath.compilerOptions.paths).map(
  ([key, value]) => {
    const k = key.slice(0, -2);
    const v = value[0].slice(0, -2);
    return [k, v];
  }
);

const webpackAliases = Object.fromEntries(
  aliases.map(([key, value]) => [key, path.resolve(__dirname, value)])
);

module.exports = {
  webpack: webpackAliases,
};
