<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="sortDialog = true">新增分类</el-button>
    </div>
    <el-table :data="sortInfo" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
      <el-table-column prop="description" label="分类描述" align="center"></el-table-column>
      <el-table-column label="分类类型" align="center">
        <template #default="scope">
          <span v-if="scope.row.sortType === 0">导航栏分类</span>
          <span v-else-if="scope.row.sortType === 1">普通分类</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="分类优先级" align="center"></el-table-column>
      <el-table-column prop="countOfSort" label="文章总数" align="center"></el-table-column>

      <el-table-column prop="status" label="是否展示" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'danger' : 'success'"
                  disable-transitions>
            {{ scope.row.status === 0 ? '禁用' : '启用' }}
          </el-tag>
          <el-switch @click="changeSortStatus(scope.row)" v-model="scope.row.status"
                     :active-value="1"
                     :inactive-value="0"
                     style="margin-left: 10px;"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="380" align="center">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" @click="editSort(scope.row)">
            编辑分类
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="sayLabel(scope.row)">
            查看标签
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="insertLabel(scope.row)">
            新增标签
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                     @click="deleteHandle(scope.row.id, 1)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="!$common.isEmpty(sort)" :data="sort.tags" border class="table"
              style="margin-top: 40px"
              header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column label="分类名称" align="center">
        <span>{{ sort.name }}</span>
      </el-table-column>
      <el-table-column prop="name" label="标签名称" align="center"></el-table-column>
      <el-table-column prop="description" label="标签描述" align="center"></el-table-column>
      <el-table-column prop="countOfTag" label="文章总数" align="center"></el-table-column>

      <el-table-column label="操作" width="320" align="center">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" @click="editLabel(scope.row)">
            编辑标签
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                     @click="deleteHandle(scope.row.id, 2)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="分类"
               v-model="sortDialog"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="my-dialog">
        <div class="myCenter">
          <el-radio-group v-model="sortForHttp.sortType">
            <el-radio-button :label="0">导航栏分类</el-radio-button>
            <el-radio-button :label="1">普通分类</el-radio-button>
          </el-radio-group>
        </div>
        <el-input placeholder="请输入分类名称" v-model="sortForHttp.name">
          <template #prepend>分类名称</template>
        </el-input>
        <el-input placeholder="请输入分类描述" v-model="sortForHttp.description">
          <template #prepend>分类描述</template>
        </el-input>
        <el-input type="number" placeholder="请输入整数，数字小的在前面"
                  v-model="sortForHttp.priority">
          <template #prepend>分类优先级</template>
        </el-input>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="saveSortEdit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="标签"
               v-model="labelDialog"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="my-dialog">
        <el-input placeholder="请输入标签名称" v-model="labelForHttp.name">
          <template #prepend>标签名称</template>
        </el-input>
        <el-input placeholder="请输入标签描述" v-model="labelForHttp.description">
          <template #prepend>标签描述</template>
        </el-input>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="saveLabelEdit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { webInfoApi } from '@/api/index.js'

// 定义接口
interface CategoryItem {
  id: number;
  name: string;
  description: string;
  sortType: number;
  priority: number;
  countOfSort: number;
  status: number;
  tags?: TagItem[];
}

interface TagItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  countOfTag?: number;
}

interface SortForHttp {
  id: number | null;
  name: string;
  status: number | null;
  description: string;
  sortType: number | null;
  priority: number | null;
}

interface LabelForHttp {
  id: number | null;
  categoryId: number | null;
  name: string;
  description: string;
}

interface CommonUtils {
  isEmpty: (value: any) => boolean;
}

interface ApiResponse<T> {
  data: T;
  [key: string]: any;
}

// 注入全局属性
const $common = inject<CommonUtils>('$common')!

// 响应式数据
const sortDialog = ref<boolean>(false)
const labelDialog = ref<boolean>(false)
const sortInfo = ref<CategoryItem[]>([])
const sort = reactive<CategoryItem>({} as CategoryItem)
const sortForHttp = reactive<SortForHttp>({
  id: null,
  name: "",
  status: null,
  description: "",
  sortType: null,
  priority: null
})
const labelForHttp = reactive<LabelForHttp>({
  id: null,
  categoryId: null,
  name: "",
  description: ""
})

// 删除处理
const deleteHandle = async (id: number, flag: number): Promise<void> => {
  try {
    await ElMessageBox.confirm('确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    })
    
    if (flag === 1) {
      await webInfoApi.deleteSort({id})
    } else if (flag === 2) {
      await webInfoApi.deleteLabel({id})
    }
    
    ElMessage({
      message: "删除成功！",
      type: "success"
    })
    getSortInfo()
    Object.assign(sort, {})
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        message: error.message,
        type: "error"
      })
    } else {
      ElMessage({
        type: 'success',
        message: '已取消删除!'
      })
    }
  }
}

// 保存分类编辑
const saveSortEdit = async (): Promise<void> => {
  if ($common.isEmpty(sortForHttp.sortType) ||
    $common.isEmpty(sortForHttp.priority) ||
    $common.isEmpty(sortForHttp.name) ||
    $common.isEmpty(sortForHttp.description)) {
    ElMessage({
      message: "请完善所有分类信息！",
      type: "error"
    })
    return
  }

  try {
    if ($common.isEmpty(sortForHttp.id)) {
      await webInfoApi.saveSort(sortForHttp)
    } else {
      await webInfoApi.updateSort(sortForHttp)
    }
    
    ElMessage({
      message: "保存成功！",
      type: "success"
    })
    getSortInfo()
    handleClose()
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 保存标签编辑
const saveLabelEdit = async (): Promise<void> => {
  if ($common.isEmpty(labelForHttp.name) ||
    $common.isEmpty(labelForHttp.description)) {
    ElMessage({
      message: "请完善所有标签信息！",
      type: "error"
    })
    return
  }

  try {
    if ($common.isEmpty(labelForHttp.id)) {
      await webInfoApi.saveLabel(labelForHttp)
    } else {
      await webInfoApi.updateLabel(labelForHttp)
    }
    
    ElMessage({
      message: "保存成功！",
      type: "success"
    })
    getSortInfo()
    handleClose()
    Object.assign(sort, {})
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 编辑分类
const editSort = (item: CategoryItem): void => {
  sortDialog.value = true
  sortForHttp.id = item.id
  sortForHttp.name = item.name
  sortForHttp.description = item.description
  sortForHttp.sortType = item.sortType
  sortForHttp.priority = item.priority
  sortForHttp.status = item.status
}

// 编辑标签
const editLabel = (item: TagItem): void => {
  labelDialog.value = true
  labelForHttp.id = item.id
  labelForHttp.categoryId = item.categoryId
  labelForHttp.name = item.name
  labelForHttp.description = item.description
}

// 插入标签
const insertLabel = (item: CategoryItem): void => {
  labelForHttp.categoryId = item.id
  labelDialog.value = true
}

// 关闭对话框
const handleClose = (): void => {
  Object.assign(labelForHttp, {
    id: null,
    categoryId: null,
    name: "",
    description: ""
  })
  Object.assign(sortForHttp, {
    id: null,
    name: "",
    description: "",
    sortType: null,
    priority: null,
    status: null,
  })
  sortDialog.value = false
  labelDialog.value = false
}

// 查看标签
const sayLabel = (item: CategoryItem): void => {
  Object.assign(sort, item)
}

// 获取分类信息
const getSortInfo = async (): Promise<void> => {
  try {
    const res: ApiResponse<CategoryItem[]> = await webInfoApi.getSortInfo()
    if (!res.data) return
    
    if (!($common.isEmpty(res.data))) {
      sortInfo.value = res.data
      console.log(res.data)
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 改变分类状态
const changeSortStatus = async (item: CategoryItem): Promise<void> => {
  if (item.status !== null && item.id !== null) {
    try {
      await webInfoApi.updateSort(item)
      ElMessage({
        message: "修改成功！",
        type: "success"
      })
      getSortInfo()
      handleClose()
    } catch (error) {
      ElMessage({
        message: error.message,
        type: "error"
      })
    }
  }
}

// 组件挂载时获取数据
onMounted((): void => {
  getSortInfo()
})
</script>

<style scoped>

.my-dialog > div {
  margin: 12px;
}

.my-dialog >>> input::-webkit-inner-spin-button {
  appearance: none;
}


</style>
