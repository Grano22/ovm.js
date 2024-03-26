import {defineConfig} from 'vite';
import {resolve} from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';
import * as path from "path";
import * as fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dynamicPrependContentPlugin = (prependContent) => {
    return {
        name: 'dynamic-prepend-content',
        generateBundle(options, bundle) {
            for (const [fileName, fileDetails] of Object.entries(bundle)) {
                if (fileDetails.type === 'chunk' && fileName.endsWith('.js')) {
                    fileDetails.code = `${prependContent}${fileDetails.code}`;
                }
            }
        }
    }
};

export default defineConfig({
    plugins: [
        //dts({ include: ['src'], rollupTypes: true })
        dynamicPrependContentPlugin(`/**
* @author Adrian Błasiak (Grano22)
*/
`)
    ],
    esbuild: {
        minify: true
    },
    build: {
        copyPublicDir: false,
        minify: true,
        cssMinify: true,
        lib: {
            fileName: 'ovm',
            name: 'ovm.js',
            entry: resolve(__dirname, 'src/main.ts'),
            formats: ['es']
        }
        // alias: [
        //     { find: '@ovm.js/types', replacement: fileURLToPath(new URL('../node_modules/@ovm.js/types/', import.meta.url)) },
        // ]
    }
})