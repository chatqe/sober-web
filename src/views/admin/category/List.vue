<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Notebook /></el-icon>
        <span>分类列表</span>
        <div class="header-actions">
          <el-button type="primary" size="small" @click="openAddSort">
            <el-icon><Plus /></el-icon>
            新增分类
          </el-button>
        </div>
      </div>

      <el-table
        :data="sortInfo"
        border
        class="table"
        stripe
        row-key="id"
        :expand-row-keys="expandedRows"
        @expand-change="handleExpand"
      >
        <el-table-column type="expand" width="40">
          <template #default="{ row }">
            <div class="tag-expand-panel" v-loading="row._loading">
              <div class="tag-expand-header">
                <el-icon size="14"><CollectionTag /></el-icon>
                <span>标签 — {{ row.name }}</span>
                <el-button type="primary" link size="small" @click.stop="insertLabel(row)">
                  <el-icon><Plus /></el-icon> 新增标签
                </el-button>
              </div>
              <el-table :data="row.tags ?? []" border class="tag-table" size="small">
                <el-table-column prop="id" label="ID" width="55" align="center" />
                <el-table-column prop="name" label="标签名称" align="center" />
                <el-table-column prop="desc" label="标签描述" align="center" show-overflow-tooltip />
                <el-table-column prop="articleCount" label="文章数" align="center" width="80">
                  <template #default="{ row: t }">
                    <el-tag size="small" type="info" effect="plain">{{ t.articleCount ?? 0 }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="130" align="center">
                  <template #default="{ row: t }">
                    <el-button type="primary" link size="small" @click="editLabel(t)">编辑</el-button>
                    <el-button type="danger" link size="small" @click="deleteHandle(t.id, 2)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="分类名称" min-width="140">
          <template #default="{ row }">
            <span class="cat-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="desc" label="分类描述" min-width="180" show-overflow-tooltip />

        <el-table-column label="类型" width="110" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.type === 0 ? 'primary' : 'info'"
              size="small"
              effect="plain"
              disable-transitions
            >
              {{ scope.row.type === 0 ? '导航栏' : '普通' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="优先级" width="80" align="center">
          <template #default="{ row }">
            <span class="priority-num">{{ row.sort ?? '—' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="90" align="center">
          <template #default="scope">
            <el-switch
              size="small"
              :model-value="scope.row.isShow === 1"
              @change="() => changeSortStatus(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-dropdown trigger="click" @command="(cmd) => handleAction(cmd, scope.row)">
              <el-button type="primary" link size="small">
                操作 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">
                    <el-icon><Edit /></el-icon> 编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="tags">
                    <el-icon><CollectionTag /></el-icon> 查看标签
                  </el-dropdown-item>
                  <el-dropdown-item command="addTag">
                    <el-icon><Plus /></el-icon> 新增标签
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <el-icon style="color: #f56c6c"><Delete /></el-icon> 删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

    <!-- 分类编辑弹窗 -->
    <el-dialog
      v-model="sortDialog"
      :title="sortForHttp.id ? '编辑分类' : '新增分类'"
      width="440px"
      destroy-on-close
      center
    >
      <el-form ref="sortFormRef" :model="sortForHttp" :rules="sortRules" label-width="80px" class="dialog-form">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="sortForHttp.name" placeholder="请输入分类名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="分类描述" prop="desc">
          <el-input v-model="sortForHttp.desc" placeholder="请输入分类描述" maxlength="100" show-word-limit type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="分类类型" prop="type">
          <el-radio-group v-model="sortForHttp.type">
            <el-radio-button :value="0">导航栏分类</el-radio-button>
            <el-radio-button :value="1">普通分类</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优先级" prop="sort">
          <el-input-number v-model="sortForHttp.sort" :min="0" :max="999" controls-position="right" style="width: 120px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="sortSaving" @click="saveSortEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 标签编辑弹窗 -->
    <el-dialog
      v-model="labelDialog"
      :title="labelForHttp.id ? '编辑标签' : '新增标签'"
      width="440px"
      destroy-on-close
      center
    >
      <el-form ref="labelFormRef" :model="labelForHttp" :rules="labelRules" label-width="80px" class="dialog-form">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="labelForHttp.name" placeholder="请输入标签名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="标签描述" prop="desc">
          <el-input v-model="labelForHttp.desc" placeholder="请输入标签描述" maxlength="100" show-word-limit type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="labelSaving" @click="saveLabelEdit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Notebook, CollectionTag, Plus, Edit, Delete, ArrowDown
} from '@element-plus/icons-vue'
import { adminApi } from '@/api/modules/admin'

interface SortItem {
  id: number; name: string; desc: string; type: number; sort: number; isShow: number; icon?: string
  articleCount?: number; status?: number; priority?: number; tags?: any[]; _loading?: boolean
  [key: string]: any
}
interface LabelItem { id: number; categoryId: number; name: string; desc: string }
interface SortForHttp { id: number | null; name: string; desc: string; type: number | null; sort: number | null; isShow: number | null; icon?: string }
interface LabelForHttp { id: number | null; categoryId: number | null; name: string; desc: string }

// 弹窗状态
const sortDialog = ref(false)
const labelDialog = ref(false)
const sortSaving = ref(false)
const labelSaving = ref(false)

// 数据
const sortInfo = ref<SortItem[]>([])
const sortPagination = reactive({ current: 1, size: 10, total: 0 })
const sizeOptions = [10, 20, 50, 100]
const expandedRows = ref<number[]>([])
const sortFormRef = ref<any>(null)
const labelFormRef = ref<any>(null)

const sort = reactive<SortItem>({} as SortItem)
const sortForHttp = reactive<SortForHttp>({ id: null, name: '', desc: '', type: null, sort: null, isShow: null })
const labelForHttp = reactive<LabelForHttp>({ id: null, categoryId: null, name: '', desc: '' })

const sortRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择分类类型', trigger: 'change' }],
  sort: [{ required: true, message: '请设置优先级', trigger: 'change' }],
}
const labelRules = {
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  desc: [{ required: true, message: '请输入标签描述', trigger: 'blur' }],
}

// 展开行切换
const handleExpand = (row: SortItem) => {
  if (!row.tags && expandedRows.value.includes(row.id)) {
    fetchTags(row)
  }
}

const fetchTags = async (row: SortItem) => {
  row._loading = true
  try {
    const res: any = await adminApi.getTagPage({ categoryId: row.id })
    row.tags = res?.data?.list ?? res?.data?.records ?? []
  } catch (error: any) {
    ElMessage.error(error.message)
  } finally {
    row._loading = false
  }
}

// 操作下拉
const handleAction = (cmd: string, row: SortItem) => {
  switch (cmd) {
    case 'edit': openEditSort(row); break
    case 'tags': sayLabel(row); break
    case 'addTag': insertLabel(row); break
    case 'delete': deleteHandle(row.id, 1); break
  }
}

const openAddSort = () => {
  Object.assign(sortForHttp, { id: null, name: '', desc: '', type: 1, sort: 0, isShow: null })
  sortDialog.value = true
}

const openEditSort = (item: SortItem) => {
  Object.assign(sortForHttp, {
    id: item.id, name: item.name, desc: item.desc,
    type: item.type, sort: item.sort, isShow: item.isShow,
  })
  sortDialog.value = true
}

const saveSortEdit = async () => {
  try {
    await sortFormRef.value.validate()
  } catch { return }
  if (!sortForHttp.name || sortForHttp.type === null || sortForHttp.sort === null) {
    ElMessage.error('请完善所有分类信息！'); return
  }
  sortSaving.value = true
  try {
    if (!sortForHttp.id) await adminApi.saveCategory(sortForHttp)
    else await adminApi.updateCategory(sortForHttp.id!, sortForHttp)
    ElMessage.success('保存成功！')
    getSortInfo(); handleClose()
  } catch (error: any) { ElMessage.error(error.message) } finally { sortSaving.value = false }
}

const editLabel = (item: LabelItem) => {
  Object.assign(labelForHttp, { id: item.id, categoryId: item.categoryId, name: item.name, desc: item.desc })
  labelDialog.value = true
}

const insertLabel = (item: SortItem) => {
  Object.assign(labelForHttp, { id: null, categoryId: item.id, name: '', desc: '' })
  labelDialog.value = true
}

const saveLabelEdit = async () => {
  try {
    await labelFormRef.value.validate()
  } catch { return }
  if (!labelForHttp.name || !labelForHttp.desc) { ElMessage.error('请完善所有标签信息！'); return }
  labelSaving.value = true
  try {
    if (!labelForHttp.id) await adminApi.saveTag(labelForHttp)
    else await adminApi.updateTag(labelForHttp.id!, labelForHttp)
    ElMessage.success('保存成功！')
    getSortInfo(); handleClose(); Object.assign(sort, {})
  } catch (error: any) { ElMessage.error(error.message) } finally { labelSaving.value = false }
}

const handleClose = () => {
  Object.assign(labelForHttp, { id: null, categoryId: null, name: '', desc: '' })
  Object.assign(sortForHttp, { id: null, name: '', desc: '', type: null, sort: null, isShow: null })
  sortDialog.value = false; labelDialog.value = false
}

const sayLabel = async (item: SortItem) => {
  // 切换展开行
  const idx = expandedRows.value.indexOf(item.id)
  if (idx >= 0) expandedRows.value.splice(idx, 1)
  else expandedRows.value = [item.id]
  if (!item.tags) fetchTags(item)
}

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
    await adminApi.updateCategory(item.id, {
      id: item.id, name: item.name, desc: item.desc,
      type: item.type, isShow: item.isShow, sort: item.sort,
    })
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
  border: 1px solid #e2e8f0;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 600;
  color: #1a1d2e;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.header-actions { display: flex; gap: 8px; }

/* 展开行面板 */
.tag-expand-panel {
  padding: 12px 20px 16px 40px;
  background: #fafbfc;
  border-top: 1px solid #f0f4f8;
}
.tag-expand-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475467;
  margin-bottom: 10px;
}

/* 标签表格 */
.tag-table { width: 100%; font-size: 13px; }

/* 分类名称 */
.cat-name { font-weight: 500; color: #1a1d2e; }

/* 优先级数字 */
.priority-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #f1f5f9;
  font-size: 12px;
  color: #475467;
  font-weight: 500;
}

/* 表单 */
.dialog-form { padding: 4px 0; }
.dialog-form .el-form-item { margin-bottom: 18px; }

/* 分页 */
.pagination { margin-top: 16px; text-align: right; }

/* 表格样式覆盖 */
:deep(.el-table) { font-size: 13.5px; }
:deep(.el-table th.el-table__cell) { background: #f8fafc; font-weight: 600; color: #475467; }
:deep(.el-table .el-table__expand-icon) { margin-top: 2px; }
:deep(.el-table__expand-column .cell) { padding: 0 8px; display: flex; align-items: center; justify-content: center; }
</style>
