<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Collection /></el-icon>
        <span>弹幕管理</span>
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
import { ref, reactive, onMounted, inject } from 'vue'
import { Collection } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { danmakuApi } from '@/api/modules'
import type { Danmaku } from '@/types/modules/danmaku'

interface CommonUtils {
  isEmpty: (obj: any) => boolean
}

const $common = inject<CommonUtils>('$common')!

const danmakus = ref<Danmaku[]>([])
const sizeOptions = [10, 20, 50, 100]
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const getDanmakus = async (): Promise<void> => {
  try {
    const res = await danmakuApi.list()
    if (!$common.isEmpty(res.data)) {
      const all = res.data as Danmaku[]
      pagination.total = all.length
      const start = (pagination.current - 1) * pagination.size
      danmakus.value = all.slice(start, start + pagination.size)
    } else {
      danmakus.value = []
      pagination.total = 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取弹幕列表失败')
  }
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
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
</style>
