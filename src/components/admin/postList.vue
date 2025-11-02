<template>
  <div>
    <div class="handle-box">
      <el-select v-model="pagination.recommendStatus" placeholder="是否推荐" style="width: 120px" class="mrb10">
        <el-option key="1" label="是" :value="true"></el-option>
        <el-option key="2" label="否" :value="false"></el-option>
      </el-select>
      <el-select style="width: 140px" class="mrb10" v-model="pagination.sortId" placeholder="请选择分类">
        <el-option v-for="item in sorts" :key="item.id" :label="item.sortName" :value="item.id">
        </el-option>
      </el-select>
      <el-select style="width: 140px" class="mrb10" v-model="pagination.labelId" placeholder="请选择标签">
        <el-option v-for="item in labelsTemp" :key="item.id" :label="item.labelName" :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="pagination.searchKey" placeholder="文章标题" class="handle-input mrb10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchArticles()">搜索</el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
      <el-button type="primary" @click="$router.push({ path: '/postEdit' })">新增文章</el-button>
    </div>
    <el-table :data="articles" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="username" label="作者" width="100" align="center"></el-table-column>
      <el-table-column prop="articleTitle" label="文章标题" align="center"></el-table-column>
      <el-table-column prop="sort.sortName" label="分类" align="center"></el-table-column>
      <el-table-column prop="label.labelName" label="标签" align="center"></el-table-column>
      <el-table-column prop="viewCount" label="浏览量" width="80" align="center"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数" width="80" align="center"></el-table-column>
      <el-table-column prop="commentCount" label="评论数" width="80" align="center"></el-table-column>

      <el-table-column label="封面" align="center">
        <template #default="scope">
          <el-image lazy class="table-td-thumb" :src="scope.row.articleCover" fit="cover"></el-image>
        </template>
      </el-table-column>

      <el-table-column label="是否可见" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.viewStatus === false ? 'danger' : 'success'" disable-transitions>
            {{ scope.row.viewStatus === false ? '不可见' : '可见' }}
          </el-tag>
          <el-switch @click="changeStatus(scope.row, 1)" v-model="scope.row.viewStatus"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="是否启用评论" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.commentStatus === false ? 'danger' : 'success'" disable-transitions>
            {{ scope.row.commentStatus === false ? '否' : '是' }}
          </el-tag>
          <el-switch @click="changeStatus(scope.row, 2)" v-model="scope.row.commentStatus"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.recommendStatus === false ? 'danger' : 'success'" disable-transitions>
            {{ scope.row.recommendStatus === false ? '否' : '是' }}
          </el-tag>
          <el-switch @click="changeStatus(scope.row, 3)" v-model="scope.row.recommendStatus"></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="最终修改时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next" v-model:current-page="pagination.current"
        :page-size="pagination.size" :total="pagination.total" @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/src/router'
import { articleApi } from '@/api/index'
import { useUserStore } from '@/stores'

// 使用store和router
const userStore = useUserStore()


// 响应式数据
const isBoss = computed(() => userStore.currentAdmin?.isBoss || false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  searchKey: "",
  recommendStatus: null,
  sortId: null,
  labelId: null
})
const articles = ref([])
const sorts = ref([])
const labels = ref([])
const labelsTemp = ref([])

// 监听分类变化，更新标签列表
watch(() => pagination.sortId, (newVal) => {
  pagination.labelId = null
  if (newVal && labels.value && labels.value.length > 0) {
    labelsTemp.value = labels.value.filter(l => l.sortId === newVal)
  }
})

// 获取分类和标签
const getSortAndLabel = async () => {
  try {
    const res = await articleApi.getSortAndLabel()
    if (res.data && Object.keys(res.data).length > 0) {
      sorts.value = res.data.sorts
      labels.value = res.data.labels
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取分类和标签失败',
      type: "error"
    })
  }
}

// 清除搜索参数
const clearSearch = () => {
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
const getArticles = async () => {
  try {
    const res = await articleApi.getArticleList({
      ...pagination,
      isBoss: isBoss.value
    })
    if (res.data && Object.keys(res.data).length > 0) {
      articles.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取文章列表失败',
      type: "error"
    })
  }
}

// 分页变化处理
const handlePageChange = (val) => {
  pagination.current = val
  getArticles()
}

// 搜索文章
const searchArticles = () => {
  pagination.total = 0
  pagination.current = 1
  getArticles()
}

// 修改文章状态
const changeStatus = async (article, flag) => {
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
const handleDelete = async (item) => {
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
const handleEdit = (item) => {
  router.push({ path: '/postEdit', query: { id: item.id } })
}

// 组件挂载时获取数据
onMounted(() => {
  getArticles()
  getSortAndLabel()
})
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 160px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.mrb10 {
  margin-right: 10px;
  margin-bottom: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.pagination {
  margin: 20px 0;
  text-align: right;
}

.el-switch {
  margin: 5px;
}
</style>
