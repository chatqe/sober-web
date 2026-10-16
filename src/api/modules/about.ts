/**
 * 关于页（/about）API 模块
 *
 * 当前 GitHub 贡献数据接口由后端提供（见 E:\qs-ai\handoff\frontend-to-backend），
 * 接口未交付前 getGitHubContributions 走 mock 数据，交付后替换真实调用。
 *
 * @author Joy
 * @since 2026-10-16
 */

import request from '@/utils/request';

// GitHub 贡献数据（后端 GET /about/github/contributions?year=）尚未交付
export interface GitHubWeekData {
  /** 周一日期 YYYY-MM-DD */
  date: string;
  /** 7 天计数（周一开始），未知为 null */
  counts: (number | null)[];
}

export interface GitHubContributionsData {
  /** 账户登录名（回显用） */
  login: string;
  /** 统计年份 */
  year: number;
  /** 当年总贡献 */
  total: number;
  /** 周数据（每 7 天，周一为首） */
  weeks: GitHubWeekData[];
}

const MOCK_GITHUB_CONTRIBUTIONS: GitHubContributionsData = {
  login: 'youngwanton',
  year: new Date().getFullYear(),
  total: 0,
  weeks: [],
};

/**
 * 获取 GitHub 年度贡献（前端 mock，后端接口交付后替换）
 */
export const getGitHubContributions = async (year: number): Promise<GitHubContributionsData> => {
  return { ...MOCK_GITHUB_CONTRIBUTIONS, year, total: 0, weeks: [] };
};

// 项目卡片（使用 resAgg 端点，classify 区分 Programs / Learnings）
export const ABOUT_PROJECT_CLASSIFY = ['Programs', 'Learnings'] as const;

/**
 * 获取关于页项目卡片数据
 * 后端端点：POST /resAgg/listWeblinks，支持 classify 过滤
 * @returns { records, total }
 */
export const getAboutProjects = async (classify: string): Promise<{ records: any[]; total: number }> => {
  const res = await request.post<{ records?: any[]; total?: number }>(
    '/resAgg/listWeblinks',
    { pageNum: 1, pageSize: 50, classify }
  );
  const data = res.data ?? { records: [], total: 0 };
  return { records: data.records ?? [], total: data.total ?? 0 };
};
