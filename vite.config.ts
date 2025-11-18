import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import postcssPxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    resolve: {
        mainFields: ['module'],
    },
    plugins: [
        angular({
            inlineStylesExtension: 'scss',
        }) as any,
    ],
    css: {
        postcss: {
            plugins: [
                autoprefixer,
                postcssPxToRem({
                    rootValue: 16,
                    unitPrecision: 5,
                    propList: ['*'],
                    selectorBlackList: ['.no-rem', '.ion-'],
                    exclude: /node_modules/i,
                }),
            ],
        },
    },
});
