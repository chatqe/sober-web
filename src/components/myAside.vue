<template>
  <div>
    <!-- 网站信息 -->
<!--    <div v-if="!$common.mobile()" class="card-content1 shadow-box background-opacity">-->
    <div  class="card-content1 shadow-box background-opacity">
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
        <i class="el-icon-star-off" style="margin-right: 2px"></i>朋友圈
      </a>
    </div>

    <!-- 搜索 -->
    <div style="padding: 15px;border-radius: 10px;margin-top: 30px;animation: hideToShow 1s ease-in-out"
         class="shadow-box background-opacity wow">
      <div style="color: var(--lightGreen);font-size: 20px;font-weight: bold;margin-bottom: 10px">
        搜索
      </div>

      <div style="display: flex">
        <input class="ais-SearchBox-input" type="text"
               v-model="articleSearch"
               placeholder="搜索文章" maxlength="32"
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
         style="padding: 25px;border-radius: 10px;margin-top: 30px;animation: hideToShow 1s ease-in-out"
         class="shadow-box background-opacity wow">
      <div class="card-content2-title">
<!--        <span>🔥推荐文章</span>-->
        <span>🥝推荐文章</span>
      </div>
      <div v-for="(article, index) in recommendArticles"
           :key="index"
           @click="router.push({path: '/article', query: {id: article.id}})">
        <div class="aside-post-detail">
          <div class="aside-post-image">
            <el-image lazy class="my-el-image" :src="article.articleCover" fit="cover">
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
          <i class="el-icon-date" style="color: var(--greyFont)"></i>{{ article.createTime }}
        </div>
      </div>
    </div>

    <!-- 速览 -->
    <div v-if="!$common.mobile()" class="selectSort">
      <div v-for="(sort, index) in sortInfo"
           @click="selectSort(sort)"
           :key="index"
           :style="{background: $constant.sortColor[index % $constant.sortColor.length]}"
           class="shadow-box-mini background-opacity wow"
           style="position: relative;padding: 10px 25px 15px;border-radius: 10px;animation: hideToShow 1s ease-in-out;margin-top: 30px;cursor: pointer;color: var(--white)">
        <div>速览</div>
        <div class="sort-name">
          {{ sort.sortName }}
        </div>
        <div style="font-weight: bold;margin-top: 8px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
          {{ sort.sortDescription }}
        </div>
      </div>
    </div>


    <!--    最新树洞-->
    <newTreeHole></newTreeHole>



  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import router from '@/router'
import { ElMessage } from 'element-plus'
import {useWebInfoStore, useSystemStore, useUserStore, useSortInfoStore} from '@/stores'
import { articleApi } from '@/api'
import newTreeHole from "./newTreeHole.vue"
import {getArticleList} from "@/api/modules/articleApi.js";

// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

// 路由和状态管理
// ... existing code ...
const webInfoStore = useWebInfoStore()
const systemStore = useSystemStore()
const userStore = useUserStore()
const sortInfoStore = useSortInfoStore()


// 响应式数据
const pagination = ref({
  current: 1,
  size: 5,
  recommendStatus: true
})
const recommendArticles = ref([])
const admires = ref([])
const showAdmireDialog = ref(false)
const articleSearch = ref("")

// 生命周期
onMounted(() => {
  getRecommendArticles()
})

// 计算属性
const webInfo = computed(() => webInfoStore.webInfo)
const sortInfo = computed(() => {
  // 过滤不显示的sort列表
  return sortInfoStore.sortInfo.filter(item => item.status !== 0)
})
const articleTotal = computed(() => sortInfoStore.articleTotal)
const currentUser = computed(() => userStore.currentUser)

// 定义emit
const emit = defineEmits(['selectSort', 'selectArticle'])

// 方法
const selectSort = (sort) => {
  emit("selectSort", sort)
}

const selectArticle = () => {
  emit("selectArticle", articleSearch.value)
}

const showAdmire = () => {
  if ($common.isEmpty(currentUser.value)) {
    ElMessage({
      message: "请先登录！",
      type: "error"
    })
    return
  }

  showAdmireDialog.value = true
}

const getRecommendArticles = async () => {
  try {
    const res = await articleApi.getArticleList(pagination.value)
    if (!$common.isEmpty(res.data)) {
      recommendArticles.value = res.data.records
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取推荐文章失败',
      type: "error"
    })
  }
}

const showTip = () => {
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
  border-radius: 0.2rem;
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
</style>
