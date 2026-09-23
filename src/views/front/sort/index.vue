<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div class="my-animation-slide-bottom sort-container">
      <!-- 标签 -->
      <div class="sort-warp shadow-box" v-if="!$common.isEmpty(category) && !$common.isEmpty(categoryTags)">
        <div v-for="(tag, index) in categoryTags" :key="index"
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
import {adminApi} from '@/api/modules/admin'

const route = useRoute()
const router = useRouter()
// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

const sortInfoStore = useSortInfoStore()

const twoPoem = defineAsyncComponent(() => import("../../../components/business/twoPoem/TwoPoem.vue"))
const proTag = defineAsyncComponent(() => import("../../../components/base/ProTag.vue"))
const articleList = defineAsyncComponent(() => import("../../../components/business/article/ArticleList.vue"))
const myFooter = defineAsyncComponent(() => import("../../../components/business/MyFooter.vue"))



const categoryId = computed(() => router.currentRoute.value.query.sortId)
const tagId = computed(() => router.currentRoute.value.query.labelId)
const category = ref(null)
const categoryTags = ref([])
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  searchKey: "",
  sortId: categoryId.value,
  tagId: tagId.value ? parseInt(tagId.value) : null
})
const articles = ref([])

// 计算属性
const sortInfo = computed(() => sortInfoStore.sortInfo)

const handleCurrentChange = () => {
  getArticles()
}

// 监听路由变化
watch(() => route.query, () => {
  pagination.value = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    searchKey: "",
    sortId: route.query.sortId,
    tagId: route.query.labelId ? parseInt(route.query.labelId) : null
  }
  articles.value = []
  categoryId.value = route.query.sortId
  tagId.value = route.query.labelId
  getCategory()
  getCategories()
  getArticles()
})

// 方法
const pageArticles = () => {
  pagination.value.pageNum += 1
  getArticles()
}

const getCategory = () => {
  if (!$common.isEmpty(sortInfo.value)) {
    let categoryArray = sortInfo.value.filter(f => f.id === parseInt(categoryId.value))
    if (!$common.isEmpty(categoryArray)) {
      category.value = categoryArray[0]
    }
  }
}

// 加载当前分类的标签列表
const getCategories = async () => {
  if (!$common.isEmpty(category.value) && category.value.id) {
    try {
      const res = await adminApi.getTagPage({ categoryId: category.value.id })
      if (res?.data?.list) {
        categoryTags.value = res.data.list.map(item => ({
          ...item,
          countOfTag: item.articleCount || 0
        }))
      } else if (res?.data) {
        categoryTags.value = res.data.map(item => ({
          ...item,
          countOfTag: item.articleCount || 0
        }))
      }
    } catch (error) {
      categoryTags.value = []
    }
  } else {
    categoryTags.value = []
  }
}

const listArticle = (tag) => {
  tagId.value = tag.id
  pagination.value = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    searchKey: "",
    sortId: route.query.sortId ? parseInt(route.query.sortId) : null,
    tagId: tag.id
  }
  articles.value = []
  nextTick(() => {
    getArticles()
  })
}

const getArticles = async () => {
  try {
    const res = await articleApi.getArticleList(pagination.value)
    if (!$common.isEmpty(res)) {
      articles.value = res.list
      pagination.value.total = res.total
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 生命周期
onMounted(async () => {
  await sortInfoStore.loadHomeStats()
  getCategory()
  getCategories()
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
