<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><ChatDotRound /></el-icon>
        <span>评论管理</span>
      </div>
      <div class="toolbar">
        <el-select v-if="isAdmin" v-model="pagination.commentType" placeholder="评论类型" class="filter-select">
          <el-option label="文章评论" value="article"/>
          <el-option label="树洞留言" value="message"/>
        </el-select>
        <el-input v-model="pagination.source" type="number" placeholder="来源标识" class="filter-input" clearable />
        <el-button type="primary" @click="searchComments()">搜索</el-button>
        <el-button @click="clearSearch()">清除</el-button>
      </div>
      <el-table :data="comments" border class="table" stripe header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="source" label="来源标识" align="center" width="120" />
        <el-table-column prop="type" label="来源类型" align="center" width="120" />
        <el-table-column prop="userId" label="用户ID" align="center" width="100" />
        <el-table-column prop="likeCount" label="点赞数" align="center" width="80" />
        <el-table-column prop="commentContent" label="评论内容" align="center" show-overflow-tooltip />
        <el-table-column prop="commentInfo" label="额外信息" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" align="center" width="155" />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next"
          :current-page="pagination.current" :page-size="pagination.size"
          :total="pagination.total" @current-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, computed } from 'vue'
import type { Ref } from 'vue'
import {useAuthStore, useUserStore} from '@/stores'
import { ChatDotRound } from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {commentApi} from "@/api/index.js";

// 定义接口
interface Comment {
  id: number;
  source: number;
  type: string;
  userId: number;
  likeCount: number;
  commentContent: string;
  commentInfo: string;
  createTime: string;
  [key: string]: any;
}

interface Pagination {
  current: number;
  size: number;
  total: number;
  source: number | null;
  commentType: string;
}

interface CommentDeleteRequest {
  id: number;
}

// 从全局注入获取公共工具函数
interface CommonUtils {
  isEmpty: (obj: any) => boolean;
}

const $common = inject<CommonUtils>('$common')!
const authStore = useAuthStore()
const userStore = useUserStore();

// 响应式数据
const isAdmin: Ref<boolean> = ref(authStore.isAdmin || userStore.currentAdmin?.isAdmin || false);
const pagination: Ref<Pagination> = ref({
  current: 1,
  size: 10,
  total: 0,
  source: null,
  commentType: ""
});
const comments: Ref<Comment[]> = ref([]);

// 生命周期钩子
onMounted((): void => {
  getComments();
});

// 方法
const clearSearch = (): void => {
  pagination.value = {
    current: 1,
    size: 10,
    total: 0,
    source: null,
    commentType: ""
  };
  getComments();
};

/**
 * 获取评论列表
 */
const getComments = async (): Promise<void> => {
  try {
    let res: any = {};
    if (isAdmin.value) {
      res = await commentApi.bossCommentList(pagination.value);
    } else {
      res = await commentApi.userCommentList(pagination.value);
    }

    if (!($common.isEmpty(res))) {
      comments.value = res.records;
      pagination.value.total = res.total;
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取评论列表失败');
  }
};

const handlePageChange = (val: number): void => {
  pagination.value.current = val;
  getComments();
};

const searchComments = (): void => {
  pagination.value.total = 0;
  pagination.value.current = 1;
  getComments();
};

const handleDelete = async (item: Comment): Promise<void> => {
  try {
    await ElMessageBox.confirm(
      '删除评论后，所有该评论的回复均不可见。确认删除？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }
    );
    // 发送请求
    const deleteRequest: CommentDeleteRequest = {id: item.id};
    if (isAdmin.value) {
      await commentApi.delAdminComment(deleteRequest);
    } else {
      await commentApi.delUserComment(deleteRequest);
    }
    ElMessage({
      message: "删除成功！",
      type: "success"
    });
    // 重新获取评论列表
    getComments();
  } catch (error: any) {
    if (error === 'cancel') {
      ElMessage({
        type: 'warning',
        message: '已取消删除!'
      });
    } else {
      ElMessage.error(error.message || '删除失败');
    }
  }
};
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
.toolbar {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px; flex-wrap: wrap;
}
.filter-select { width: 130px; }
.filter-input { width: 160px; }
.table { width: 100%; font-size: 13.5px; }
.pagination { margin-top: 16px; text-align: right; }
:deep(.el-input__inner)::-webkit-inner-spin-button { appearance: none; }
</style>
