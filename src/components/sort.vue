<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div class="my-animation-slide-bottom sort-container">
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



const sortId = computed(() => router.currentRoute.value.query.sortId)
const labelId = computed(() => router.currentRoute.value.query.labelId)
const sort = ref(null)
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  searchKey: "",
  sortId: sortId.value,
  labelId: labelId.value
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
  pagination.value.pageNum += 1
  getArticles()
}

const getSort = () => {
  if (!$common.isEmpty(sortInfo.value)) {
    // let sortArray = sortInfo.value.filter(f => {
    //   return f.id === parseInt(sortId.value)
    // })
    let sortArray = sortInfo.value.filter(f => f.id === sortId.value)
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
      // console.log(res.data)
      // articles.value = articles.value.concat(res.data.list)
      articles.value = res.data.list
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
