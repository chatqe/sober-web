import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue({
        template: {
            // 忽略 <meting-js>、<vue-baberrage> 两个自定义标签；
            compilerOptions: {
                isCustomElement: (tag) => ['meting-js'].includes(tag)
            }
        }
    }),
        AutoImport({
            resolvers: [ElementPlusResolver({
                importStyle: 'sass'
            })]
        }),
        Components({
            resolvers: [ElementPlusResolver({
                importStyle: 'sass'
            })]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
})
