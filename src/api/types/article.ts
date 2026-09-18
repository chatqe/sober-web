/**
 * 文章模块类型定义
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

// 分类信息接口
export interface CategoryInfo {
  id: number;
  name: string;
  [key: string]: any;
}

// 标签信息接口
export interface TagInfo {
  id: number;
  name: string;
  categoryId?: number;
  [key: string]: any;
}

// 分类和标签列表响应
export interface SortAndLabelResponse {
  sorts: CategoryInfo[];
  labels: TagInfo[];
  [key: string]: any;
}

// 文章基础信息接口 (对应后端 ArticleVO)
export interface ArticleBase {
  id?: number;
  userId?: number;
  title: string;
  content: string;
  articleCover?: string;
  articleTitle?: string;
  viewCount?: number;
  likeCount?: number;
  commentStatus?: boolean;
  recommendStatus?: boolean;
  videoUrl?: string;
  password?: string;
  tips?: string;
  viewStatus?: boolean;
  hasVideo?: boolean;
  sortId?: string;
  labelId?: number;
  commentCount?: number;
  username?: string;
  category?: Category;
  tag?: Tag;
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 文章详情接口
export interface ArticleDetail extends ArticleBase {
  createTime: string;
  updateTime: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  sortName?: string;
  labelName?: string;
  tags?: TagInfo[];
  [key: string]: any;
}

// 分类对象
export interface Category {
  id: number;
  name: string;
  desc?: string;
  [key: string]: any;
}

// 标签对象
export interface Tag {
  id: number;
  name: string;
  [key: string]: any;
}

// 文章列表查询参数 (对应后端 ArticlePageDTO)
export interface ArticleListParams {
  pageNum?: number;
  pageSize?: number;
  desc?: boolean;
  searchKey?: string;
  sortId?: string;
  recommendStatus?: boolean;
  labelId?: number;
  articleSearch?: string;
  [key: string]: any;
}

// 文章列表响应
export interface ArticleListResponse {
  list: ArticleDetail[];
  total: number;
  [key: string]: any;
}

// 文章状态更新参数 (对应后端 GET /admin/article/changeArticleStatus)
export interface ArticleStatusParams {
  articleId?: number;
  id?: number;
  viewStatus?: boolean;
  commentStatus?: boolean;
  recommendStatus?: boolean;
  [key: string]: any;
}

// 文章删除参数
export interface ArticleDeleteParams {
  id?: number;
  [key: string]: any;
}

// 文章点赞参数 (对应后端 ArticleDTO)
export interface ArticleLikeParams {
  articleId?: number;
  userId?: number;
  operation?: string;
  commentId?: number;
  [key: string]: any;
}

// 七牛云上传token响应
export interface QiniuTokenResponse {
  uptoken: string;
  [key: string]: any;
}

// 资源信息接口
export interface ResourceInfo {
  id?: number;
  name: string;
  url: string;
  type: string;
  size: number;
  [key: string]: any;
}

// 资源上传响应
export interface UploadResponse {
  url: string;
  [key: string]: any;
}
