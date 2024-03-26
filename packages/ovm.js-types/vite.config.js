import {defineConfig} from 'vite';
import {resolve} from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        dts({
            include: ['src'],
            rollupTypes: true,
            insertTypesEntry: true,
            declarationOnly: true
        })
    ],
    build: {
        lib: {
            fileName: 'ovm.js',
            name: 'ovm.js',
            entry: resolve(__dirname, 'src/main.ts'),
            formats: ['es']
        }
    }
})