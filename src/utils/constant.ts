/**
 * 应用常量定义
 *
 * 包含 API 地址、CDN 路径、第三方接口、媒体资源、页面配置等常量。
 * 属性名保持与组件模板中使用的名称一致，确保向后兼容。
 *
 * @author sjq
 * @since 2025-12-25
 */

// API 状态码
export const API_CODES = {
  SUCCESS: 200,
  CLIENT_REDIRECT_LOGIN: 300,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// 超时时间
export const TIMEOUT = {
  DEFAULT: 10000,
  UPLOAD: 60000,
} as const;

// 邮件业务类型
export const EmailBizType = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
  RESET_PWD: 'RESET_PWD',
} as const;

/**
 * 应用级常量对象
 * 通过 app.provide('$constant', APP_CONSTANTS) 注入，供组件通过 inject('$constant') 使用
 */
export const APP_CONSTANTS = {
  // API 基础地址
  baseURL: 'http://localhost:18081',
  imBaseURL: 'http://localhost:81',
  webURL: 'http://localhost',

  // CDN 和静态资源路径
  live2d_path: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/',
  cdnPath: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/',
  waifuPath: '/webInfo/getWaifuJson',

  // 第三方接口
  hitokoto: 'https://v1.hitokoto.cn',
  shehui: 'https://api.oick.cn/yulu/api.php',
  tocbot: 'https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.18.2/tocbot.min.js',
  jinrishici: 'https://v1.jinrishici.com/all.json',

  // 媒体资源
  random_image: 'https://s1.ax1x.com/2022/12/04/zsKgDs.jpg?',
  index_image: 'https://img.soberup.top/qingsi/static/backgroundImg/173184198345798169878.jpg',
  favoriteVideo: 'https://www.corrain.top/static/assets/backgroundVideo.mp4',

  // 加密密钥（前后端一致，AES 16 位）
  cryptojs_key: 'huo!!!jiuzhegeya',

  // 七牛云配置
  qiniuUrl: 'https://upload.qiniup.com',
  qiniuDownload: 'https://img.soberup.top/',

  // 远端表情包地址
  fileEmojiUrl: 'https://img.soberup.top/qingsi/',

  // 友链页面默认数据
  friendWebName: '青肆博客',
  friendUrl: 'https://soberup.top',
  friendAvatar: 'https://img.soberup.top/qingsi/static/109951165563896271.jpg',
  friendIntroduction: '这是一个 Vue3 与 SpringBoot 结合的产物～',
  friendCover: 'https://img.soberup.top/qingsi/static/4d8c408eb91af725a36.jpg',
  friendBG: 'http://img.soberup.top/backgroundImg/12125413457542341.jpg',
  friendLetterTop: 'https://cdn.cbd.int/hexo-butterfly-envelope/lib/before.png',
  friendLetterBottom: 'https://cdn.cbd.int/hexo-butterfly-envelope/lib/after.png',
  friendLetterBiLi: 'https://cdn.cbd.int/hexo-butterfly-envelope/lib/line.png',
  friendLetterMiddle: 'https://cdn.cbd.int//hexo-butterfly-envelope/lib/violet.jpg',

  // 家页面卡片图片
  loveWeiYan: 'https://s1.ax1x.com/2022/12/04/zsKgDs.jpg',
  loveMessage: 'https://s1.ax1x.com/2022/12/04/zsKgDs.jpg',
  lovePhoto: 'https://s1.ax1x.com/2022/12/04/zsKh5V.jpg',
  loveLike: 'https://img.soberup.top/qingsi/static/assets/like.svg',
  newLike: 'https://img.soberup.top/qingsi/static/assets/newLike.svg',
  loveSortId: 1,
  loveLabelId: 1,

  // 渐变色配置
  before_color_list: ['black', 'rgb(131, 123, 199)', '#ee7752', '#e73c7e', '#23a6d5', '#23d5ab'],
  tree_hole_color: [
    'rgb(220, 255, 165)', 'rgb(164, 234, 192)', 'rgb(202, 241, 233)',
    'rgb(230, 230, 250)', 'rgb(180, 224, 255)', 'rgb(180, 203, 255)',
    'rgb(246, 223, 255)', 'rgb(255, 214, 198)', 'rgb(255, 205, 143)',
    'rgb(238, 255, 143)',
  ],
  before_color_1: 'black',
  after_color_1: 'linear-gradient(45deg, #f43f3b, #ec008c)',
  before_color_2: 'rgb(131, 123, 199)',
  after_color_2: 'linear-gradient(45deg, #f43f3b, #ec008c)',

  // 分类标签渐变色
  sortColor: [
    'linear-gradient(to right, #358bff, #15c6ff)',
    'linear-gradient(to right, #18e7ae, #1eebeb)',
    'linear-gradient(to right, #ff6655, #ffbf37)',
    'linear-gradient(120deg, rgba(255, 39, 232, 1) 0%, rgba(255, 128, 0, 1) 100%)',
    'linear-gradient(120deg, rgba(91, 39, 255, 1) 0%, rgba(0, 212, 255, 1) 100%)',
  ],

  // 页面主题色
  pageColor: '#ee7752',
  commentPageColor: '#23d5ab',

  // 用户 ID 和来源
  userId: 1,
  source: 0,

  // 表情列表
  emojiList: [
    '衰', '鄙视', '再见', '捂嘴', '摸鱼', '奋斗', '白眼', '可怜',
    '皱眉', '鼓掌', '烦恼', '吐舌', '挖鼻', '委屈', '滑稽', '啊这',
    '生气', '害羞', '晕', '好色', '流泪', '吐血', '微笑', '酷',
    '坏笑', '吓', '大兵', '哭笑', '困', '呲牙',
  ],
} as const;

// 类型导出
export type ApiCode = (typeof API_CODES)[keyof typeof API_CODES];
export type TimeoutKey = keyof typeof TIMEOUT;
export type EmailBizTypeValue = (typeof EmailBizType)[keyof typeof EmailBizType];
export type AppConstants = typeof APP_CONSTANTS;
