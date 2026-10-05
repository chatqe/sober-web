# 技术债清单

> 更新时间：2026-10-05
> 来源：API 解包重构（commit b4302c9 ~ e805152）+ 后续收尾

---

## 高优先级

### 1. TypeScript baseline 错误（8 条）

- **现状**：`pnpm type-check`（vue-tsc 5.9.3）当前有 8 条 TS 错误，CI 接入时建议先设 `continue-on-error: true`
- **清单**：
  ```
  src/components/business/comment/CommentList.vue(246,9):
    Type 'CommentDetail[]' is not assignable to type 'Comment[]'
  src/components/business/comment/Graffiti.vue(132,55):
    Cannot find module '../common/proButton.vue'
  src/components/business/danmaku/Danmaku.vue(9,14):
    Type 'any[]' is not assignable to type 'ComputedGetter<unknown[]>'
  src/components/business/danmaku/Danmaku.vue(10,14):
    Type 'boolean' is not assignable to type 'ComputedGetter<boolean>'
  src/components/business/danmaku/Danmaku.vue(11,14):
    Type 'number' is not assignable to type 'ComputedGetter<number>'
  src/components/business/danmaku/Danmaku.vue(13,14):
    Type 'boolean' is not assignable to type 'ComputedGetter<boolean>'
  src/components/business/friend/MyAside.vue(278,7):
    Type 'ArticleDetail[]' is not assignable to type 'Article[]'
    （ArticleDetail.id 为 optional，Article.id 为 required）
  src/views/front/article/index.vue(607,7):
    Type 'ArticleDetail' is not assignable to type 'Article | {...}'
    （ArticleDetail.id 为 optional）
  ```
- **建议**：独立 PR 逐条清理，重点修复 `Graffiti.vue`（模块不存在）和 `Danmaku.vue`（Computed 类型误用）

---

## 中优先级

### 2. Orval 生成方法名不稳定

- **现象**：`list1` / `list2` / `list3` 随后端 Swagger 变更漂移，手写模块引用易失效
- **案例**：本次重构 `list2 → list3` 导致后台弹幕列表一度报错；`list1Params.ts` / `list3Params.ts` 被删除
- **影响**：每次后端接口变更都会引发连锁修复，且生成文件未 gitignore（见问题 4）
- **建议**：
  - 后端在 Controller 方法加 `@Operation(operationId = "xxx")` 固定 operationId
  - 或前端 Orval 配置 `override.operationName` 生成稳定名称

### 3. Orval 生成文件未真正 untrack

- **现象**：`src/api/generated/` 和 `src/types/modules/` 已加入 `.gitignore`，但历史上已被 tracked，gitignore 对已跟踪文件不生效
- **影响**：每次 `pnpm orval` 重新生成后 git status 被 200+ 文件污染（本次 staged 222 个文件即为证据）
- **建议动作**（独立任务，需团队确认）：
  1. 团队讨论是否切换为"生成文件不入库"约定
  2. 若同意：更新 CI（加 `pnpm orval` 步骤）+ README + 新人文档
  3. 执行 `git rm -r --cached src/api/generated/ src/types/modules/` 并 commit
  4. 通知所有开发者 `git pull` 后跑一次 `pnpm orval`
- **依赖**：团队确认 + CI 就绪

### 4. Rollup circular dependency — useSortInfoStore

- **现象**：`src/stores/index.ts` 从 `categoryInfo.ts` re-export `useSortInfoStore`，而 `categoryInfo.ts` 间接依赖 `index.ts`，形成跨 chunk 循环依赖
- **影响**：构建时产生 4 条 rollup 警告，运行时执行顺序不确定
- **涉及文件**（build 警告来源）：
  - `src/layouts/FrontLayout/index.vue:102`
  - `src/views/front/index.vue:140`
  - `src/views/front/sort/index.vue:52`
  - `src/components/business/friend/MyAside.vue:141`
- **建议**：将以上 4 处改为直接 import `from '@/stores/modules/categoryInfo'`，绕过 barrel export

### 5. `>>>` 废弃 CSS 组合器

- **现象**：`>>>` 组合器在 Vue 3 + SCSS 中已废弃，应使用 `:deep()`
- **涉及文件**：
  - `src/views/front/love/index.vue:1086, 1093, 1099, 1173, 1177`
  - `src/views/front/user/index.vue:1172, 1177`
- **影响**：构建工具升级后可能失效，代码可读性下降
- **建议**：逐一替换为 `:deep(.el-input__inner)` 等写法

### 6. Build 大 chunk 警告

- **现象**：`vite build` 输出 `(!) Some chunks are larger than 500 kB after minification`
- **影响**：首屏加载时间增长，用户体验下降
- **建议**：在 `vite.config.js` 配置 `build.rollupOptions.output.manualChunks` 拆分 Element Plus 和大体积组件

---

## 低优先级

### 7. request2.js 遗留文件

- **现象**：`src/utils/request2.js` 是独立 axios 实例，未接入新拦截器链（`responseHandler.ts` / `handleError`）
- **影响**：若有引用点，行为与其他请求不一致（无统一错误处理、无 token 刷新逻辑）
- **引用情况**：全项目 `grep` 无 import 记录（`src/views/front/love/index.vue` 和 `src/views/front/user/index.vue` 引用的是其他路径）
- **建议**：确认无引用后删除 `src/utils/request2.js`

### 8. 项目根目录散落测试产物

- **现象**：以下 untracked 文件长期堆积，污染 git status
  - `*.png`（5 张截图）
  - `scripts/*.cjs`（6 个测试脚本）
  - `.playwright-mcp/`（Playwright MCP 工作目录）
  - `CLAUDE.md.bak-*`（备份文件）
  - `src/components/structure.txt`（临时文件）
- **影响**：git status 噪音，干扰真实变更识别
- **建议**：加入 `.gitignore` 或清理（需单独决策）

---

## 已解决（本次重构）

- Path A / Path B 解包策略不一致 → `responseHandler.ts` 统一 `UnwrapR<T>` mutator
- 消费者 `.data` 访问模式混乱 → 10 个文件消费侧修正
- admin 弹幕列表接口迁移（`/admin/danmaku/boss/list` → `/admin/danmaku/list`）
- admin 弹幕路由修复（`treeHoleList` → `danmaku`）
- NewTreeHole.vue 死代码清理（403 行，零引用，含 `router.push('/weiYan')` 预存 bug）
