import {defineConfig} from 'orval';

// const docsUrl = process.env.VITE_GATEWAY || 'http://localhost:18081';
const docsUrl = 'http://localhost:18081';
export default defineConfig({
    qs: {
        input: {
            target: `${docsUrl}/v3/api-docs`,
            // 如果后端需要 token 才能访问 docs，可在这里加 headers
            // headers: { Authorization: 'Bearer xxx' }
        },
        output: {
            // 1. 请求函数根目录
            target: 'src/api/modules',
            // 2. 模型文件根目录
            schemas: 'src/types/models',
            // 3. 一个 tag 一个文件，防止单文件过大
            mode: 'tags-split',
            // 4. 生成结束后自动用项目 prettier 格式化
            prettier: true,
            // 5. 先清空旧文件，避免“下线接口”的僵尸代码
            clean: true,
            // 6. 每个目录自动生成 index.ts 做统一导出
            barrel: true,
            // 7. 复用项目里已经封装好的 axios 实例
            override: {
                axios: {
                    importPath: '@/utils/request',
                },
            },
            // 8. 生成的请求函数默认导出
            indexFiles: true,
            // 9. 模型文件后缀用 .ts 而不是 .d.ts，方便后续做「人工扩展」
            schemaType: 'ts',
        },
    },
});