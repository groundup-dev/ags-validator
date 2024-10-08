import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    json({
      compact: true,
      preferConst: true,
      namedExports: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationMap: true,
    }),
  ],
  external: ['zod'],
};