/**
 * 类型统一入口
 * 汇总所有 API 业务类型，供 modules 层使用
 *
 * 处理跨文件同名类型冲突：通过别名重导出避免 TS2308
 */

// 无冲突的模块直接导出
export * from './comment';
export * from './family';
export * from './weiYan';

// 资源路径类型：保留 resource.ts 版本（更完整），webInfo.ts 版本跳过
export * from './resource';
export type {
  LovePhoto,
  WebInfoBase,
  WebInfoDetail,
  HistoryInfo,
  TreeHoleBase,
  TreeHoleDetail,
  TreeHoleListResponse,
  FunnyContent,
  CollectContent,
} from './webInfo';

// 七牛云/上传类型：保留 qiniu.ts 版本（无重复），upload.ts 中 QiniuTokenResponse/ResourceInfo/UploadResponse 跳过
export * from './qiniu';
export type { UploadOptions, ResourceInfo, UploadResponse } from './upload';

// 文章类型：保留 article.ts，跳过重复的 QiniuTokenResponse/ResourceInfo/UploadResponse
export type {
  CategoryInfo,
  TagInfo,
  SortAndLabelResponse,
  ArticleBase,
  ArticleDetail,
  Category,
  Tag,
  ArticleListParams,
  ArticleListResponse,
  ArticleStatusParams,
  ArticleDeleteParams,
  ArticleLikeParams,
} from './article';

// 认证类型：保留 auth.ts，user.ts 中重复的 LoginParams/LoginResponse/UserInfo/CaptchaParams 跳过
export type {
  RefreshTokenParams,
  RefreshTokenResponse,
} from './auth';

// 认证/用户共用的基础类型（auth.ts 和 user.ts 均有导出，通过 barrel 统一出口）
export type {
  LoginParams,
  LoginResponse,
  UserInfo,
  CaptchaParams,
  CaptchaResponse,
  CaptchaCheckParams,
  EmailCodeParams,
} from './auth';

// 用户类型：保留 user.ts 中的其余类型，跳过与 auth.ts 重复的 LoginParams/LoginResponse/UserInfo/CaptchaParams
export type {
  UserBase,
  UserDetail,
  RegisterParams,
  UserListParams,
  UserListResponse,
  UpdateUserParams,
  ResetPasswordParams,
} from './user';

// 友链类型：保留 weblinks.ts 中的 FriendLink*，跳过重复的 WebInfo/SortInfo
export type {
  FriendLinkBase,
  FriendLinkDetail,
  WebInfo,
  SortInfo,
} from './weblinks';
