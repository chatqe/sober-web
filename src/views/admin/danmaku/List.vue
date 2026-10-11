<template>
  <div class="page-container">
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-row">
          <el-input v-model="pagination.keyword" placeholder="搜索弹幕内容" class="filter-input" clearable>
            <template #prefix><el-icon size="14"><Search /></el-icon></template>
          </el-input>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearSearch">清除</el-button>
        </div>
      </div>

      <el-table :data="danmakus" border class="table" stripe header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="message" label="留言内容" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" align="center" width="160" />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="sizeOptions"
          :total="pagination.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { danmakuApi } from '@/api/modules'
import type { Danmaku } from '@/types/modules/danmaku'

const danmakus = ref<Danmaku[]>([])
const sizeOptions = [10, 20, 50, 100]
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  keyword: ''
})

const getDanmakus = async (): Promise<void> => {
  try {
    const res = await danmakuApi.adminList({
      pageNum: pagination.current,
      pageSize: pagination.size,
      keyword: pagination.keyword || undefined
    })
    const records = res.list ?? []
    pagination.total = res.total ?? 0
    danmakus.value = records as Danmaku[]
  } catch (error: any) {
    ElMessage.error(error.message || '获取弹幕列表失败')
  }
}

const search = (): void => {
  pagination.current = 1
  getDanmakus()
}

const clearSearch = (): void => {
  pagination.keyword = ''
  pagination.current = 1
  getDanmakus()
}

const handlePageChange = (val: number): void => {
  pagination.current = val
  getDanmakus()
}

const handleSizeChange = (val: number): void => {
  pagination.size = val
  pagination.current = 1
  getDanmakus()
}

const handleDelete = async (item: Danmaku): Promise<void> => {
  try {
    await ElMessageBox.confirm('确认删除该弹幕？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })
    await danmakuApi.delete(item.id!)
    getDanmakus()
    ElMessage.success('删除成功！')
  } catch (error: any) {
    if (error !== 'cancel') ElMessage.error(error.message || '删除失败')
  }
}

onMounted((): void => {
  getDanmakus()
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
