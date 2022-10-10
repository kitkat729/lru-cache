/* eslint @typescript-eslint/no-var-requires: 0 */
const { build } = require('esbuild');
const { Generator, ELogLevel } = require('npm-dts');
const path = require('path');
const { stat } = require('fs');
const { dependencies, peerDependencies } = require('./package.json');

const config = {
  entryPoints: ['src/index.ts'],
  platform: 'node', // cjs
  bundle: true,
  minify: true,
  target: 'es6',
  outdir: './lib',
  external: Object.keys(dependencies ?? {}).concat(Object.keys(peerDependencies ?? {})),
  logLevel: 'info',
};

const buildTypeFile = (entry) => {
  if (!entry) {
    return;
  }

  const file = path.parse(entry);
  const outfile = `${file.name}.d.ts`;

  new Generator(
    {
      entry: file.base,
      output: path.join(config.outdir, outfile),
      logLevel: ELogLevel.info,
    },
    false,
    true,
  )
    .generate()
    .then(() => {
      stat(path.join(config.outdir, outfile), (err, stats) => {
        if (err) {
          throw err;
        }
        console.log(`  ${path.join(config.outdir, outfile)}  ${stats.size}b`);
      });
    });
};

config.entryPoints.forEach(buildTypeFile);

build(config);
