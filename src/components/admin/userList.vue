<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select v-model="pagination.userType" placeholder="用户类型" class="handle-select mrb10">
          <el-option key="1" label="Boss" :value="0"></el-option>
          <el-option key="2" label="管理员" :value="1"></el-option>
          <el-option key="3" label="普通用户" :value="2"></el-option>
        </el-select>
        <el-select v-model="pagination.userStatus" placeholder="用户状态" class="handle-select mrb10">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-input v-model="pagination.searchKey" placeholder="用户名/手机号" class="handle-input mrb10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
        <el-button type="danger" @click="clearSearch()">清除参数</el-button>
      </div>
      <el-table :data="users" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column label="赞赏" width="100" align="center">
          <template #default="scope">
            <el-input size="medium" maxlength="30" v-model="scope.row.admire"
                      @blur="changeUserAdmire(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.userStatus === false ? 'danger' : 'success'"
                    disable-transitions>
              {{scope.row.userStatus === false ? '禁用' : '启用'}}
            </el-tag>
            <el-switch @click="changeUserStatus(scope.row)" v-model="scope.row.userStatus"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center">
          <template #default="scope">
            <el-image lazy class="table-td-thumb" :src="scope.row.avatar" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template #default="scope">
            <el-tag type="success"
                    v-if="scope.row.gender === 1"
                    disable-transitions>
              男
            </el-tag>
            <el-tag type="success"
                    v-else-if="scope.row.gender === 2"
                    disable-transitions>
              女
            </el-tag>
            <el-tag type="success"
                    v-else
                    disable-transitions>
              保密
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="introduction" label="简介" align="center"></el-table-column>
        <el-table-column label="用户类型" width="100" align="center">
          <template #default="scope">
            <el-tag type="success"
                    v-if="scope.row.userType === 0"
                    style="cursor: pointer"
                    @click="editUser(scope.row)"
                    disable-transitions>
              Boss
            </el-tag>
            <el-tag type="success"
                    v-else-if="scope.row.userType === 1"
                    style="cursor: pointer"
                    @click="editUser(scope.row)"
                    disable-transitions>
              管理员
            </el-tag>
            <el-tag type="success"
                    v-else
                    style="cursor: pointer"
                    @click="editUser(scope.row)"
                    disable-transitions>
              普通用户
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" align="center"></el-table-column>
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

    <!-- 编辑弹出框 -->
    <el-dialog title="修改用户类型"
               v-model="editVisible"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="myCenter">
        <el-radio-group v-model="changeUser.userType">
          <el-radio-button :label="0">Boss</el-radio-button>
          <el-radio-button :label="1">管理员</el-radio-button>
          <el-radio-button :label="2">普通用户</el-radio-button>
        </el-radio-group>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="saveEdit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api'

// 辅助函数
const isEmpty = (obj) => {
  return obj === null || obj === undefined || (typeof obj === 'object' && Object.keys(obj).length === 0);
};

// 响应式数据
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  searchKey: "",
  userStatus: null,
  userType: null
})
const users = ref([])
const changeUser = reactive({
  id: null,
  userType: null
})
const editVisible = ref(false)

// 清除搜索参数
const clearSearch = () => {
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
const getUsers = async () => {
  try {
    const res = await userApi.listUsers(pagination)
    if (!isEmpty(res.data)) {
      users.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取用户列表失败',
      type: "error"
    })
  }
}

// 改变用户状态
const changeUserStatus = async (user) => {
  try {
    await userApi.changeUserStatus({ userId: user.id, flag: user.userStatus })
    ElMessage({
      message: "修改成功！",
      type: "success"
    })
  } catch (error) {
    ElMessage({
      message: error.message || '修改失败',
      type: "error"
    })
  }
}

// 修改用户赞赏信息
const changeUserAdmire = async (user) => {
  if (!isEmpty(user.admire)) {
    try {
      await ElMessageBox.confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
      
      await userApi.changeUserAdmire({ userId: user.id, admire: user.admire })
      
      ElMessage({
        message: "修改成功！",
        type: "success"
      })
    } catch (error) {
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
const editUser = (user) => {
  changeUser.id = user.id
  changeUser.userType = user.userType
  editVisible.value = true
}

// 分页变化处理
const handlePageChange = (val) => {
  pagination.current = val
  getUsers()
}

// 搜索用户
const searchUser = () => {
  pagination.total = 0
  pagination.current = 1
  getUsers()
}

// 关闭对话框
const handleClose = () => {
  Object.assign(changeUser, {
    id: null,
    userType: null
  })
  editVisible.value = false
}

// 保存编辑
const saveEdit = async () => {
  try {
    await userApi.changeUserType({ userId: changeUser.id, userType: changeUser.userType })
    handleClose()
    getUsers()
    ElMessage({
      message: "修改成功！",
      type: "success"
    })
  } catch (error) {
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

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 160px;
    display: inline-block;
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
