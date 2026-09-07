<template>
  <div>
    <!-- 网站信息 -->
    <!--    <div v-if="!$common.mobile()" class="card-content1 shadow-box background-opacity">-->
    <div class="card-content1 shadow-box background-opacity">
      <el-avatar style="margin-top: 20px" class="user-avatar" :size="120" :src="webInfo.avatar"></el-avatar>
      <div class="web-name">{{ webInfo.webName }}</div>
      <div class="web-info">
        <div class="blog-info-box">
          <span>文章</span>
          <span class="blog-info-num">{{ articleTotal }}</span>
        </div>
        <div class="blog-info-box">
          <span>分类</span>
          <span class="blog-info-num">{{ sortInfo.length }}</span>
        </div>
        <div class="blog-info-box">
          <span>访问量</span>
          <span class="blog-info-num">{{ webInfo.historyAllCount }}</span>
        </div>
      </div>
      <a class="collection-btn" @click="showTip()">
        <el-icon style="margin-right: 2px; vertical-align: -2px;">
          <StarFilled/>
        </el-icon>
        朋友圈
      </a>
    </div>

    <!-- 搜索 -->
    <div class="shadow-box background-opacity wow aside-card">
      <div class="aside-card-top">
        🔍搜索
        <div class="mac-tab-style"></div>
      </div>

      <div class="aside-card-info" style="display: flex;">
        <input class="ais-SearchBox-input" type="text"
               v-model="articleSearch"
               placeholder="看看吧" maxlength="32"
               @keyup.enter="selectArticle()">
        <div class="ais-SearchBox-submit" @click="selectArticle()">
          <svg style="margin-top: 3.5px;margin-left: 18px" viewBox="0 0 1024 1024" width="20" height="20">
            <path
                d="M51.2 508.8c0 256.8 208 464.8 464.8 464.8s464.8-208 464.8-464.8-208-464.8-464.8-464.8-464.8 208-464.8 464.8z"
                fill="#51C492"></path>
            <path
                d="M772.8 718.4c48-58.4 76.8-132.8 76.8-213.6 0-186.4-151.2-337.6-337.6-337.6-186.4 0-337.6 151.2-337.6 337.6 0 186.4 151.2 337.6 337.6 337.6 81.6 0 156-28.8 213.6-76.8L856 896l47.2-47.2-130.4-130.4zM512 776c-149.6 0-270.4-121.6-270.4-271.2S363.2 233.6 512 233.6c149.6 0 271.2 121.6 271.2 271.2C782.4 654.4 660.8 776 512 776z"
                fill="#FFFFFF"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 推荐文章 -->
    <div v-if="!$common.isEmpty(recommendArticles)"
         class="shadow-box background-opacity  wow aside-card">
      <!--<div  class="card-content2-title">-->
      <div class="aside-card-top">
        <!--        <span>🔥推荐文章</span>-->
        🥝推荐文章
        <div class="mac-tab-style"></div>
      </div>
      <div class="aside-card-info">
        <div v-for="(article, index) in recommendArticles"
             :key="index"
             @click="router.push({path: '/article', query: {id: article.id}})">
          <div class="aside-post-detail">
            <div class="aside-post-image">
              <el-image lazy class="my-el-image" :src="article.articleCover" fit="cover"
              >
                <template #error>
                  <div class="image-slot">
                    <div class="error-aside-image">
                      {{ article.username }}
                    </div>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="aside-post-title">
              {{ article.articleTitle }}
            </div>
          </div>
          <div class="aside-post-date">
            <el-icon style="margin-right: 4px; vertical-align: -2px;">
              <Calendar/>
            </el-icon>
            {{ article.createTime }}
          </div>
        </div>
      </div>

    </div>

    <!-- 速览 -->
    <!--<div v-if="!$common.mobile()" class="selectSort">-->
    <!--  <div v-for="(sort, index) in sortInfo"-->
    <!--       @click="selectSort(sort)"-->
    <!--       :key="index"-->
    <!--       :style="{background: $constant.sortColor[index % $constant.sortColor.length]}"-->
    <!--       class="shadow-box-mini background-opacity wow"-->
    <!--       style="position: relative;padding: 10px 25px 15px;border-radius: 10px;animation: hideToShow 1s ease-in-out;margin-top: 30px;cursor: pointer;color: var(&#45;&#45;white)">-->
    <!--    <div>速览</div>-->
    <!--    <div class="sort-name">-->
    <!--      {{ sort.sortName }}-->
    <!--    </div>-->
    <!--    <div style="font-weight: bold;margin-top: 8px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">-->
    <!--      {{ sort.sortDescription }}-->
    <!--    </div>-->
    <!--  </div>-->
    <!--</div>-->

    <!--标签云-->
    <div class="shadow-box background-opacity wow aside-card">
      <div class="aside-card-top">
        🏷️标签
        <div class="mac-tab-style"></div>
      </div>

      <div class="aside-card-info ">
        <div ref="cloudRef" class="tag-cloud">
          <!--<span v-for="t in tags" :key="t">{{ t }}</span>-->
        </div>
      </div>
    </div>


    <!--    最新树洞-->
    <newTreeHole></newTreeHole>


  </div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, ref} from 'vue'
import router from '@/router'
import {ElMessage} from 'element-plus'
import {Calendar, StarFilled} from '@element-plus/icons-vue'
import {useSortInfoStore, useUserStore, useWebInfoStore} from '@/stores'
import {articleApi} from '@/api/index.js'
import newTreeHole from "./newTreeHole.vue"
import TagCloud from 'TagCloud'

// 定义注入的类型
interface CommonUtils {
  isEmpty: (value: any) => boolean

  [key: string]: any
}

interface AppConstants {
  sortColor?: string[]

  [key: string]: any
}

// 定义数据接口
interface Pagination {
  current: number
  size: number
  recommendStatus: boolean
}

interface Article {
  id: number
  articleTitle: string
  articleCover?: string
  username: string
  createTime: string

  [key: string]: any
}

interface CategoryItem {
  id: number
  name: string
  description: string
  status: number

  [key: string]: any
}

interface WebInfo {
  avatar?: string
  webName?: string
  historyAllCount?: number

  [key: string]: any
}

// 获取注入的全局属性
const $common = inject<CommonUtils>('$common')!
const $constant = inject<AppConstants>('$constant')!

// 路由和状态管理
const webInfoStore = useWebInfoStore()
const userStore = useUserStore()
const sortInfoStore = useSortInfoStore()

// 响应式数据
const pagination: Ref<Pagination> = ref({
  current: 1,
  size: 5,
  recommendStatus: true
})
const recommendArticles: Ref<Article[]> = ref([])
const admires: Ref<any[]> = ref([])
const showAdmireDialog: Ref<boolean> = ref(false)
const articleSearch: Ref<string> = ref("")

const cloudRef = ref<HTMLElement | null>(null)
const tags: Ref<string[]> = ref(sortInfoStore.tags || ['Vue3', 'Vite', 'TS', 'Pinia', '标签云'])

// 生命周期
onMounted(() => {
  getRecommendArticles()
  if (cloudRef.value) {
    TagCloud(cloudRef.value, tags.value, {
      radius: 150,          // 标签云旋转半径（px）
      maxSpeed: 'fast',     // 最大速度 'slow'/'normal'/'fast'）
      initSpeed: 'normal',  // 初始速度
      direction: 135,       // 旋转方向 （顺时针角度，如0=上，90=左）
      keep: true            // 鼠标移出后是否继续旋转
    })
  }
})

// 计算属性
const webInfo = computed<WebInfo>(() => webInfoStore.webInfo)
const sortInfo = computed<CategoryItem[]>(() => {
  // 过滤不显示的sort列表
  return sortInfoStore.sortInfo.filter(item => item.status !== 0)
})
const articleTotal = computed<number>(() => sortInfoStore.articleTotal)
const currentUser = computed(() => userStore.currentUser)

// 定义emit
const emit = defineEmits<{
  selectSort: [sort: CategoryItem]
  selectArticle: [searchValue: string]
}>()

// 方法
const selectSort = (sort: CategoryItem): void => {
  emit("selectSort", sort)
}

const selectArticle = (): void => {
  emit("selectArticle", articleSearch.value)
}

const showAdmire = (): void => {
  if ($common.isEmpty(currentUser.value)) {
    ElMessage({
      message: "请先登录！",
      type: "error"
    })
    return
  }

  showAdmireDialog.value = true
}

const getRecommendArticles = async (): Promise<void> => {
  try {
    const res = await articleApi.getArticleList(pagination.value)
    if (!$common.isEmpty(res.data)) {
      recommendArticles.value = res.data.list
    }
  } catch (error: any) {
    ElMessage({
      message: error.message || '获取推荐文章失败',
      type: "error"
    })
  }
}

const showTip = (): void => {
  router.push({path: '/weiYan'})
}
</script>

<style scoped>
.card-content1 {
  background: linear-gradient(-45deg, #e8d8b9, #eccec5, #a3e9eb, #bdbdf0, #eec1ea);
  background-size: 400% 400%;
  animation: gradientBG 10s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  position: relative;
  /*color: var(--white);*/
  overflow: hidden;
}

.card-content1 :not(:first-child) {
  z-index: 10;
}

.web-name {
  font-size: 30px;
  font-weight: bold;
  margin: 20px 0;
}

.web-info {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.blog-info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.blog-info-num {
  margin-top: 12px;
}

.collection-btn {
  position: relative;
  margin-top: 12px;
  background: var(--lightGreen);
  cursor: pointer;
  width: 65%;
  height: 35px;
  border-radius: 1rem;
  text-align: center;
  line-height: 35px;
  color: var(--white);
  overflow: hidden;
  z-index: 1;
  margin-bottom: 25px;
}

.collection-btn::before {
  background: var(--gradualRed);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: "";
  transform: scaleX(0);
  transform-origin: 0;
  transition: transform 0.5s ease-out;
  transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
  border-radius: 1rem;
  z-index: -1;
}

.collection-btn:hover::before {
  transform: scaleX(1);
}

.card-content2-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--lightGreen);
  font-weight: bold;
  height: 42px;
  line-height: 42px;
  border-bottom: 1px solid var(--lightGreen);
}

.card-content2-icon {
  color: var(--red);
  margin-right: 5px;
  animation: scale 1s ease-in-out infinite;
}

.aside-post-detail {
  display: flex;
  cursor: pointer;
}

.aside-post-image {
  width: 40%;
  height: 73px;
  border-radius: 0.4rem;
  margin-right: 8px;
  overflow: hidden;
}

.error-aside-image {
  background: var(--themeBackground);
  color: var(--white);
  padding: 10px;
  text-align: center;
  width: 100%;
  height: 100%;
}

.aside-post-title {
  width: 60%;
  /* white-space: nowrap; 强制不换行*/
  /*text-overflow: ellipsis; 超出部分在内容尾部显示...*/
  margin-top: 5px;
  font-size: 15px;
}

.aside-post-date {
  margin-top: 8px;
  margin-bottom: 20px;
  color: var(--greyFont);
  font-size: 12px;
}

.post-sort {
  border-radius: 1rem;
  margin-bottom: 15px;
  line-height: 30px;
  transition: all 0.3s;
}

.post-sort:hover {
  background: var(--themeBackground);
  padding: 2px 15px;
  cursor: pointer;
  color: var(--white);
}

.sort-name {
  font-weight: bold;
  font-size: 25px;
  margin-top: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sort-name:after {
  top: 84px;
  width: 22px;
  left: 26px;
  height: 2px;
  background: var(--white);
  content: "";
  border-radius: 1px;
  position: absolute;
}

.admire-box {
  background: var(--springBg) center center / cover no-repeat;
  padding: 25px;
  border-radius: 10px;
  animation: hideToShow 1s ease-in-out;
  margin-top: 30px;
}

.admire-btn {
  padding: 13px 15px;
  background: var(--maxLightRed);
  border-radius: 3rem;
  color: var(--white);
  width: 100px;
  user-select: none;
  cursor: pointer;
  text-align: center;
  margin: 20px auto 0;
  transition: all 1s;
}

.admire-btn:hover {
  transform: scale(1.2);
}

.admire-image {
  margin: 0 auto 10px;
  border-radius: 10px;
  height: 150px;
  width: 150px;
  background: var(--admireImage) center center / cover no-repeat;
}

.admire-content {
  font-size: 12px;
  color: var(--maxGreyFont);
  line-height: 1.5;
  margin: 5px;
}

.ais-SearchBox-input {
  padding: 0 14px;
  height: 30px;
  width: calc(100% - 50px);
  outline: 0;
  border: 2px solid var(--lightGreen);
  border-right: 0;
  border-radius: 40px 0 0 40px;
  color: var(--maxGreyFont);
  background: var(--white);
}

.ais-SearchBox-submit {
  height: 30px;
  width: 50px;
  border: 2px solid var(--lightGreen);
  border-left: 0;
  border-radius: 0 40px 40px 0;
  background: var(--white);
  cursor: pointer;
}

.aside-card {
  padding: 5px;
  border-radius: 10px;
  margin-top: 30px;
  animation: hideToShow 1s ease-in-out;
  background: var(--card-bg);
}

/*卡片顶部*/
.aside-card-top {
  padding-left: 10px;
  margin-top: -4px;
  height: 42px;
  line-height: 42px;
  border-bottom: 1px solid #ccc;
  position: relative;
  color: var(--lightGreen);
  font-size: 16px;
  font-weight: bold;
}

.aside-card-info {
  padding: 15px 15px 10px 15px;
}

.tag-cloud :deep(.tagcloud) {
  width: 100% !important;
}

.tag-cloud :deep(.tagcloud--item) {
  color: var(--greyFont) !important;
  font-size: 14px !important;
  cursor: pointer;
  transition: all .3s ease;
}

.tag-cloud :deep(.tagcloud--item:hover) {
  color: var(--lightGreen) !important;
  font-size: 16px !important;
  font-weight: bold;
  /*  text-shadow: 0 0 8px rgba(57,197,187,1);*/
}

</style>
