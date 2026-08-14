<template>
  <div class="comment-list-container">
    <div class="search-bar">
      <el-select v-if="isBoss" v-model="pagination.commentType" placeholder="评论来源类型" class="select-item">
        <el-option label="文章评论" value="article"/>
        <el-option label="树洞留言" value="message"/>
      </el-select>
      <el-input
          v-model="pagination.source"
          type="number"
          placeholder="评论来源标识"
          class="input-item"
          clearable
      />
      <el-button type="primary" @click="searchComments">
        <template #icon>
          <el-icon>
            <Search/>
          </el-icon>
        </template>
        搜索
      </el-button>
      <el-button type="danger" @click="clearSearch">
        清除参数
      </el-button>
    </div>

    <el-table
        :data="comments"
        border
        class="table"
        header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="ID" width="55" align="center"/>
      <el-table-column prop="source" label="评论来源标识" align="center"/>
      <el-table-column prop="type" label="评论来源类型" align="center"/>
      <el-table-column prop="userId" label="发表用户ID" align="center"/>
      <el-table-column prop="likeCount" label="点赞数" align="center"/>
      <el-table-column prop="commentContent" label="评论内容" align="center"/>
      <el-table-column prop="commentInfo" label="评论额外信息" align="center"/>
      <el-table-column prop="createTime" label="创建时间" align="center"/>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button
              type="primary"
              link
              @click="handleDelete(scope.row)"
          >
            <template #icon>
              <el-icon>
                <Delete/>
              </el-icon>
            </template>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="pagination.current"
          :page-size="pagination.size"
          :total="pagination.total"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import type { Ref } from 'vue';
import {useUserStore} from '@/stores';
import {Delete, Search} from '@element-plus/icons-vue';
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
const userStore = useUserStore();

// 响应式数据
const isBoss: Ref<boolean> = ref(userStore.currentAdmin.isBoss);
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
    let res = {};
    if (isBoss.value) {
      res = await commentApi.bossCommentList(pagination.value);
    } else {
      res = await commentApi.userCommentList(pagination.value);
    }

    if (!($common.isEmpty(res.data))) {
      comments.value = res.data.records;
      pagination.value.total = res.data.total;
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
    if (isBoss.value) {
      await commentApi.delAdminComment(deleteRequest, true);
    } else {
      await commentApi.delUserComment(deleteRequest, true);
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
.comment-list-container {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.select-item {
  width: 150px;
}

.input-item {
  width: 200px;
}

.pagination {
  margin: 20px 0;
  text-align: right;
}

/* Element Plus 样式覆盖 */
:deep(.el-input__inner)::-webkit-inner-spin-button {
  appearance: none;
}

.table {
  width: 100%;
}
</style>
