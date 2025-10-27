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
            <span v-for="(char, index) in webTitle" :key="index">{{ char }}</span>
          </h1>
          <div class="printer" @click="getGuShi">
            <Printer :printerInfo="printerInfo">
              <template #paper="{ content }">
                <h3>
                  {{ content }}<span class="cursor">|</span>
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

            <div class="recent-posts">
              <div class="announcement background-opacity">
                <i class="fa fa-volume-up" aria-hidden="true"></i>
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
                  <div @click="pageArticles" class="pagination" v-if="pagination.total !== articles.length">
                    下一页
                  </div>
                  <div v-else style="user-select: none">
                    ~~到底啦~~
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 页脚 -->
        <div style="background: var(--background)">
          <MyFooter/>
        </div>
      </template>
    </Loader>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, defineAsyncComponent, nextTick} from 'vue'
import {useStore} from '@/stores'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {constant} from '@/utils/constant'
import {common} from '@/utils/common'

// 异步组件
const Loader = defineAsyncComponent(() => import('./common/loader.vue'))
const Zombie = defineAsyncComponent(() => import('./common/zombie.vue'))
const Printer = defineAsyncComponent(() => import('./common/printer.vue'))
const ArticleList = defineAsyncComponent(() => import('./articleList.vue'))
const SortArticle = defineAsyncComponent(() => import('./common/sortArticle.vue'))
const MyFooter = defineAsyncComponent(() => import('./common/myFooter.vue'))
const MyAside = defineAsyncComponent(() => import('./myAside.vue'))

const store = useStore()
const router = useRouter()

const loading = ref(false)
const showAside = ref(true)
const indexType = ref(1)
const printerInfo = ref("你看对面的青山多漂亮")
const pagination = ref({
  current: 1,
  size: 10,
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
  const bgImage = store.state.webInfo.backgroundImage
  return !common.isEmpty(bgImage) ? bgImage : constant.index_image
})

const webTitle = computed(() => store.state.webInfo.webTitle || '')
const notices = computed(() => store.state.webInfo.notices || [])
const sortInfo = computed(() => store.state.sortInfo || [])

// 方法
const selectSort = async (sort) => {
  pagination.value = {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    sortId: sort.id,
    articleSearch: ""
  }
  articles.value = []
  await getArticles()

  await nextTick(() => {
    indexType.value = 2
    document.querySelector('.announcement').style.maxWidth = '780px'
    document.querySelector('.recent-posts').scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    })
  })
}

const selectArticle = async (articleSearch) => {
  pagination.value = {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    sortId: null,
    articleSearch: articleSearch
  }
  articles.value = []
  await getArticles()

  nextTick(() => {
    indexType.value = 2
    document.querySelector('.announcement').style.maxWidth = '780px'
    document.querySelector('.recent-posts').scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    })
  })
}

const pageArticles = () => {
  pagination.value.current += 1
  getArticles()
}

const getArticles = async () => {
  try {
    const response = await $http.post(constant.baseURL + "/article/listArticle", pagination.value)
    if (!common.isEmpty(response.data)) {
      articles.value = articles.value.concat(response.data.records)
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
    const response = await $http.get(constant.baseURL + "/article/listSortArticle")
    if (!common.isEmpty(response.data)) {
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
  const pageId = document.querySelector(selector)
  if (pageId) {
    window.scrollTo({
      top: pageId.offsetTop,
      behavior: "smooth"
    })
  }
}

const getGuShi = () => {
  const xhr = new XMLHttpRequest()
  xhr.open('get', constant.jinrishici)
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
  //height: 100vh;
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
  max-width: 1500px;
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

.announcement i {
  color: var(--themeBackground);
  font-size: 22px;
  margin: auto 0;
  animation: scale 0.8s ease-in-out infinite;
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
