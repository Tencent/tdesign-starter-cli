import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  platform: 'node',
  outDir: 'bin',
  exports: true,
  shims: true,
  dts: false,
  copy: [
    {
      from: 'templates',
      to: 'bin',
      verbose: true
    }
  ]
});
