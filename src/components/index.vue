<template>
  <div>
    <Loader :loading="loading">
      <!-- 加载页面 -->
      <template #loader>
        <div>
          <Zombie/>
        </div>
      </template>

      <!-- 内容页面 -->
      <template #body>
        <!-- 首页图片 -->
        <el-image
            style="animation: header-effect 2s"
            class="background-image-index"
            v-once
            lazy
            :src="backgroundImage"
            fit="cover"
        >
          <template #error>
            <div class="image-slot background-image-index-error"></div>
          </template>
        </el-image>

        <!-- 首页文字 -->
        <div class="signature-wall myCenter my-animation-hideToShow">
          <h1 class="playful">
            <span v-for="(char, index) in webTitle" :key="index"> {{ char }} </span>
          </h1>
          <div class="printer" @click="getGuShi()">
            <Printer :printerInfo="printerInfo">
              <template #paper="{ content }">
                <h3>
                  {{ content }} <span class="cursor">|</span>
                </h3>
              </template>
            </Printer>
          </div>
          <div id="bannerWave1"></div>
          <div id="bannerWave2"></div>
          <i class="el-icon-arrow-down" @click="navigation('.page-container-wrap')"></i>
        </div>

        <!-- 首页内容 -->
        <div class="page-container-wrap">
          <div class="page-container">
            <div class="aside-content" v-if="showAside">
              <MyAside @select-sort="selectSort" @select-article="selectArticle"/>
            </div>

            <div class="recent-posts" ref="recentPostsRef">
              <div class="announcement background-opacity" :style="{ maxWidth: announcementMaxWidth }">
                <!--                <i class="fa fa-volume-up" aria-hidden="true">🔊</i>-->
                <i class="page-container-volume" aria-hidden="true">
                  <svg t="1762079749878" class="icon" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="3900" width="32" height="32">
                    <path
                        d="M640 961.92c-19.2 0-38.4-5.12-55.68-14.72l-322.56-184.32c-12.16-7.04-25.6-10.88-39.68-10.88H192C94.72 752 16 673.28 16 576V448C16 350.72 94.72 272 192 272h30.08c14.08 0 27.52-3.84 39.68-10.24l322.56-184.32c35.2-19.84 76.8-19.84 112 0 35.2 20.48 55.68 56.32 55.68 96.64v675.2c0 40.32-21.12 76.8-55.68 96.64-17.28 10.24-37.12 15.36-56.32 15.36zM864 304a47.744 47.744 0 0 1-26.24-87.68l96-64c22.4-14.72 51.84-8.96 66.56 13.44s8.96 51.84-13.44 66.56l-96 64c-8.32 5.12-17.28 8.32-26.88 8.32zM960 880a47.36 47.36 0 0 1-26.88-8.32l-96-64a48.32 48.32 0 0 1-13.44-66.56c14.72-21.76 44.8-28.16 66.56-13.44l96 64c21.76 14.72 28.16 44.8 13.44 66.56-8.96 14.08-24.32 21.12-39.68 21.12zM960 560h-96c-26.24 0-48-21.76-48-48s21.76-48 48-48H960c26.24 0 48 21.76 48 48s-21.76 48-48 48z"
                        p-id="3901" data-spm-anchor-id="a313x.search_index.0.i10.62673a815gb7Zm"
                        class="selected"></path>
                  </svg>
                </i>
                <div>
                  <div v-for="(notice, index) in notices" :key="index">
                    {{ notice }}
                  </div>
                </div>
              </div>

              <div v-show="indexType === 1">
                <div v-for="sort in sortInfo" :key="sort.id">
                  <div v-if="sortArticles[sort.id]?.length">
                    <div class="sort-article-first">
                      <div>
                        <svg viewBox="0 0 1024 1024" width="20" height="20"
                             style="vertical-align: -2px;margin-bottom: -2px">
                          <path
                              d="M367.36 482.304H195.9936c-63.3344 0-114.6368-51.3536-114.6368-114.6368V196.2496c0-63.3344 51.3536-114.6368 114.6368-114.6368h171.4176c63.3344 0 114.6368 51.3536 114.6368 114.6368V367.616c0 63.3344-51.3536 114.688-114.688 114.688zM367.36 938.752H195.9936c-63.3344 0-114.6368-51.3536-114.6368-114.6368v-171.4176c0-63.3344 51.3536-114.6368 114.6368-114.6368h171.4176c63.3344 0 114.6368 51.3536 114.6368 114.6368v171.4176c0 63.3344-51.3536 114.6368-114.688 114.6368zM828.672 938.752h-171.4176c-63.3344 0-114.6368-51.3536-114.6368-114.6368v-171.4176c0-63.3344 51.3536-114.6368 114.6368-114.6368h171.4176c63.3344 0 114.6368 51.3536 114.6368 114.6368v171.4176c0 63.3344-51.3024 114.6368-114.6368 114.6368zM828.672 482.304h-171.4176c-63.3344 0-114.6368-51.3536-114.6368-114.6368V196.2496c0-63.3344 51.3536-114.6368 114.6368-114.6368h171.4176c63.3344 0 114.6368 51.3536 114.6368 114.6368V367.616c0 63.3344-51.3024 114.688-114.6368 114.688z"
                              fill="#FF623E"></path>
                        </svg>
                        {{ sort.sortName }}
                      </div>

                      <div class="article-more" @click="router.push({path: '/sort', query: {sortId: sort.id}})">
                        <svg viewBox="0 0 1024 1024" width="20" height="20"
                             style="vertical-align: -2px;margin-bottom: -2px">
                          <path
                              d="M347.3 897.3H142.2c-30.8 0-51.4-31.7-38.9-59.9l136.1-306.1c4.9-11 4.9-23.6 0-34.6L103.3 190.6c-12.5-28.2 8.1-59.9 38.9-59.9h205.1c16.8 0 32.1 9.9 38.9 25.3l151.4 340.7c4.9 11 4.9 23.6 0 34.6L386.3 872.1c-6.9 15.3-22.1 25.2-39 25.2z"
                              fill="#009F72"></path>
                          <path
                              d="M730.4 897.3H525.3c-30.8 0-51.4-31.7-38.9-59.9l136.1-306.1c4.9-11 4.9-23.6 0-34.6L486.4 190.6c-12.5-28.2 8.1-59.9 38.9-59.9h205.1c16.8 0 32.1 9.9 38.9 25.3l151.4 340.7c4.9 11 4.9 23.6 0 34.6L769.3 872.1c-6.8 15.3-22.1 25.2-38.9 25.2z"
                              fill="#F9DB88"></path>
                        </svg>
                        MORE
                      </div>
                    </div>
                    <SortArticle :articleList="sortArticles[sort.id]"/>
                  </div>
                </div>
              </div>

              <div v-show="indexType === 2">
                <ArticleList :articleList="articles"/>
                <div class="pagination-wrap">
                  <!--<div @click="pageArticles()" class="pagination" v-if="pagination.total !== articles.length">-->
                  <!--  下一页-->
                  <!--</div>-->
                  <el-pagination
                      v-if="pagination.total>10"
                      v-model:current-page="pagination.pageNum"
                      v-model:page-size="pagination.pageSize"
                      background
                      layout=" prev, pager, next"
                      :total="pagination.total"
                      @current-change="handleCurrentChange"
                  />
                  <div v-else style="user-select: none">
                    ~~到底啦~~
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 页脚 -->
        <!--<div style="background: var(&#45;&#45;background)">-->
        <!--  <MyFooter/>-->
        <!--</div>-->
        <MyFooter/>
      </template>
    </Loader>
  </div>
</template>

<script setup>
import {computed, defineAsyncComponent, inject, nextTick, onMounted, ref} from 'vue'
import {useSortInfoStore, useSystemStore, useUserStore, useWebInfoStore} from '@/stores'
import router from '@/router'
import {ElMessage} from 'element-plus'
import {articleApi} from '@/api'

// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

// DOM 引用
const announcementRef = ref(null)
const recentPostsRef = ref(null)

// 异步组件
const Loader = defineAsyncComponent(() => import('./common/loader.vue'))
const Zombie = defineAsyncComponent(() => import('./common/zombie.vue'))
const Printer = defineAsyncComponent(() => import('./common/printer.vue'))
const ArticleList = defineAsyncComponent(() => import('./articleList.vue'))
const SortArticle = defineAsyncComponent(() => import('./common/sortArticle.vue'))
const MyFooter = defineAsyncComponent(() => import('./common/myFooter.vue'))
const MyAside = defineAsyncComponent(() => import('./myAside.vue'))

const userStore = useUserStore()
const webInfoStore = useWebInfoStore()
const sortInfoStore = useSortInfoStore()
const systemStore = useSystemStore()

const loading = ref(false)
const showAside = ref(true)
const indexType = ref(1)
const announcementMaxWidth = ref('auto')
const printerInfo = ref("你看对面的青山多漂亮")
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  searchKey: "",
  sortId: null,
  articleSearch: ""
})
const guShi = ref({
  content: "",
  origin: "",
  author: "",
  category: ""
})
const articles = ref([])
const sortArticles = ref({})

// 计算属性
const backgroundImage = computed(() => {
  const bgImage = webInfoStore.webInfo?.backgroundImage
  return !$common.isEmpty(bgImage) ? bgImage : $constant.index_image
})

const webTitle = computed(() => webInfoStore.webInfo?.webTitle || '')
const notices = computed(() => webInfoStore.webInfo?.notices || [])
const sortInfo = computed(() => sortInfoStore.sortInfo || [])

// 方法
const selectSort = async (sort) => {
  pagination.value = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    searchKey: "",
    sortId: sort.id,
    articleSearch: ""
  }
  articles.value = []
  await getArticles()

  await nextTick(() => {
    indexType.value = 2
    announcementMaxWidth.value = '780px'
    if (recentPostsRef.value) {
      recentPostsRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      })
    }
  })
}

const selectArticle = async (articleSearch) => {
  pagination.value = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    searchKey: "",
    sortId: null,
    articleSearch: articleSearch
  }
  articles.value = []
  await getArticles()

  await nextTick(() => {
    indexType.value = 2
    announcementMaxWidth.value = '780px'
    if (recentPostsRef.value) {
      recentPostsRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      })
    }
  })
}

const pageArticles = () => {
  pagination.value.pageNum += 1
  getArticles()
}

const handleCurrentChange = () => {
  getArticles()
}
const getArticles = async () => {
  try {
    const response = await articleApi.getArticleList(pagination.value)
    if (!$common.isEmpty(response.data)) {
      // articles.value = articles.value.concat(response.data.list)
      articles.value = response.data.list
      pagination.value.total = response.data.total
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

const getSortArticles = async () => {
  try {
    const response = await articleApi.listSortArticle()
    if (!$common.isEmpty(response.data)) {
      sortArticles.value = response.data
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

const navigation = (selector) => {
  const element = document.querySelector(selector)
  if (element) {
    window.scrollTo({
      top: element.offsetTop,
      behavior: "smooth"
    })
  }
}

const getGuShi = () => {
  const xhr = new XMLHttpRequest()
  xhr.open('get', $constant.jinrishici)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      guShi.value = JSON.parse(xhr.responseText)
      printerInfo.value = guShi.value.content
    }
  }
  xhr.send()
}

// 生命周期
onMounted(() => {
  getGuShi()
  getSortArticles()
})
</script>

<style scoped>


.background-image-index {
  width: 100vw;
  height: 45vh;
  position: fixed;
  z-index: -1;
}

.background-image-index::before {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .2);
  content: '';
}

.background-image-index-error {
  background-color: var(--lightGreen);
  width: 100vw;
  height: 50vh;
  position: fixed;
  z-index: -1;
}

.signature-wall {
  /* 向下排列 */
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  /* height: 100vh; */
  height: 45vh;
  overflow: hidden;
}

.playful {
  color: var(--white);
  font-size: 40px;
}

.sort-article-first {
  margin: 40px auto 20px;
  display: flex;
  justify-content: space-between;
  color: var(--greyFont);
  border-bottom: 1px dashed var(--lightGray);
  padding-bottom: 5px;
}

.article-more {
  cursor: pointer;
  transition: all 0.3s;
}

.article-more:hover {
  color: var(--lightGreen);
  font-weight: 700;
  transform: scale(1.1);
}

/*.playful span {*/
/*  position: relative;*/
/*  color: #5362f6;*/
/*  text-shadow: 0.25px 0.25px #e485f8, 0.5px 0.5px #e485f8, 0.75px 0.75px #e485f8,*/
/*  1px 1px #e485f8, 1.25px 1.25px #e485f8, 1.5px 1.5px #e485f8, 1.75px 1.75px #e485f8,*/
/*  2px 2px #e485f8, 2.25px 2.25px #e485f8, 2.5px 2.5px #e485f8, 2.75px 2.75px #e485f8,*/
/*  3px 3px #e485f8, 3.25px 3.25px #e485f8, 3.5px 3.5px #e485f8, 3.75px 3.75px #e485f8,*/
/*  4px 4px #e485f8, 4.25px 4.25px #e485f8, 4.5px 4.5px #e485f8, 4.75px 4.75px #e485f8,*/
/*  5px 5px #e485f8, 5.25px 5.25px #e485f8, 5.5px 5.5px #e485f8, 5.75px 5.75px #e485f8,*/
/*  6px 6px #e485f8;*/
/*  animation: scatter 1.75s infinite;*/
/*  font-weight: normal;*/
/*}*/

/*.playful span:nth-child(2n) {*/
/*  color: #ed625c;*/
/*  text-shadow: 0.25px 0.25px #f2a063, 0.5px 0.5px #f2a063, 0.75px 0.75px #f2a063,*/
/*  1px 1px #f2a063, 1.25px 1.25px #f2a063, 1.5px 1.5px #f2a063, 1.75px 1.75px #f2a063,*/
/*  2px 2px #f2a063, 2.25px 2.25px #f2a063, 2.5px 2.5px #f2a063, 2.75px 2.75px #f2a063,*/
/*  3px 3px #f2a063, 3.25px 3.25px #f2a063, 3.5px 3.5px #f2a063, 3.75px 3.75px #f2a063,*/
/*  4px 4px #f2a063, 4.25px 4.25px #f2a063, 4.5px 4.5px #f2a063, 4.75px 4.75px #f2a063,*/
/*  5px 5px #f2a063, 5.25px 5.25px #f2a063, 5.5px 5.5px #f2a063, 5.75px 5.75px #f2a063,*/
/*  6px 6px #f2a063;*/
/*  animation-delay: 0.3s;*/
/*}*/

/*.playful span:nth-child(3n) {*/
/*  color: #ffd913;*/
/*  text-shadow: 0.25px 0.25px #6ec0a9, 0.5px 0.5px #6ec0a9, 0.75px 0.75px #6ec0a9,*/
/*  1px 1px #6ec0a9, 1.25px 1.25px #6ec0a9, 1.5px 1.5px #6ec0a9, 1.75px 1.75px #6ec0a9,*/
/*  2px 2px #6ec0a9, 2.25px 2.25px #6ec0a9, 2.5px 2.5px #6ec0a9, 2.75px 2.75px #6ec0a9,*/
/*  3px 3px #6ec0a9, 3.25px 3.25px #6ec0a9, 3.5px 3.5px #6ec0a9, 3.75px 3.75px #6ec0a9,*/
/*  4px 4px #6ec0a9, 4.25px 4.25px #6ec0a9, 4.5px 4.5px #6ec0a9, 4.75px 4.75px #6ec0a9,*/
/*  5px 5px #6ec0a9, 5.25px 5.25px #6ec0a9, 5.5px 5.5px #6ec0a9, 5.75px 5.75px #6ec0a9,*/
/*  6px 6px #6ec0a9;*/
/*  animation-delay: 0.15s;*/
/*}*/

/*.playful span:nth-child(5n) {*/
/*  color: #555bff;*/
/*  text-shadow: 0.25px 0.25px #e485f8, 0.5px 0.5px #e485f8, 0.75px 0.75px #e485f8,*/
/*  1px 1px #e485f8, 1.25px 1.25px #e485f8, 1.5px 1.5px #e485f8, 1.75px 1.75px #e485f8,*/
/*  2px 2px #e485f8, 2.25px 2.25px #e485f8, 2.5px 2.5px #e485f8, 2.75px 2.75px #e485f8,*/
/*  3px 3px #e485f8, 3.25px 3.25px #e485f8, 3.5px 3.5px #e485f8, 3.75px 3.75px #e485f8,*/
/*  4px 4px #e485f8, 4.25px 4.25px #e485f8, 4.5px 4.5px #e485f8, 4.75px 4.75px #e485f8,*/
/*  5px 5px #e485f8, 5.25px 5.25px #e485f8, 5.5px 5.5px #e485f8, 5.75px 5.75px #e485f8,*/
/*  6px 6px #e485f8;*/
/*  animation-delay: 0.4s;*/
/*}*/

/*.playful span:nth-child(7n) {*/
/*  color: #ff9c55;*/
/*  text-shadow: 0.25px 0.25px #ff5555, 0.5px 0.5px #ff5555, 0.75px 0.75px #ff5555,*/
/*  1px 1px #ff5555, 1.25px 1.25px #ff5555, 1.5px 1.5px #ff5555, 1.75px 1.75px #ff5555,*/
/*  2px 2px #ff5555, 2.25px 2.25px #ff5555, 2.5px 2.5px #ff5555, 2.75px 2.75px #ff5555,*/
/*  3px 3px #ff5555, 3.25px 3.25px #ff5555, 3.5px 3.5px #ff5555, 3.75px 3.75px #ff5555,*/
/*  4px 4px #ff5555, 4.25px 4.25px #ff5555, 4.5px 4.5px #ff5555, 4.75px 4.75px #ff5555,*/
/*  5px 5px #ff5555, 5.25px 5.25px #ff5555, 5.5px 5.5px #ff5555, 5.75px 5.75px #ff5555,*/
/*  6px 6px #ff5555;*/
/*  animation-delay: 0.25s;*/
/*}*/

.printer {
  cursor: pointer;
  color: var(--white);
  background: var(--translucent);
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

#bannerWave1 {
  height: 84px;
  background: var(--bannerWave1);
  position: absolute;
  width: 200%;
  bottom: 0;
  z-index: 10;
  animation: gradientBG 120s linear infinite;
}

#bannerWave2 {
  height: 100px;
  background: var(--bannerWave2);
  position: absolute;
  width: 400%;
  bottom: 0;
  z-index: 5;
  animation: gradientBG 120s linear infinite;
}

/* 光标 */
.cursor {
  margin-left: 1px;
  animation: hideToShow 0.7s infinite;
  font-weight: 200;
}

.el-icon-arrow-down {
  font-size: 40px;
  font-weight: bold;
  color: var(--white);
  position: absolute;
  bottom: 60px;
  animation: my-shake 1.5s ease-out infinite;
  z-index: 15;
  cursor: pointer;
}

.page-container-wrap {
  background: var(--background);
  position: relative;
}

.page-container {
  display: flex;

  justify-content: center;
  width: 90%;
  /* 限制最大宽度 页面会往中间靠*/
  /*max-width: 1500px;*/
  max-width: 1400px;
  padding: 0 10px 40px 10px;
  margin: 0 auto;
  flex-direction: row;
}

.recent-posts {
  width: 70%;
}

.announcement {
  padding: 22px;
  border: 1px dashed var(--lightGray);
  color: var(--greyFont);
  border-radius: 10px;
  display: flex;
  margin: 40px auto 40px;
}

/*.announcement i {
  color: var(--themeBackground);
  font-pageSize: 22px;
  margin: auto 0;
  animation: scale 0.8s ease-in-out infinite;
}*/

.page-container-volume {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.page-container-volume svg {
  color: var(--themeBackground);
  width: 22px;
  height: 22px;
  animation: scale 0.8s ease-in-out infinite;
}

.page-container-volume svg path {
  fill: currentColor;
}

.announcement div div {
  margin-left: 20px;
  line-height: 30px;
}

.aside-content {
  width: calc(30% - 40px);
  user-select: none;
  margin-top: 40px;
  margin-right: 40px;
  max-width: 300px;
  float: right;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.pagination {
  padding: 13px 15px;
  border: 1px solid var(--lightGray);
  border-radius: 3rem;
  color: var(--greyFont);
  width: 100px;
  user-select: none;
  cursor: pointer;
  text-align: center;
}

.pagination:hover {
  border: 1px solid var(--themeBackground);
  color: var(--themeBackground);
  box-shadow: 0 0 5px var(--themeBackground);
}

@media screen and (max-width: 1100px) {
  .recent-posts {
    width: 100%;
  }

  .page-container {
    width: 100%;
  }
}

@media screen and (max-width: 1000px) {

  .page-container {
    /* 文章栏与侧标栏垂直排列 */
    flex-direction: column;
  }

  .aside-content {
    width: 100%;
    max-width: unset;
    float: unset;
    margin: 40px auto 0;
  }
}

@media screen and (max-width: 768px) {

  h1 {
    font-size: 35px;
  }
}

/**.article-sort-btn{
  display: flex;
}*/
</style>
