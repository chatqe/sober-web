<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div class="my-animation-slide-bottom sort-container">
      <!-- 标签 -->
      <div class="sort-warp shadow-box" v-if="!$common.isEmpty(sort) && !$common.isEmpty(sort.tags)">
        <div v-for="(tag, index) in sort.tags" :key="index"
             :class="{isActive: !$common.isEmpty(tagId) && parseInt(tagId) === tag.id}"
             @click="listArticle(tag)">
          <proTag :info="tag.name+' '+tag.countOfTag"
                  :color="$constant.before_color_list[Math.floor(Math.random() * 6)]"
                  style="margin: 12px">
          </proTag>
        </div>
      </div>

      <!-- 文章 -->
      <div class="article-wrap">
        <articleList :articleList="articles"></articleList>
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
      <!-- 页脚 -->
      <!--<myFooter></myFooter>-->
    </div>
  </div>
</template>

<script setup>
import {computed, defineAsyncComponent, inject, nextTick, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useSortInfoStore} from '@/stores'
import {articleApi} from '@/api/index.js'

const route = useRoute()
const router = useRouter()
// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

const sortInfoStore = useSortInfoStore()

const twoPoem = defineAsyncComponent(() => import("./common/twoPoem.vue"))
const proTag = defineAsyncComponent(() => import("./common/proTag.vue"))
const articleList = defineAsyncComponent(() => import("./articleList.vue"))
const myFooter = defineAsyncComponent(() => import("./common/myFooter.vue"))

// 当前分类ID / 标签ID（来自路由 query，统一为字符串，比较时做 Number 转换）
const categoryId = computed(() => route.query.categoryId)
const tagId = computed(() => route.query.tagId)
const sort = ref(null)

// 分页参数（字段名与后端 ArticlePageDTO 对齐：pageNum/pageSize/categoryId/tagId）
const buildPagination = () => ({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  searchKey: "",
  categoryId: route.query.categoryId,
  tagId: route.query.tagId ? Number(route.query.tagId) : undefined
})
const pagination = ref(buildPagination())
const articles = ref([])

// 计算属性
const sortInfo = computed(() => sortInfoStore.sortInfo)

const handleCurrentChange = () => {
  getArticles()
}

// 监听路由变化（切换分类/标签时重建分页并重新加载）
watch(() => route.query, () => {
  pagination.value = buildPagination()
  articles.value = []
  getSort()
  getArticles()
})

// 方法
const pageArticles = () => {
  pagination.value.pageNum += 1
  getArticles()
}

const getSort = () => {
  sort.value = null
  if (!$common.isEmpty(sortInfo.value)) {
    // 路由 query 的 categoryId 为字符串，store 中 id 为数字，用宽松比较
    let sortArray = sortInfo.value.filter(f => String(f.id) === String(categoryId.value))
    if (!$common.isEmpty(sortArray)) {
      sort.value = sortArray[0]
    }
  }
}

// 点击标签：通过路由跳转驱动 watch 统一刷新（保证 URL 与页面状态一致）
const listArticle = (tag) => {
  router.push({
    path: '/sort',
    query: { categoryId: route.query.categoryId, tagId: tag.id }
  })
}

const getArticles = async () => {
  try {
    // modules 层已剥离 R<T> 信封，res 即分页对象 { list, total, ... }
    const res = await articleApi.getArticleList(pagination.value)
    if (res && !$common.isEmpty(res.list)) {
      articles.value = res.list
      pagination.value.total = res.total
    } else {
      articles.value = []
      pagination.value.total = 0
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取文章列表失败',
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
.sort-container {
  /*background: var(--background);*/
  padding-top: 40px;
  display: flex; /* 解决margin折叠问题*/
  flex-direction: column;
}

.sort-warp {
  background: var(--cntr-bg);
  width: 70%;
  max-width: 780px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;

}

.article-wrap {
  background: var(--cntr-bg);
  width: 75%;
  margin: 40px auto;
  min-height: 600px;
  border-radius: 15px;
  box-shadow: var(--card-box-shadow);
  padding: 60px;
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
