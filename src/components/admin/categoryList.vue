<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Notebook /></el-icon>
        <span>分类列表</span>
      </div>
      <div class="toolbar">
        <el-button type="primary" @click="sortDialog = true">新增分类</el-button>
      </div>
      <el-table :data="sortInfo" border class="table" stripe>
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="name" label="分类名称" align="center" />
        <el-table-column prop="desc" label="分类描述" align="center" show-overflow-tooltip />
        <el-table-column label="分类类型" align="center" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.type === 0 ? 'primary' : 'info'" size="small" disable-transitions>
              {{ scope.row.type === 0 ? '导航栏分类' : '普通分类' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="优先级" align="center" width="80" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-switch
              @click.stop="changeSortStatus(scope.row)"
              v-model="scope.row.isShow"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="editSort(scope.row)">编辑</el-button>
            <el-button type="primary" link @click="sayLabel(scope.row)">查看标签</el-button>
            <el-button type="primary" link @click="insertLabel(scope.row)">新增标签</el-button>
            <el-button type="danger" link @click="deleteHandle(scope.row.id, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-model:current-page="sortPagination.current"
          v-model:page-size="sortPagination.size"
          :page-sizes="sizeOptions"
          :total="sortPagination.total"
          @current-change="handleSortPageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <div v-if="sort && Object.keys(sort).length" class="page-card" style="margin-top: 16px">
      <div class="section-header">
        <el-icon size="16"><CollectionTag /></el-icon>
        <span>标签 - {{ sort.name }}</span>
      </div>
      <el-table :data="sort.labels" border class="table" stripe style="margin-top: 12px">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="name" label="标签名称" align="center" />
        <el-table-column prop="desc" label="标签描述" align="center" show-overflow-tooltip />
        <el-table-column prop="articleCount" label="文章数" align="center" width="80" />
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="editLabel(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="deleteHandle(scope.row.id, 2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="sortDialog" :title="sortForHttp.id ? '编辑分类' : '新增分类'" width="420px" destroy-on-close center>
      <el-form :model="sortForHttp" label-width="90px">
        <el-form-item label="分类名称">
          <el-input v-model="sortForHttp.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="sortForHttp.desc" placeholder="请输入分类描述" />
        </el-form-item>
        <el-form-item label="分类类型">
          <el-radio-group v-model="sortForHttp.type">
            <el-radio-button :label="0">导航栏分类</el-radio-button>
            <el-radio-button :label="1">普通分类</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="sortForHttp.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="saveSortEdit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="labelDialog" :title="labelForHttp.id ? '编辑标签' : '新增标签'" width="420px" destroy-on-close center>
      <el-form :model="labelForHttp" label-width="90px">
        <el-form-item label="标签名称">
          <el-input v-model="labelForHttp.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标签描述">
          <el-input v-model="labelForHttp.desc" placeholder="请输入标签描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="saveLabelEdit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Notebook, CollectionTag } from '@element-plus/icons-vue'
import { adminApi } from '@/api/modules/admin'

interface SortItem {
  id: number; name: string; desc: string; type: number; sort: number; isShow: number; icon?: string
  articleCount?: number; status?: number; priority?: number; labels?: any[]; [key: string]: any
}
interface LabelItem { id: number; categoryId: number; name: string; desc: string }
interface SortForHttp { id: number | null; name: string; desc: string; type: number | null; sort: number | null; isShow: number | null; icon?: string }
interface LabelForHttp { id: number | null; categoryId: number | null; name: string; desc: string }

const sortDialog = ref(false)
const labelDialog = ref(false)
const sortInfo = ref<SortItem[]>([])
const sortPagination = reactive({ current: 1, size: 10, total: 0 })
const sizeOptions = [10, 20, 50, 100]
const sort = reactive<SortItem>({} as SortItem)
const sortForHttp = reactive<SortForHttp>({ id: null, name: '', desc: '', type: null, sort: null, isShow: null })
const labelForHttp = reactive<LabelForHttp>({ id: null, categoryId: null, name: '', desc: '' })

const deleteHandle = async (id: number, flag: number) => {
  try {
    await ElMessageBox.confirm('确认删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true })
    if (flag === 1) await adminApi.deleteCategory(id)
    else await adminApi.deleteTag(id)
    ElMessage.success('删除成功！')
    getSortInfo()
    Object.assign(sort, {})
  } catch (error: any) {
    if (error !== 'cancel') ElMessage.error(error.message)
  }
}

const saveSortEdit = async () => {
  if (!sortForHttp.name || sortForHttp.type === null || sortForHttp.sort === null) {
    ElMessage.error('请完善所有分类信息！'); return
  }
  try {
    if (!sortForHttp.id) await adminApi.saveCategory(sortForHttp)
    else await adminApi.updateCategory(sortForHttp.id!, sortForHttp)
    ElMessage.success('保存成功！')
    getSortInfo(); handleClose()
  } catch (error: any) { ElMessage.error(error.message) }
}

const saveLabelEdit = async () => {
  if (!labelForHttp.name || !labelForHttp.desc) { ElMessage.error('请完善所有标签信息！'); return }
  try {
    if (!labelForHttp.id) await adminApi.saveTag(labelForHttp)
    else await adminApi.updateTag(labelForHttp.id!, labelForHttp)
    ElMessage.success('保存成功！')
    getSortInfo(); handleClose(); Object.assign(sort, {})
  } catch (error: any) { ElMessage.error(error.message) }
}

const editSort = (item: SortItem) => {
  sortDialog.value = true
  sortForHttp.id = item.id; sortForHttp.name = item.name; sortForHttp.desc = item.desc
  sortForHttp.type = item.type; sortForHttp.sort = item.sort; sortForHttp.isShow = item.isShow
}
const editLabel = (item: LabelItem) => {
  labelDialog.value = true
  labelForHttp.id = item.id; labelForHttp.categoryId = item.categoryId
  labelForHttp.name = item.name; labelForHttp.desc = item.desc
}
const insertLabel = (item: SortItem) => { labelForHttp.categoryId = item.id; labelDialog.value = true }

const handleClose = () => {
  Object.assign(labelForHttp, { id: null, categoryId: null, name: '', desc: '' })
  Object.assign(sortForHttp, { id: null, name: '', desc: '', type: null, sort: null, isShow: null })
  sortDialog.value = false; labelDialog.value = false
}

const sayLabel = (item: SortItem) => { Object.assign(sort, item) }

const getSortInfo = async () => {
  try {
    const res: any = await adminApi.getCategoryPage({ pageNum: sortPagination.current, pageSize: sortPagination.size })
    const items = res?.data?.list ?? res?.data?.records
    if (items) {
      sortInfo.value = items
      sortPagination.total = res?.data?.total ?? 0
    }
  } catch (error: any) { ElMessage.error(error.message) }
}

const handleSortPageChange = (val: number) => { sortPagination.current = val; getSortInfo() }
const handleSizeChange = (val: number) => { sortPagination.size = val; sortPagination.current = 1; getSortInfo() }

const changeSortStatus = async (item: SortItem) => {
  if (!item.id) return
  try {
    await adminApi.updateCategory(item.id, { id: item.id, name: item.name, desc: item.desc, type: item.type, isShow: item.isShow, sort: item.sort })
    ElMessage.success('修改成功！')
    getSortInfo()
  } catch (error: any) { ElMessage.error(error.message) }
}

onMounted(() => { getSortInfo() })
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
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 600; color: #1a1d2e;
  margin-bottom: 16px; padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.toolbar { display: flex; justify-content: flex-end; margin-bottom: 16px; }
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
</style>
