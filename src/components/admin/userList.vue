<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><User /></el-icon>
        <span>用户管理</span>
      </div>
      <div class="toolbar">
        <el-select v-model="pagination.userType" placeholder="用户类型" class="filter-select">
          <el-option key="1" label="Boss" :value="0"></el-option>
          <el-option key="2" label="管理员" :value="1"></el-option>
          <el-option key="3" label="普通用户" :value="2"></el-option>
        </el-select>
        <el-select v-model="pagination.userStatus" placeholder="用户状态" class="filter-select">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-input v-model="pagination.searchKey" placeholder="用户名/手机号" class="filter-input" clearable />
        <el-button type="primary" @click="searchUser()">搜索</el-button>
        <el-button @click="clearSearch()">清除</el-button>
      </div>
      <el-table :data="users" border class="table" stripe header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="phoneNum" label="手机号" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column label="赞赏" width="120" align="center">
          <template #default="scope">
            <el-input size="small" maxlength="30" v-model="scope.row.admire"
                      @blur="changeUserAdmire(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.userStatus === false ? 'danger' : 'success'"
                    disable-transitions size="small">
              {{scope.row.userStatus === false ? '禁用' : '启用'}}
            </el-tag>
            <el-switch @click="changeUserStatus(scope.row)" v-model="scope.row.userStatus" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center" width="70">
          <template #default="scope">
            <el-image lazy class="table-td-thumb" :src="scope.row.avatar" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center" width="70">
          <template #default="scope">
            <el-tag type="info" size="small" disable-transitions>
              {{ scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '保密' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="introduction" label="简介" align="center" show-overflow-tooltip />
        <el-table-column label="用户类型" align="center" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.userType === 0 ? 'warning' : scope.row.userType === 1 ? 'primary' : 'info'"
              size="small"
              style="cursor: pointer"
              @click="editUser(scope.row)"
              disable-transitions>
              {{ scope.row.userType === 0 ? 'Boss' : scope.row.userType === 1 ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" align="center" width="160" />
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

    <el-dialog title="修改用户类型"
               v-model="editVisible"
               width="360px"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="dialog-content">
        <el-radio-group v-model="changeUser.userType">
          <el-radio-button :label="0">Boss</el-radio-button>
          <el-radio-button :label="1">管理员</el-radio-button>
          <el-radio-button :label="2">普通用户</el-radio-button>
        </el-radio-group>
      </div>
      <template #footer>
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="saveEdit()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { userApi } from '@/api/index.js'
import type { ChangeUserTypeUserType } from '@/types/modules/changeUserTypeUserType'

// 定义数据接口
interface User {
  id: number
  username: string
  phoneNum: string
  email: string
  admire: string
  userStatus: boolean
  avatar: string
  gender: number
  introduction: string
  userType: number
  createTime: string
  [key: string]: any
}

interface Pagination {
  current: number
  size: number
  total: number
  searchKey: string
  userStatus: boolean | null
  userType: number | null
}

interface ChangeUser {
  id: number | null
  userType: ChangeUserTypeUserType | null
}

interface UserStatusRequest {
  userId: number
  flag: boolean
}

interface UserAdmireRequest {
  userId: number
  admire: string
}

interface UserTypeRequest {
  userId: number
  userType: ChangeUserTypeUserType
}

// 从全局注入获取公共工具函数
import { inject } from 'vue'

interface CommonUtils {
  isEmpty: (obj: any) => boolean
}

const $common = inject<CommonUtils>('$common')!

// 响应式数据
const pagination: Pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  searchKey: "",
  userStatus: null,
  userType: null
})
const users: Ref<User[]> = ref([])
const changeUser: ChangeUser = reactive({
  id: null,
  userType: null
})
const editVisible: Ref<boolean> = ref(false)

// 清除搜索参数
const clearSearch = (): void => {
  Object.assign(pagination, {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    userStatus: null,
    userType: null
  })
  getUsers()
}

// 获取用户列表
const getUsers = async (): Promise<void> => {
  try {
    const res: any = await userApi.listUsers(pagination)
    if (!$common.isEmpty(res)) {
      users.value = res.records
      pagination.total = res.total
    }
  } catch (error: any) {
    ElMessage({
      message: error.message || '获取用户列表失败',
      type: "error"
    })
  }
}

// 改变用户状态
const changeUserStatus = async (user: User): Promise<void> => {
  try {
    const request: UserStatusRequest = { userId: user.id, flag: user.userStatus }
    await userApi.changeUserStatus(request)
    ElMessage({
      message: "修改成功！",
      type: "success"
    })
  } catch (error: any) {
    ElMessage({
      message: error.message || '修改失败',
      type: "error"
    })
  }
}

// 修改用户赞赏信息
const changeUserAdmire = async (user: User): Promise<void> => {
  if (!$common.isEmpty(user.admire)) {
    try {
      await ElMessageBox.confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
      
      const request: UserAdmireRequest = { userId: user.id, admire: user.admire }
      await userApi.changeUserAdmire(request)
      
      ElMessage({
        message: "修改成功！",
        type: "success"
      })
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage({
          message: error.message || '修改失败',
          type: "error"
        })
      } else {
        ElMessage({
          type: 'warning',
          message: '已取消保存!'
        })
      }
    }
  }
}

// 编辑用户
const editUser = (user: User): void => {
  changeUser.id = user.id
  changeUser.userType = parseInt(String(user.userType)) as unknown as ChangeUserTypeUserType | null
  editVisible.value = true
}

// 分页变化处理
const handlePageChange = (val: number): void => {
  pagination.current = val
  getUsers()
}

// 搜索用户
const searchUser = (): void => {
  pagination.total = 0
  pagination.current = 1
  getUsers()
}

// 关闭对话框
const handleClose = (): void => {
  Object.assign(changeUser, {
    id: null,
    userType: null
  })
  editVisible.value = false
}

// 保存编辑
const saveEdit = async (): Promise<void> => {
  try {
    if (!changeUser.id || changeUser.userType === null) return
    
    const request: UserTypeRequest = { userId: changeUser.id, userType: changeUser.userType }
    await userApi.changeUserType(request)
    
    handleClose()
    getUsers()
    
    ElMessage({
      message: "修改成功！",
      type: "success"
    })
  } catch (error: any) {
    ElMessage({
      message: error.message || '修改失败',
      type: "error"
    })
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getUsers()
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
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filter-select { width: 120px; }
.filter-input { width: 180px; }
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
.table-td-thumb {
  display: block;
  margin: auto;
  width: 36px;
  height: 36px;
  border-radius: 6px;
}
.dialog-content {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}
</style>
