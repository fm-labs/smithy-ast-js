// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

import dts from 'rollup-plugin-dts'

const config = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/smithy-ast.js',
      format: 'cjs'
    },
    plugins: [
      typescript(),
      json()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/smithy-ast.umd.js',
      format: 'umd',
      name: 'smithy-ast'
    },
    plugins: [
      typescript(),
      json()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/smithy-ast.esm.js',
      format: 'es',
    },
    plugins: [
      typescript(),
      json()
    ]
  },
  {
    input: './dist/out/index.d.ts',
    output: [{ file: 'dist/smithy-ast.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]

export default config
