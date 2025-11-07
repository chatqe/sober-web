<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div style="background: var(--background);padding-top: 40px;" class="my-animation-slide-bottom">
      <!-- 标签 -->
      <div class="sort-warp shadow-box" v-if="!$common.isEmpty(sort) && !$common.isEmpty(sort.labels)">
        <div v-for="(label, index) in sort.labels" :key="index"
             :class="{isActive: !$common.isEmpty(labelId) && parseInt(labelId) === label.id}"
             @click="listArticle(label)">
          <proTag :info="label.labelName+' '+label.countOfLabel"
                  :color="$constant.before_color_list[Math.floor(Math.random() * 6)]"
                  style="margin: 12px">
          </proTag>
        </div>
      </div>

      <!-- 文章 -->
      <div class="article-wrap">
        <articleList :articleList="articles"></articleList>
        <div class="pagination-wrap">
          <div @click="pageArticles()" class="pagination" v-if="pagination.total !== articles.length">
            下一页
          </div>
          <div v-else style="user-select: none">
            ~~到底啦~~
          </div>
        </div>
      </div>
      <!-- 页脚 -->
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { defineAsyncComponent } from 'vue'
import {useSortInfoStore, useSystemStore} from '@/stores'
import { articleApi } from '@/api'
import {getArticleList} from "@/api/modules/articleApi.js";

// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

const route = useRoute()
// const sortInfoStore = useSystemStore()
const sortInfoStore = useSortInfoStore()

const twoPoem = defineAsyncComponent(() => import("./common/twoPoem.vue"))
const proTag = defineAsyncComponent(() => import("./common/proTag.vue"))
const articleList = defineAsyncComponent(() => import("./articleList.vue"))
const myFooter = defineAsyncComponent(() => import("./common/myFooter.vue"))

// 响应式数据
const sortId = ref(route.query.sortId)
const labelId = ref(route.query.labelId)
const sort = ref(null)
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  searchKey: "",
  sortId: route.query.sortId,
  labelId: route.query.labelId
})
const articles = ref([])

// 计算属性
const sortInfo = computed(() => sortInfoStore.sortInfo)

// 监听路由变化
watch(() => route.query, () => {
  pagination.value = {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    sortId: route.query.sortId,
    labelId: route.query.labelId
  }
  articles.value = []
  sortId.value = route.query.sortId
  labelId.value = route.query.labelId
  getSort()
  getArticles()
})

// 方法
const pageArticles = () => {
  pagination.value.current += 1
  getArticles()
}

const getSort = () => {
  if (!$common.isEmpty(sortInfo.value)) {
    let sortArray = sortInfo.value.filter(f => {
      return f.id === parseInt(sortId.value)
    })
    if (!$common.isEmpty(sortArray)) {
      sort.value = sortArray[0]
    }
  }
}

const listArticle = (label) => {
  labelId.value = label.id
  pagination.value = {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    sortId: route.query.sortId,
    labelId: label.id
  }
  articles.value = []
  nextTick(() => {
    getArticles()
  })
}

const getArticles = async () => {
  try {
    const res = await articleApi.getArticleList(pagination.value)
    if (!$common.isEmpty(res.data)) {
      articles.value = articles.value.concat(res.data.records)
      pagination.value.total = res.data.total
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 生命周期
onMounted(() => {
  getSort()
  getArticles()
})
</script>

<style scoped>

  .sort-warp {
    width: 70%;
    max-width: 780px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .article-wrap {
    width: 70%;
    margin: 40px auto;
    min-height: 600px;
  }

  .isActive {
    animation: scale 1.5s ease-in-out infinite;
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


  @media screen and (max-width: 900px) {
    .sort-warp {
      width: 90%;
    }

    .article-wrap {
      width: 90%;
    }
  }
</style>
