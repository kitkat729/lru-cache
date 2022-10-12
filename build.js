/* eslint @typescript-eslint/no-var-requires: 0 */
const { build } = require('esbuild');
const { Generator, ELogLevel } = require('npm-dts');
const path = require('path');
const { stat } = require('fs');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const config = {
  entryPoints: ['src/index.ts'],
  platform: 'node', // cjs
  bundle: true,
  minify: true,
  target: 'es6',
  outdir: './lib',
  plugins: [nodeExternalsPlugin()],
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
      logLevel: ELogLevel.error,
    },
    true,
    false,
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

try {
  config.entryPoints.forEach(buildTypeFile);
  build(config);
} catch (e) {
  console.error('Error: ', e);
  process.exit(1);
}
