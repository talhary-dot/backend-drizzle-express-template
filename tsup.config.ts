import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/server.ts'],
    format: ['cjs'],
    clean: true,
    minify: true,
    splitting: false,
    sourcemap: false,
    keepNames: false,
    outDir: 'dist',
    target: 'es2022',
    platform: 'node',
    shims: true,
    noExternal: [/(.*)/]
});
