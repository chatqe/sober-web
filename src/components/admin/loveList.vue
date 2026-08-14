<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select clearable v-model="pagination.status" placeholder="状态" class="handle-select mrb10">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
      </div>
      <el-table :data="loves" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>

        <el-table-column prop="manName" label="男生昵称" align="center"></el-table-column>
        <el-table-column prop="womanName" label="女生昵称" align="center"></el-table-column>

        <el-table-column label="背景封面" align="center">
          <template #default="scope">
            <el-image lazy :preview-src-list="[scope.row.bgCover]" class="table-td-thumb" :src="scope.row.bgCover"
                      fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="男生头像" align="center">
          <template #default="scope">
            <el-image lazy :preview-src-list="[scope.row.manCover]" class="table-td-thumb" :src="scope.row.manCover"
                      fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="女生头像" align="center">
          <template #default="scope">
            <el-image lazy :preview-src-list="[scope.row.womanCover]" class="table-td-thumb" :src="scope.row.womanCover"
                      fit="cover"></el-image>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'"
                    disable-transitions>
              {{ scope.row.status === false ? '禁用' : '启用' }}
            </el-tag>
            <el-switch @change="() => changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="timing" label="计时" align="center"></el-table-column>
        <el-table-column prop="countdownTitle" label="倒计时标题" align="center"></el-table-column>
        <el-table-column prop="countdownTime" label="倒计时时间" align="center"></el-table-column>
        <el-table-column prop="familyInfo" label="额外信息" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="最终修改时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="danger" link :icon="Delete"
                       @click="handleDelete(scope.row)">
              删除
            </el-button>
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
import {Search, Delete} from '@element-plus/icons-vue'
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
    const res = await familyApi.listFamily(pagination.value)

    if (res.data?.records) {
      loves.value = res.data.records
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

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 200px;
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
