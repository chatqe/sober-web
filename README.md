# SoberUP Blog

个人博客前端项目，基于 Vue 3 + TypeScript + Vite + Element Plus 构建。

## 快速开始

```bash
pnpm install
pnpm dev
```

访问 http://localhost:5173

## 测试账号

| 角色 | 账号 | 密码 | 说明 |
|------|------|------|------|
| 管理员 | zhangsan09 | 123456 | 拥有后台管理权限，可访问 /admin/* 路由 |

## 环境变量

| 变量 | 开发环境 | 生产环境 |
|------|---------|---------|
| VITE_BASE_URL | http://localhost:18081 | https://youngwanton.top/api |
| VITE_WEB_URL | http://localhost | https://youngwanton.top |
| VITE_UPLOAD_URL | http://localhost:8080/upload | - |
| VITE_IM_URL | http://localhost:81 | - |
| VITE_WEBSOCKET_URL | ws://localhost:8080/ws | - |

## 技术栈

- **Vue 3** - 渐进式框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Pinia** - 状态管理（含持久化）
- **Element Plus** - UI 组件库
- **Axios** - HTTP 客户端
- **Vue Router** - 路由管理

## 主要功能

- 文章列表与详情页
- 随笔（说说）功能
- 旅拍相册
- 音乐收藏
- 友情链接
- 留言板
- 管理员后台（文章/评论/用户/分类/标签管理）

## 脚本命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产环境构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm orval` | 根据 Swagger 生成 API 客户端 |
| `pnpm orval:watch` | 监听后端变化自动重新生成 API |
