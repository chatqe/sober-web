<template>
  <div class="page-container">
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-row">
          <el-select v-model="pagination.categoryId" placeholder="分类" class="filter-select" clearable>
            <el-option v-for="item in sorts" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-input v-model="pagination.keyword" placeholder="标签名称" class="filter-input" clearable />
          <el-button type="primary" @click="searchTags">搜索</el-button>
          <el-button @click="clearSearch">清除</el-button>
        </div>
        <div class="toolbar-row">
          <el-button type="primary" @click="openAdd">新增</el-button>
        </div>
      </div>

      <el-table :data="tags" border class="table" stripe header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="60" align="center" />
        <el-table-column prop="name" label="标签名称" min-width="120" align="center" />
        <el-table-column prop="desc" label="标签描述" min-width="180" show-overflow-tooltip align="center" />
        <el-table-column prop="categoryId" label="分类ID" width="90" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info" effect="plain">{{ getCategoryName(row.categoryId) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
        <el-table-column label="操作" width="130" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          v-model:current-page="pagination.pageNum"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '编辑标签' : '新增标签'"
      width="460px"
      destroy-on-close
      center
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="dialog-form"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="item in sorts" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签描述" prop="desc">
          <el-input
            v-model="form.desc"
            placeholder="请输入标签描述"
            maxlength="100"
            show-word-limit
            type="textarea"
            :rows="2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { tagApi } from '@/api/modules/tag'
import { categoryApi } from '@/api/modules/category'
import type { TagSaveReqDTO } from '@/types/modules/tagSaveReqDTO'

interface TagItem {
  id: number
  name: string
  desc: string
  categoryId: number
  createTime: string
}

interface SortItem {
  id: number
  name: string
}

interface Pagination {
  pageNum: number
  pageSize: number
  total: number
  categoryId: number | null
  keyword: string
}

const sorts = ref<SortItem[]>([])
const tags = ref<TagItem[]>([])
const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref<any>(null)

const pagination = reactive<Pagination>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  categoryId: null,
  keyword: '',
})

const form = reactive<TagSaveReqDTO>({ id: null, categoryId: 0, name: '', desc: '' })

const rules = {
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
}

// 获取分类列表（用于下拉框和显示分类名）
const getSorts = async () => {
  try {
    const res: any = await categoryApi.listNavBar()
    if (res && res.length > 0) {
      sorts.value = res.map((item: any) => ({ id: item.id, name: item.name }))
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取分类列表失败')
  }
}

const getCategoryName = (categoryId: number) => {
  const found = sorts.value.find((s) => s.id === categoryId)
  return found?.name ?? `分类${categoryId}`
}

// 获取标签列表
const getTags = async () => {
  try {
    const res: any = await tagApi.getPage({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      categoryId: pagination.categoryId ?? undefined,
      keyword: pagination.keyword || undefined,
    })
    if (res?.list) {
      tags.value = res.list || []
      pagination.total = res.total ?? 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取标签列表失败')
  }
}

const searchTags = () => {
  pagination.pageNum = 1
  getTags()
}

const clearSearch = () => {
  Object.assign(pagination, { pageNum: 1, pageSize: 10, total: 0, categoryId: null, keyword: '' })
  getTags()
}

const handlePageChange = (val: number) => {
  pagination.pageNum = val
  getTags()
}

const openAdd = () => {
  Object.assign(form, { id: null, categoryId: sorts.value[0]?.id ?? 0, name: '', desc: '' })
  dialogVisible.value = true
}

const openEdit = (row: TagItem) => {
  Object.assign(form, { id: row.id, categoryId: row.categoryId, name: row.name, desc: row.desc ?? '' })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  if (!form.name || !form.categoryId) {
    ElMessage.error('请完善所有必填信息！')
    return
  }
  saving.value = true
  try {
    if (!form.id) {
      await tagApi.save(form as TagSaveReqDTO)
    } else {
      await tagApi.update(form.id!, form as TagSaveReqDTO)
    }
    ElMessage.success('保存成功！')
    dialogVisible.value = false
    getTags()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const handleDelete = async (row: TagItem) => {
  try {
    await ElMessageBox.confirm('确认删除该标签？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    })
    await tagApi.delete(row.id)
    ElMessage.success('删除成功！')
    getTags()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  getSorts()
  getTags()
})
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
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
.filter-select { width: 130px; }
.filter-input { width: 160px; }
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
.dialog-form { padding: 4px 0; }
.dialog-form .el-form-item { margin-bottom: 18px; }
</style>
