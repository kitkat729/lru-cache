/* eslint @typescript-eslint/no-var-requires: 0 */
const { build } = require('esbuild');
const { Generator } = require('npm-dts');
const path = require('path');
const { dependencies, peerDependencies } = require('./package.json');

const config = {
  entryPoints: ['src/index.ts'],
  platform: 'node', // cjs
  bundle: true,
  minify: true,
  outdir: './lib',
  external: Object.keys(dependencies ?? {}).concat(Object.keys(peerDependencies ?? {})),
  logLevel: 'info',
};

const buildTypeFile = (entry) => {
  if (!entry) {
    return;
  }

  const file = path.parse(entry);

  new Generator({
    entry: file.base,
    output: path.join(config.outdir, `${file.name}.d.ts`),
  }).generate();
};

build(config);
config.entryPoints.forEach(buildTypeFile);
