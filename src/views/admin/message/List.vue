<template>
  <div class="page-container">
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-row">
          <el-input v-model="pagination.keyword" placeholder="留言内容" class="filter-input" clearable>
            <template #prefix><el-icon size="14"><Search /></el-icon></template>
          </el-input>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearSearch">清除</el-button>
        </div>
      </div>

      <el-table :data="comments" border class="table" stripe header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="username" label="留言者" align="center" width="120" show-overflow-tooltip />
        <el-table-column prop="commentContent" label="留言内容" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" align="center" width="160" />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          v-model:current-page="pagination.current"
          :page-size="pagination.size"
          :total="pagination.total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { commentApi } from '@/api/modules'

interface Comment {
  id: number;
  username?: string;
  commentContent: string;
  createTime: string;
  [key: string]: any;
}

interface Pagination {
  current: number;
  size: number;
  total: number;
  keyword: string;
}

const comments = ref<Comment[]>([])
const pagination = reactive<Pagination>({
  current: 1,
  size: 10,
  total: 0,
  keyword: ''
})

const getMessages = async (): Promise<void> => {
  try {
    const res = await commentApi.bossCommentList({
      pageNum: pagination.current,
      pageSize: pagination.size,
      commentType: 'message',
      searchKey: pagination.keyword || undefined
    })
    if (res && res.list) {
      comments.value = res.list
      pagination.total = res.total ?? 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取留言列表失败')
  }
}

const search = (): void => {
  pagination.current = 1
  getMessages()
}

const clearSearch = (): void => {
  pagination.keyword = ''
  pagination.current = 1
  getMessages()
}

const handlePageChange = (val: number): void => {
  pagination.current = val
  getMessages()
}

const handleDelete = async (item: Comment): Promise<void> => {
  try {
    await ElMessageBox.confirm('确认删除该条留言？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })
    await commentApi.delAdminComment({ id: item.id })
    getMessages()
    ElMessage.success('删除成功！')
  } catch (error: any) {
    if (error !== 'cancel') ElMessage.error(error.message || '删除失败')
  }
}

onMounted((): void => {
  getMessages()
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
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.toolbar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.filter-input { width: 220px; }
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
</style>
