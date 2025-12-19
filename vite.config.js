// https://vite.dev/config/
import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'


export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    plugins: [
        vue({
            template: {
                // 忽略 <meting-js>、<vue-baberrage> 两个自定义标签；
                compilerOptions: {
                    isCustomElement: (tag) => ['meting-js'].includes(tag)
                }
            }
        }),
        AutoImport({
            // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
            imports: ['vue'],

            resolvers: [
                ElementPlusResolver({importStyle: 'sass'}),
                // 自动导入图标组件
                IconsResolver({prefix: 'Icon',}),
            ]
        }),
        Components({
            resolvers: [
                ElementPlusResolver({importStyle: 'sass'}),
                // 自动注册图标组件
                IconsResolver({
                    prefix: 'Icon',// prefix: false,
                    enabledCollections: ['ep'],
                }),
            ]
        }),
        Icons({autoInstall: true,}),// 自动安装缺失的图标库
    ],

})
