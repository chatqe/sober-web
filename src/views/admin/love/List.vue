<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Sugar /></el-icon>
        <span>表白墙</span>
      </div>
      <div class="toolbar">
        <el-select v-model="pagination.status" placeholder="状态" class="filter-select">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-button type="primary" @click="search()">搜索</el-button>
      </div>
      <el-table :data="loves" border class="table" stripe header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="userId" label="用户ID" align="center" width="90" />
        <el-table-column prop="manName" label="男生昵称" align="center" width="100" />
        <el-table-column prop="womanName" label="女生昵称" align="center" width="100" />
        <el-table-column label="背景" align="center" width="70">
          <template #default="scope">
            <el-image lazy :preview-src-list="[scope.row.bgCover]" class="table-td-thumb" :src="scope.row.bgCover" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="男生头像" align="center" width="70">
          <template #default="scope">
            <el-image lazy :preview-src-list="[scope.row.manCover]" class="table-td-thumb" :src="scope.row.manCover" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="女生头像" align="center" width="70">
          <template #default="scope">
            <el-image lazy :preview-src-list="[scope.row.womanCover]" class="table-td-thumb" :src="scope.row.womanCover" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'" disable-transitions size="small">
              {{ scope.row.status === false ? '禁用' : '启用' }}
            </el-tag>
            <el-switch @change="() => changeStatus(scope.row)" v-model="scope.row.status" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="timing" label="计时" align="center" width="120" />
        <el-table-column prop="countdownTitle" label="倒计时标题" align="center" show-overflow-tooltip />
        <el-table-column prop="countdownTime" label="倒计时时间" align="center" width="155" />
        <el-table-column prop="familyInfo" label="额外信息" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" align="center" width="155" />
        <el-table-column prop="updateTime" label="修改时间" align="center" width="155" />
        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template #default="scope">
            <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next"
                       v-model:current-page="pagination.current"
                       :page-size="pagination.size"
                       :total="pagination.total"
                       @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import { Sugar } from '@element-plus/icons-vue'
import {familyApi} from '@/api/index.js'
// 定义接口
interface Love {
  id: number;
  userId: number;
  manName: string;
  womanName: string;
  bgCover: string;
  manCover: string;
  womanCover: string;
  status: boolean;
  timing: string;
  countdownTitle: string;
  countdownTime: string;
  familyInfo: string;
  createTime: string;
  updateTime: string;
  [key: string]: any;
}

interface Pagination {
  current: number;
  size: number;
  total: number;
  status: boolean | null;
}

interface DeleteLoveRequest {
  id: number;
}

interface ChangeStatusRequest {
  id: number;
  flag: boolean;
}

// 响应式数据
const pagination: Ref<Pagination> = ref({
  current: 1,
  size: 10,
  total: 0,
  status: null
})

const loves: Ref<Love[]> = ref([])
const loading: Ref<boolean> = ref(false)

// 方法
const handleDelete = async (item: Love): Promise<void> => {
  try {
    await ElMessageBox.confirm('确认删除资源？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })

    const deleteRequest: DeleteLoveRequest = {id: item.id};
    await familyApi.deleteFamily(deleteRequest)
    pagination.value.current = 1
    await getLoves()
    ElMessage.success('删除成功！')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const search = (): void => {
  pagination.value.current = 1
  getLoves()
}

const getLoves = async (): Promise<void> => {
  try {
    loading.value = true
    const res = await familyApi.listFamily({ query: { ...pagination, status: 1 } as any })

    if (res.data?.list) {
      loves.value = res.data.list
      pagination.value.total = res.data.total
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取数据失败')
  } finally {
    loading.value = false
  }
}

const changeStatus = async (item: Love): Promise<void> => {
  try {
    const statusRequest: ChangeStatusRequest = {
      id: item.id,
      flag: item.status
    };
    await familyApi.changeLoveStatus(statusRequest)
    ElMessage.success('修改成功！')
  } catch (error: any) {
    ElMessage.error(error.message || '修改失败')
  }
}

const handlePageChange = (val: number): void => {
  pagination.value.current = val
  getLoves()
}

// 生命周期
onMounted((): void => {
  getLoves()
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
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 600; color: #1a1d2e;
  margin-bottom: 16px; padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.filter-select { width: 100px; }
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
.table-td-thumb {
  display: block; margin: auto;
  width: 36px; height: 36px;
  border-radius: 6px;
}
</style>
