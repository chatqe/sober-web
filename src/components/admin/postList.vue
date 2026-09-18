<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Document /></el-icon>
        <span>文章管理</span>
      </div>
      <div class="toolbar">
        <el-select v-model="pagination.recommendStatus" placeholder="是否推荐" class="filter-select">
          <el-option key="1" label="是" :value="true"></el-option>
          <el-option key="2" label="否" :value="false"></el-option>
        </el-select>
        <el-select v-model="pagination.sortId" placeholder="分类" class="filter-select">
          <el-option v-for="item in sorts" :key="item.id" :label="item.sortName" :value="item.id" />
        </el-select>
        <el-select v-model="pagination.labelId" placeholder="标签" class="filter-select">
          <el-option v-for="item in labelsTemp" :key="item.id" :label="item.labelName" :value="item.id" />
        </el-select>
        <el-input v-model="pagination.searchKey" placeholder="文章标题" class="filter-input" clearable />
        <el-button type="primary" @click="searchArticles()">搜索</el-button>
        <el-button @click="clearSearch()">清除</el-button>
        <el-button type="primary" @click="$router.push({ path: '/admin/postEdit' })">新增文章</el-button>
      </div>
      <el-table :data="articles" border class="table" stripe header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="username" label="作者" width="100" align="center" />
        <el-table-column prop="articleTitle" label="文章标题" align="center" show-overflow-tooltip />
        <el-table-column prop="sort.sortName" label="分类" align="center" width="100" />
        <el-table-column prop="label.labelName" label="标签" align="center" width="100" />
        <el-table-column prop="viewCount" label="浏览" width="70" align="center" />
        <el-table-column prop="likeCount" label="点赞" width="70" align="center" />
        <el-table-column prop="commentCount" label="评论" width="70" align="center" />
        <el-table-column label="封面" align="center" width="70">
          <template #default="scope">
            <el-image lazy class="table-td-thumb" :src="scope.row.articleCover" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="可见" align="center" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.viewStatus === false ? 'danger' : 'success'" disable-transitions size="small">
              {{ scope.row.viewStatus === false ? '隐藏' : '显示' }}
            </el-tag>
            <el-switch @click="changeStatus(scope.row, 1)" v-model="scope.row.viewStatus" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="评论" align="center" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.commentStatus === false ? 'danger' : 'success'" disable-transitions size="small">
              {{ scope.row.commentStatus === false ? '关闭' : '开启' }}
            </el-tag>
            <el-switch @click="changeStatus(scope.row, 2)" v-model="scope.row.commentStatus" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="推荐" align="center" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.recommendStatus === false ? 'danger' : 'success'" disable-transitions size="small">
              {{ scope.row.recommendStatus === false ? '否' : '是' }}
            </el-tag>
            <el-switch @click="changeStatus(scope.row, 3)" v-model="scope.row.recommendStatus" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="155" />
        <el-table-column prop="updateTime" label="修改时间" align="center" width="155" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" v-model:current-page="pagination.current"
          :page-size="pagination.size" :total="pagination.total" @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import { articleApi } from '@/api/index.js'
import { Document } from '@element-plus/icons-vue'
import { useUserStore, useAuthStore } from '@/stores'

// 定义接口
interface Sort {
  id: number;
  sortName: string;
}

interface Label {
  id: number;
  labelName: string;
  sortId: number;
}

interface Article {
  id: number;
  username: string;
  articleTitle: string;
  articleCover: string;
  sort: Sort;
  label: Label;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  viewStatus: boolean;
  commentStatus: boolean;
  recommendStatus: boolean;
  createTime: string;
  updateTime: string;
  [key: string]: any;
}

interface Pagination {
  current: number;
  size: number;
  total: number;
  searchKey: string;
  recommendStatus: boolean | null;
  sortId: number | null;
  labelId: number | null;
}

interface ApiResponse<T> {
  data: T;
  [key: string]: any;
}

interface ArticleListResponse {
  list: Article[];
  total: number;
}

interface ChangeStatusParam {
  articleId: number;
  viewStatus?: boolean;
  commentStatus?: boolean;
  recommendStatus?: boolean;
}

// 使用store和router
const authStore = useAuthStore()
const userStore = useUserStore()

// 响应式数据
const isAdmin = computed(() => authStore.isAdmin || userStore.currentAdmin?.isAdmin || false)
const pagination = reactive<Pagination>({
  current: 1,
  size: 10,
  total: 0,
  searchKey: "",
  recommendStatus: null,
  sortId: null,
  labelId: null
})
const articles = ref<Article[]>([])
const sorts = ref<Sort[]>([])
const labels = ref<Label[]>([])
const labelsTemp = ref<Label[]>([])

// 监听分类变化，更新标签列表
watch(() => pagination.sortId, (newVal) => {
  pagination.labelId = null
  if (newVal && labels.value && labels.value.length > 0) {
    labelsTemp.value = labels.value.filter(l => l.sortId === newVal)
  }
})

// 获取分类和标签
const getSortAndLabel = async (): Promise<void> => {
  try {
    const res = await articleApi.getSortAndLabel()
    if (res && Object.keys(res).length > 0) {
      sorts.value = res.sorts
      labels.value = res.labels
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取分类和标签失败',
      type: "error"
    })
  }
}

// 清除搜索参数
const clearSearch = (): void => {
  Object.assign(pagination, {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    recommendStatus: null,
    sortId: null,
    labelId: null
  })
  getArticles()
}

// 获取文章列表
const getArticles = async (): Promise<void> => {
  try {
    const res: any = await articleApi.getArticleList({
      pageNum: pagination.current,
      pageSize: pagination.size,
      searchKey: pagination.searchKey,
      recommendStatus: pagination.recommendStatus || undefined,
      sortId: pagination.sortId ? String(pagination.sortId) : undefined,
      labelId: pagination.labelId || undefined,
      isAdmin: isAdmin.value
    })
    if (res && Object.keys(res).length > 0) {
      articles.value = res.list
      pagination.total = res.total
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取文章列表失败',
      type: "error"
    })
  }
}

// 分页变化处理
const handlePageChange = (val: number): void => {
  pagination.current = val
  getArticles()
}

// 搜索文章
const searchArticles = (): void => {
  pagination.total = 0
  pagination.current = 1
  getArticles()
}

// 修改文章状态
const changeStatus = async (article: Article, flag: number): Promise<void> => {
  let param
  if (flag === 1) {
    param = {
      articleId: article.id,
      viewStatus: article.viewStatus
    }
  } else if (flag === 2) {
    param = {
      articleId: article.id,
      commentStatus: article.commentStatus
    }
  } else if (flag === 3) {
    param = {
      articleId: article.id,
      recommendStatus: article.recommendStatus
    }
  }
  try {
    await articleApi.changeArticleStatus(param)
    if (flag === 1) {
      ElMessage({
        duration: 0,
        showClose: true,
        message: "修改成功！注意，文章不可见时必须设置密码才能访问！",
        type: "warning"
      })
    } else {
      ElMessage({
        message: "修改成功！",
        type: "success"
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '修改失败',
      type: "error"
    })
  }
}

// 删除文章
const handleDelete = async (item: Article): Promise<void> => {
  try {
    await ElMessageBox.confirm('确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })
    await articleApi.deleteArticle({ id: item.id })
    pagination.current = 1
    await getArticles()
    ElMessage({
      message: "删除成功！",
      type: "success"
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        message: error.message || '删除失败',
        type: "error"
      })
    } else {
      ElMessage({
        type: 'warning',
        message: '已取消删除!'
      })
    }
  }
}

// 编辑文章
const handleEdit = (item: Article): void => {
  router.push({ path: '/admin/postEdit', query: { id: item.id } })
}

// 组件挂载时获取数据
onMounted((): void => {
  getArticles()
  getSortAndLabel()
})
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.page-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1d2e;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filter-select { width: 120px; }
.filter-input { width: 160px; }
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
  border-radius: 6px;
}
</style>
