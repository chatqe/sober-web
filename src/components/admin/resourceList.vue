<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select clearable v-model="pagination.resourceType" placeholder="资源类型" class="handle-select mrb10">
          <el-option key="21" label="Video.Article" value="video/article"></el-option>
          <el-option key="20" label="公共资源" value="assets"></el-option>
          <el-option key="10" label="表情包" value="internetMeme"></el-option>
          <el-option key="1" label="用户头像" value="userAvatar"></el-option>
          <el-option key="2" label="文章封面" value="articleCover"></el-option>
          <el-option key="3" label="文章图片" value="articlePicture"></el-option>
          <el-option key="5" label="网站头像" value="webAvatar"></el-option>
          <el-option key="4" label="背景图片" value="webBackgroundImage"></el-option>
          <el-option key="6" label="随机头像" value="randomAvatar"></el-option>
          <el-option key="7" label="随机封面" value="randomCover"></el-option>
          <el-option key="8" label="画笔图片" value="graffiti"></el-option>
          <el-option key="9" label="评论图片" value="commentPicture"></el-option>
          <el-option key="11" label="聊天群头像" value="im/groupAvatar"></el-option>
          <el-option key="12" label="群聊天图片" value="im/groupMessage"></el-option>
          <el-option key="13" label="朋友聊天图片" value="im/friendMessage"></el-option>
          <el-option key="14" label="音乐声音" value="funnyUrl"></el-option>
          <el-option key="15" label="音乐封面" value="funnyCover"></el-option>
          <el-option key="16" label="Love.Cover" value="love/bgCover"></el-option>
          <el-option key="17" label="Love.Man" value="love/manCover"></el-option>
          <el-option key="18" label="Love.Woman" value="love/womanCover"></el-option>
          <el-option key="19" label="收藏夹封面" value="favoritesCover"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button type="primary" @click="addResources()">新增资源</el-button>
      </div>
      <el-table :data="resources" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="originalName" label="名称" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="type" label="资源类型" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'"
                    disable-transitions>
              {{scope.row.status === false ? '禁用' : '启用'}}
            </el-tag>
            <el-switch @click="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="路径" align="center">
          <template #default="scope">
            <template v-if="!isEmpty(scope.row.mimeType) && scope.row.mimeType.includes('image')">
              <el-image lazy :preview-src-list="[scope.row.path]" class="table-td-thumb" :src="scope.row.path"
                        fit="cover"></el-image>
            </template>
            <template v-else>
              {{scope.row.path}}
            </template>
          </template>
        </el-table-column>

        <el-table-column label="大小(KB)" align="center">
          <template #default="scope">
            {{Math.round(scope.row.size / 1024)}}
          </template>
        </el-table-column>
        <el-table-column prop="mimeType" label="类型" align="center"></el-table-column>
        <el-table-column prop="storeType" label="存储平台" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
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

    <el-dialog title="文件"
               v-model="resourceDialog"
               width="25%"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <div style="display: flex;margin-bottom: 10px">
          <div style="line-height: 40px">存储平台：</div>
          <el-select v-model="storeType" placeholder="存储平台" style="width: 120px">
            <el-option
              v-for="(item, i) in storeTypes"
              :key="i"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <uploadPicture :isAdmin="true" :prefix="pagination.resourceType" @addPicture="addFile"
                       :storeType="storeType"
                       :listType="'text'" :accept="'image/*, video/*, audio/*'"
                       :maxSize="100" :maxNumber="10"></uploadPicture>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject } from 'vue';
import type { Ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import uploadPicture from '../common/uploadPicture.vue';
import { resourceApi } from '@/api/index.js';

// 定义接口
interface Resource {
  id: number;
  originalName: string;
  userId: number;
  type: string;
  status: boolean;
  path: string;
  mimeType: string;
  size: number;
  storeType: string;
  createTime: string;
  [key: string]: any;
}

interface Pagination {
  current: number;
  size: number;
  total: number;
  resourceType: string;
}

interface StoreType {
  label: string;
  value: string;
}

interface ResourceDeleteRequest {
  path: string;
}

interface ResourceStatusRequest {
  id: number;
  flag: boolean;
}

// 从全局注入获取公共工具函数
interface CommonUtils {
  isEmpty: (obj: any) => boolean;
}

const $common = inject<CommonUtils>('$common')!

// 响应式数据
const resources: Ref<Resource[]> = ref([]);
const resourceDialog: Ref<boolean> = ref(false);
const storeType: Ref<string | null> = ref(localStorage.getItem("defaultStoreType"));
const pagination: Pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  resourceType: ""
});

const storeTypes: StoreType[] = [
  {label: "服务器", value: "local"},
  {label: "七牛云", value: "qiniu"}
];

// 获取资源列表
const getResources = async (): Promise<void> => {
  try {
    const res = await resourceApi.listResource(pagination);
    if (!res.data) {
      ElMessage({
        message: '获取数据失败',
        type: "error"
      });
      return;
    }
    if (!($common.isEmpty(res.data))) {
      resources.value = res.data.records;
      pagination.total = res.data.total;
    }
  } catch (error: any) {
    ElMessage({
      message: error.message || '请求失败',
      type: "error"
    });
  }
};

// 删除资源
const handleDelete = async (item: Resource): Promise<void> => {
  try {
    await ElMessageBox.confirm('确认删除资源？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    });
    
    const deleteRequest: ResourceDeleteRequest = {path: item.path};
    await resourceApi.deleteResource(deleteRequest);
    pagination.current = 1;
    await getResources();
    ElMessage({
      message: "删除成功！",
      type: "success"
    });
  } catch (error: any) {
    if (error === 'cancel') {
      ElMessage({
        type: 'info',
        message: '已取消删除!'
      });
    } else {
      ElMessage({
        message: error.message || '请求失败',
        type: "error"
      });
    }
  }
};

// 更改资源状态
const changeStatus = async (item: Resource): Promise<void> => {
  try {
    const statusRequest: ResourceStatusRequest = {id: item.id, flag: item.status};
    await resourceApi.changeResourceStatus(statusRequest);
    ElMessage({
      message: "修改成功！",
      type: "success"
    });
  } catch (error: any) {
    ElMessage({
      message: error.message || '请求失败',
      type: "error"
    });
  }
};

// 添加文件
const addFile = (res: any): void => {
  // 保持空实现，与原代码一致
};

// 新增资源
const addResources = (): void => {
  if ($common.isEmpty(pagination.resourceType)) {
    ElMessage({
      message: "请选择资源类型！",
      type: "error"
    });
    return;
  }
  resourceDialog.value = true;
};

// 搜索
const search = (): void => {
  pagination.total = 0;
  pagination.current = 1;
  getResources();
};

// 分页变化
const handlePageChange = (val: number): void => {
  pagination.current = val;
  getResources();
};

// 组件挂载时获取数据
onMounted((): void => {
  getResources();
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
