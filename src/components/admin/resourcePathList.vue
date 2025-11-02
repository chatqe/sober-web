<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select clearable v-model="pagination.resourceType" placeholder="资源路径类型" class="handle-select mrb10">
          <el-option
            v-for="(item, i) in resourceTypes"
            :key="i"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select clearable v-model="pagination.status" placeholder="状态" class="handle-select mrb10">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" @click="addResourcePathDialog = true">新增资源路径</el-button>
      </div>
      <el-table :data="resourcePaths" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="center"></el-table-column>
        <el-table-column prop="classify" label="分类" align="center"></el-table-column>
        <el-table-column prop="introduction" label="简介" align="center"></el-table-column>
        <el-table-column label="封面" align="center">
          <template #default="scope">
            <el-image lazy :preview-src-list="[scope.row.cover]" class="table-td-thumb" :src="scope.row.cover"
                      fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接" align="center"></el-table-column>

        <el-table-column prop="type" label="资源类型" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'"
                    disable-transitions>
              {{ scope.row.status === false ? '禁用' : '启用' }}
            </el-tag>
            <el-switch @change="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                       @click="handleDelete(scope.row)">
              删除
            </el-button>
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

    <el-dialog title="图片"
               v-model="coverDialog"
               width="25%"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <uploadPicture :isAdmin="true" :prefix="resourcePath.type + 'Cover'" @addPicture="addPicture" :maxSize="2"
                       :maxNumber="1"></uploadPicture>
      </div>
    </el-dialog>

    <el-dialog title="文件"
               v-model="uploadDialog"
               width="25%"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <uploadPicture :isAdmin="true" :prefix="resourcePath.type + 'Url'" @addPicture="addFile" :maxSize="10"
                       :maxNumber="1" :listType="'text'" :accept="'image/*, video/*, audio/*'"></uploadPicture>
      </div>
    </el-dialog>

    <el-dialog title="资源路径"
               v-model="addResourcePathDialog"
               width="50%"
               :before-close="clearDialog"
               :append-to-body="true"
               :close-on-click-modal="false"
               center>
      <div>
        <div>
          <div style="margin-bottom: 5px">标题：</div>
          <el-input maxlength="60" v-model="resourcePath.title"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">分类：</div>
          <el-input :disabled="!['friendUrl', 'lovePhoto', 'funny', 'favorites'].includes(resourcePath.type)"
                    maxlength="30" v-model="resourcePath.classify"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">简介：</div>
          <el-input :disabled="!['friendUrl', 'favorites'].includes(resourcePath.type)"
                    maxlength="1000" v-model="resourcePath.introduction"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">封面：</div>
          <div style="display: flex">
            <el-input v-model="resourcePath.cover"></el-input>
            <div style="width: 66px;margin: 3.5px 0 0 10px">
              <proButton :info="'上传封面'"
                         @click="addResourcePathCover"
                         :before="$constant.before_color_1"
                         :after="$constant.after_color_1">
              </proButton>
            </div>
          </div>
          <div style="margin-top: 10px;margin-bottom: 5px">链接：</div>
          <div style="display: flex">
            <el-input :disabled="!['friendUrl', 'funny', 'favorites'].includes(resourcePath.type)"
                      v-model="resourcePath.url"></el-input>
            <div style="width: 66px;margin: 3.5px 0 0 10px">
              <proButton :info="'上传文件'"
                         @click="addResourcePathUrl"
                         :before="$constant.before_color_1"
                         :after="$constant.after_color_1">
              </proButton>
            </div>
          </div>
          <div style="margin-top: 10px;margin-bottom: 5px">资源类型：</div>
          <el-select v-model="resourcePath.type" placeholder="资源路径类型" class="handle-select mrb10">
            <el-option
              v-for="(item, i) in resourceTypes"
              :key="i"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div style="margin-top: 10px;margin-bottom: 5px">备注：</div>
          <el-input :disabled="![].includes(resourcePath.type)"
                    maxlength="1000" v-model="resourcePath.remark" type="textarea"></el-input>
        </div>
        <div style="display: flex;margin-top: 30px" class="myCenter">
          <proButton :info="'提交'"
                     @click="addResourcePath"
                     :before="$constant.before_color_2"
                     :after="$constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as resourceApi from '../../api/modules/resourceApi';

// 引入组件
const uploadPicture = () => import("../common/uploadPicture");
const proButton = () => import("../common/proButton");

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
    if (res.data && Object.keys(res.data).length > 0) {
      resourcePaths.value = res.data.records;
      pagination.total = res.data.total;
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
