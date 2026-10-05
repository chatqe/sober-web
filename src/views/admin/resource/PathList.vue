<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><CreditCard /></el-icon>
        <span>资源聚合</span>
      </div>
      <div class="toolbar">
        <el-select clearable v-model="pagination.resourceType" placeholder="资源路径类型" class="filter-select">
          <el-option v-for="(item, i) in resourceTypes" :key="i" :label="item.label" :value="item.value" />
        </el-select>
        <el-select clearable v-model="pagination.status" placeholder="状态" class="filter-select">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="addResourcePathDialog = true">新增资源路径</el-button>
      </div>
      <el-table :data="resourcePaths" border class="table" stripe header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="title" label="标题" align="center" />
        <el-table-column prop="classify" label="分类" align="center" width="100" />
        <el-table-column prop="introduction" label="简介" align="center" show-overflow-tooltip />
        <el-table-column label="封面" align="center" width="70">
          <template #default="scope">
            <el-image lazy :preview-src-list="[scope.row.cover]" class="table-td-thumb" :src="scope.row.cover" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接" align="center" show-overflow-tooltip />
        <el-table-column prop="type" label="资源类型" align="center" width="100" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'" disable-transitions size="small">
              {{ scope.row.status === false ? '禁用' : '启用' }}
            </el-tag>
            <el-switch @change="changeStatus(scope.row)" v-model="scope.row.status" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" align="center" width="155" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next"
                       :current-page="pagination.current"
                       :page-size="pagination.size"
                       :total="pagination.total"
                       @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="上传封面"
               v-model="coverDialog"
               width="400px"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <uploadPicture :isAdmin="true" :prefix="resourcePath.type + 'Cover'" @addPicture="addPicture" :maxSize="2"
                     :maxNumber="1" />
    </el-dialog>

    <el-dialog title="上传文件"
               v-model="uploadDialog"
               width="400px"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <uploadPicture :isAdmin="true" :prefix="resourcePath.type + 'Url'" @addPicture="addFile" :maxSize="10"
                     :maxNumber="1" :listType="'text'" :accept="'image/*, video/*, audio/*'" />
    </el-dialog>

    <el-dialog title="资源路径"
               v-model="addResourcePathDialog"
               width="560px"
               :before-close="clearDialog"
               :append-to-body="true"
               :close-on-click-modal="false"
               center>
      <div class="dialog-form">
        <div class="form-row">
          <span class="form-label">标题：</span>
          <el-input maxlength="60" v-model="resourcePath.title" style="flex:1" />
        </div>
        <div class="form-row">
          <span class="form-label">分类：</span>
          <el-input :disabled="!['friendUrl', 'lovePhoto', 'funny', 'favorites'].includes(resourcePath.type)"
                    maxlength="30" v-model="resourcePath.classify" style="flex:1" />
        </div>
        <div class="form-row">
          <span class="form-label">简介：</span>
          <el-input :disabled="!['friendUrl', 'favorites'].includes(resourcePath.type)"
                    maxlength="1000" v-model="resourcePath.introduction" style="flex:1" />
        </div>
        <div class="form-row">
          <span class="form-label">封面：</span>
          <el-input v-model="resourcePath.cover" style="flex:1" />
          <el-button type="primary" size="small" @click="addResourcePathCover">上传</el-button>
        </div>
        <div class="form-row">
          <span class="form-label">链接：</span>
          <el-input :disabled="!['friendUrl', 'funny', 'favorites'].includes(resourcePath.type)"
                    v-model="resourcePath.url" style="flex:1" />
          <el-button type="primary" size="small" @click="addResourcePathUrl" :disabled="!['funny'].includes(resourcePath.type)">上传</el-button>
        </div>
        <div class="form-row">
          <span class="form-label">类型：</span>
          <el-select v-model="resourcePath.type" placeholder="资源路径类型" style="flex:1">
            <el-option v-for="(item, i) in resourceTypes" :key="i" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="form-row">
          <span class="form-label">备注：</span>
          <el-input :disabled="![].includes(resourcePath.type)"
                    maxlength="1000" v-model="resourcePath.remark" type="textarea" :rows="3" style="flex:1" />
        </div>
      </div>
      <template #footer>
        <el-button @click="clearDialog">取消</el-button>
        <el-button type="primary" @click="addResourcePath">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as resourceApi from '@/api/modules/resource';

// 响应式数据
const resourceTypes = ref([
  {label: "友链", value: "friendUrl"},
  {label: "恋爱图片", value: "lovePhoto"},
  {label: "音乐", value: "funny"},
  {label: "收藏夹", value: "favorites"}
]);

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  resourceType: "",
  status: null
});

const resourcePaths = ref([]);
const coverDialog = ref(false);
const uploadDialog = ref(false);
const addResourcePathDialog = ref(false);
const isUpdate = ref(false);
const resourcePath = reactive({
  title: "",
  classify: "",
  introduction: "",
  cover: "",
  url: "",
  type: "",
  remark: ""
});

// 方法实现
const addPicture = (res) => {
  resourcePath.cover = res;
  coverDialog.value = false;
};

const addFile = (res) => {
  resourcePath.url = res;
  uploadDialog.value = false;
};

const addResourcePathUrl = () => {
  if (addResourcePathDialog.value === false) {
    return;
  }
  if (!['funny'].includes(resourcePath.type)) {
    ElMessage({
      message: "请选择有效资源类型！",
      type: "error"
    });
    return;
  }
  uploadDialog.value = true;
};

const addResourcePathCover = () => {
  if (addResourcePathDialog.value === false) {
    return;
  }
  if (!resourcePath.type) {
    ElMessage({
      message: "请选择资源类型！",
      type: "error"
    });
    return;
  }
  coverDialog.value = true;
};

const addResourcePath = async () => {
  if (!resourcePath.title || !resourcePath.type) {
    ElMessage({
      message: "标题和资源类型不能为空！",
      type: "error"
    });
    return;
  }
  try {
    if (isUpdate.value) {
      await resourceApi.updateResourcePath(resourcePath);
    } else {
      await resourceApi.saveResourcePath(resourcePath);
    }
    ElMessage({
      message: "保存成功！",
      type: "success"
    });
    addResourcePathDialog.value = false;
    clearDialog();
    search();
  } catch (error) {
    ElMessage({
      message: error.message || '请求失败',
      type: "error"
    });
  }
};

const search = () => {
  pagination.total = 0;
  pagination.current = 1;
  getResourcePaths();
};

const getResourcePaths = async () => {
  try {
    const res = await resourceApi.listResourcePath(pagination);
    if (res && Object.keys(res).length > 0) {
      resourcePaths.value = res.list;
      pagination.total = res.total;
    }
  } catch (error) {
    ElMessage({
      message: error.message || '请求失败',
      type: "error"
    });
  }
};

const changeStatus = async (item) => {
  try {
    await resourceApi.updateResourcePath(item);
    ElMessage({
      message: "修改成功！",
      type: "success"
    });
  } catch (error) {
    ElMessage({
      message: error.message || '请求失败',
      type: "error"
    });
  }
};

const handlePageChange = (val) => {
  pagination.current = val;
  getResourcePaths();
};

const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm('确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    });
    
    await resourceApi.deleteResourcePath(item.id);
    search();
    ElMessage({
      message: "删除成功！",
      type: "success"
    });
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        message: error.message || '已取消删除',
        type: "info"
      });
    }
  }
};

const handleEdit = (item) => {
  Object.assign(resourcePath, JSON.parse(JSON.stringify(item)));
  addResourcePathDialog.value = true;
  isUpdate.value = true;
};

const clearDialog = () => {
  isUpdate.value = false;
  addResourcePathDialog.value = false;
  Object.assign(resourcePath, {
    title: "",
    classify: "",
    introduction: "",
    cover: "",
    url: "",
    type: "",
    remark: ""
  });
};

// 组件挂载时获取数据
onMounted(() => {
  getResourcePaths();
});
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
.toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.filter-select { width: 160px; }
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
.table-td-thumb {
  display: block; margin: auto;
  width: 36px; height: 36px;
  border-radius: 6px;
}
.el-switch { margin: 5px; }
.dialog-form { padding: 4px 0; }
.form-row {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 12px;
}
.form-label { font-size: 14px; color: #475569; white-space: nowrap; }
</style>
