<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Collection /></el-icon>
        <span>树洞留言列表</span>
      </div>
      <el-table :data="treeHoles" border class="table" stripe header-cell-class-name="table-header">
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
import type { Ref } from 'vue'
import { Collection } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { webInfoApi } from '@/api/modules'

interface TreeHole {
  id: number;
  message: string;
  createTime: string;
  [key: string]: any;
}

interface Pagination {
  current: number;
  size: number;
  total: number;
}

interface TreeHoleDeleteRequest {
  id: number;
}

interface CommonUtils {
  isEmpty: (obj: any) => boolean;
}

const $common = inject<CommonUtils>('$common')!

const treeHoles = ref<TreeHole[]>([])
const sizeOptions = [10, 20, 50, 100]
const pagination = reactive<Pagination>({
  current: 1,
  size: 10,
  total: 0
})

const getTreeHoles = async (): Promise<void> => {
  try {
    const res = await webInfoApi.getTreeHoleList(pagination)
    if (!($common.isEmpty(res))) {
      treeHoles.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取树洞列表失败')
  }
}

const handlePageChange = (val: number): void => {
  pagination.current = val
  getTreeHoles()
}

const handleSizeChange = (val: number): void => {
  pagination.size = val
  pagination.current = 1
  getTreeHoles()
}

const handleDelete = async (item: TreeHole): Promise<void> => {
  try {
    await ElMessageBox.confirm('确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })
    const deleteRequest: TreeHoleDeleteRequest = { id: item.id }
    await webInfoApi.deleteTreeHole(deleteRequest)
    pagination.current = 1
    getTreeHoles()
    ElMessage.success('删除成功！')
  } catch (error: any) {
    if (error !== 'cancel') ElMessage.error(error.message || '删除失败')
  }
}

onMounted((): void => {
  getTreeHoles()
})
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.page-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
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
