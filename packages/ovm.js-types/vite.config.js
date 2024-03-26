import {defineConfig} from 'vite';
import {resolve} from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    // plugins: [
    //     dts({
    //         include: ['src'],
    //         rollupTypes: true,
    //         insertTypesEntry: true,
    //         declarationOnly: true,
    //         entryRoot: resolve(__dirname, 'src')
    //     })
    // ],
    build: {
        outDir: 'dist',
        lib: {
            fileName: 'index',
            name: 'index.js',
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es']
        }
    }
})