<template>
  <div>
    <!-- 评论框 -->
    <div style="margin-bottom: 40px">
      <div class="comment-head">
        <el-icon style="font-weight: bold;font-size: 22px;"><Edit /></el-icon> 留言
      </div>
      <div>
        <!-- 文字评论 -->
        <div v-show="!isGraffiti">
          <commentBox @showGraffiti="isGraffiti = !isGraffiti"
                      @submitComment="submitComment">
          </commentBox>
        </div>
        <!-- 画笔 -->
<!--        <div v-show="isGraffiti">-->
<!--          <graffiti @showComment="isGraffiti = !isGraffiti"-->
<!--                    @addGraffitiComment="addGraffitiComment">-->
<!--          </graffiti>-->
<!--        </div>-->
      </div>
    </div>

    <!-- 评论内容 -->
    <div v-if="comments.length > 0">
      <!-- 评论数量 -->
      <div class="commentInfo-title">
        <span style="font-size: 1.15rem">Comments | </span>
        <span>{{ total }} 条留言</span>
      </div>
      <!-- 评论详情 -->
      <div ref="commentContentRef" class="commentInfo-detail"
           v-for="(item, index) in comments"
           :key="index">
        <!-- 头像 -->
        <el-avatar shape="square" class="commentInfo-avatar" :size="35" :src="item.avatar"></el-avatar>

        <div style="flex: 1;padding-left: 12px">
          <!-- 评论信息 -->
          <div style="display: flex;justify-content: space-between">
            <div>
              <span class="commentInfo-username">{{ item.username }}</span>
              <span class="commentInfo-master" v-if="item.authorId === currentUserId">主人翁</span>
              <span class="commentInfo-other">{{ $common.getDateDiff(item.createTime) }}</span>
            </div>
            <div class="commentInfo-reply" @click="replyDialog(item, item)">
              <span v-if="item.childComments && item.childComments.total > 0">{{item.childComments.total}} </span><span>回复</span>
            </div>
          </div>
          <!-- 评论内容 -->
          <div class="commentInfo-content">
            <span v-html="item.content"></span>
          </div>
          <!-- 回复模块 -->
          <div v-if="!$common.isEmpty(item.childComments) && !$common.isEmpty(item.childComments.records)">
            <div class="commentInfo-detail" v-for="(childItem, i) in item.childComments.records" :key="i">
              <!-- 头像 -->
              <el-avatar shape="square" class="commentInfo-avatar" :size="30" :src="childItem.avatar"></el-avatar>

              <div style="flex: 1;padding-left: 12px">
                <!-- 评论信息 -->
                <div style="display: flex;justify-content: space-between">
                  <div>
                    <span class="commentInfo-username-small">{{ childItem.username }}</span>
                    <span class="commentInfo-master" v-if="childItem.authorId === currentUserId">主人翁</span>
                    <span class="commentInfo-other">{{ $common.getDateDiff(childItem.createTime) }}</span>
                  </div>
                  <div>
                    <span class="commentInfo-reply" @click="replyDialog(childItem, item)">回复</span>
                  </div>
                </div>
                <!-- 评论内容 -->
                <div class="commentInfo-content">
                  <template v-if="childItem.parentUsername && childItem.parentId !== item.id">
                    <span style="color: var(--blue)">@{{ childItem.parentUsername }} </span>:
                  </template>
                  <span v-html="childItem.content"></span>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div class="pagination-wrap" v-if="item.childComments.records.length < item.childComments.total">
              <div class="pagination"
                   @click="toChildPage(item)">
                展开
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <proPage :current="pagination.current"
               :size="pagination.size"
               :total="pagination.total"
               :buttonSize="6"
               :color="$constant.commentPageColor"
               @toPage="toPage">
      </proPage>
    </div>

    <div v-else class="myCenter" style="color: var(--greyFont)">
      <i>来发第一个留言啦~</i>
    </div>

    <el-dialog title="留言"
               v-model="replyDialogVisible"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <commentBox :disableGraffiti="true"
                    @submitComment="submitReply">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, inject } from 'vue'
import { ElMessage, ElIcon } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { commentApi } from '@/api/index.js'
import commentBox from './commentBox.vue'
import proPage from '../common/proPage.vue'

// 导入类型
import type { CommonUtils, AppConstants, Comment } from '@/types'
import type { CommentListParams, CommentSaveParams } from '@/api/types/comment'

// 注入全局属性
const $common = inject<CommonUtils>('$common')!
const $constant = inject<AppConstants>('$constant')!

// Props定义
const props = defineProps<{
  /** 业务主键ID（文章ID/树洞ID等），路由/接口可能返回字符串，内部统一转数字 */
  source: number | string
  /** 业务类型字符串：article-文章 message-树洞 love-表白墙 */
  type: string
  /** 文章/内容作者ID，用于展示"主人翁"标识 */
  userId: number | string
}>()

/**
 * 业务类型字符串 -> 后端 bizType 编码
 * 后端 CommentTypeEnum：1-文章 2-树洞留言 3-表白墙留言
 */
const BIZ_TYPE_MAP: Record<string, number> = {
  article: 1,
  message: 2,
  love: 3
}

// 统一规范化的业务参数
const bizId = computed(() => Number(props.source))
const currentUserId = computed(() => Number(props.userId))
const bizType = computed(() => BIZ_TYPE_MAP[props.type] ?? 1)
// 后端 commentType 接受数字字符串（如 "1"）
const bizTypeStr = computed(() => String(bizType.value))

// 响应式数据
const isGraffiti = ref(false)
const total = ref<number>(0)
const replyDialogVisible = ref(false)
const floorComment = reactive<Comment>({})
const replyComment = reactive<Comment>({})
const comments = ref<Comment[]>([])
const commentContentRef = ref<HTMLElement | null>(null)

// 分页类型定义（字段与后端 BaseReqVO 对齐）
interface Pagination {
  current: number
  size: number
  total: number
  bizId: number
  commentType: string
  rootId: number | null
}

const pagination = reactive<Pagination>({
  current: 1,
  size: 10,
  total: 0,
  bizId: bizId.value,
  commentType: bizTypeStr.value,
  rootId: null
})

// 方法
defineExpose({
  toPage,
  getTotal,
  toChildPage,
  emoji,
  getComments,
  addGraffitiComment,
  submitComment,
  submitReply,
  replyDialog,
  handleClose
})

function toPage(page: number): void {
  pagination.current = page
  window.scrollTo({
    top: commentContentRef.value?.offsetTop || 0
  })
  getComments(pagination)
}

function getTotal(): void {
  commentApi.getCommentTotal({ bizId: bizId.value, type: bizTypeStr.value })
    .then((res) => {
      if (res === null || res === undefined) return
      total.value = res
    })
    .catch((error: any) => {
      ElMessage.error(error.message || '获取评论数量失败')
    })
}

function toChildPage(comment: Comment): void {
  if (!comment.childComments) comment.childComments = { current: 0, records: [], total: 0 }
  if (!comment.childComments.current) comment.childComments.current = 0
  comment.childComments.current += 1
  const pageData: Pagination = {
    current: comment.childComments.current,
    size: 5,
    total: 0,
    bizId: bizId.value,
    commentType: bizTypeStr.value,
    rootId: comment.id ?? null
  }
  getComments(pageData, comment, true)
}

function emoji(commentsList: Comment[], flag: boolean): void {
  commentsList.forEach(c => {
    if (c.content === undefined || c.content === null) return
    c.content = c.content.replace(/\n/g, '<br/>')
    c.content = $common.faceReg(c.content)
    c.content = $common.pictureReg(c.content)
    if (flag) {
      if (!c.childComments || !c.childComments.records) return
      if ($common.isEmpty(c.childComments) || $common.isEmpty(c.childComments.records)) return
      c.childComments.records.forEach(cc => {
        if (cc.content === undefined || cc.content === null) return
        // 子评论内容同样处理表情与图片
        cc.content = cc.content.replace(/\n/g, '<br/>')
        cc.content = $common.faceReg(cc.content)
        cc.content = $common.pictureReg(cc.content)
      })
    }
  })
}

function getComments(pageData: Pagination, comment: Comment = {}, isToPage: boolean = false): void {
  // 构造后端 BaseReqVO 请求参数：bizId + commentType(数字字符串) + rootId(查子评论时传)
  const payload: CommentListParams = {
    current: pageData.current,
    size: pageData.size,
    bizId: bizId.value,
    commentType: bizTypeStr.value
  }
  if (pageData.rootId !== null && pageData.rootId !== undefined) {
    payload.rootId = pageData.rootId
  }

  commentApi.listComment(payload)
    .then((res) => {
      // res 为裸分页数据：{ records, total, current, size }
      if (!res || $common.isEmpty(res) || $common.isEmpty(res.records)) return

      if ($common.isEmpty(comment)) {
        comments.value = res.records as Comment[]
        pageData.total = res.total
        emoji(comments.value, true)
      } else {
        if (isToPage === false) {
          comment.childComments = res
        } else {
          if (!comment.childComments) comment.childComments = { records: [], total: 0 }
          comment.childComments.total = res.total
          if (!comment.childComments.records) comment.childComments.records = []
          comment.childComments.records = comment.childComments.records.concat(res.records as Comment[])
          emoji(comment.childComments.records, false)
        }
      }

      nextTick(() => {
        $common.imgShow("#comment-content .pictureReg")
      })
    })
    .catch((error: any) => {
      ElMessage.error(error.message || '获取评论失败')
    })
}

function addGraffitiComment(graffitiComment: string): void {
  submitComment(graffitiComment)
}

function submitComment(commentContent: string): void {
  // 根评论：parentId/rootId 均为 0
  const payload: CommentSaveParams = {
    bizId: bizId.value,
    bizType: bizType.value,
    content: commentContent,
    parentId: 0,
    rootId: 0
  }

  commentApi.saveComment(payload)
    .then(() => {
      ElMessage.success('保存成功！')
      Object.assign(pagination, {
        current: 1,
        size: 10,
        total: 0,
        bizId: bizId.value,
        commentType: bizTypeStr.value,
        rootId: null
      })
      getComments(pagination)
      getTotal()
    })
    .catch((error: any) => {
      ElMessage.error(error.message || '保存评论失败')
    })
}

function submitReply(commentContent: string): void {
  // 回复：parentId 为直接父评论ID，rootId 为根评论（楼层）ID，replyToUserId 为被回复用户ID
  const payload: CommentSaveParams = {
    bizId: bizId.value,
    bizType: bizType.value,
    content: commentContent,
    parentId: replyComment.id ?? 0,
    rootId: floorComment.id ?? 0,
    replyToUserId: replyComment.authorId
  }

  const currentFloorComment = { ...floorComment }

  commentApi.saveComment(payload)
    .then(() => {
      const pageData: Pagination = {
        current: 1,
        size: 5,
        total: 0,
        bizId: bizId.value,
        commentType: bizTypeStr.value,
        rootId: currentFloorComment.id ?? null
      }
      getComments(pageData, currentFloorComment)
      getTotal()
    })
    .catch((error: any) => {
      ElMessage.error(error.message || '保存回复失败')
    })
  handleClose()
}

function replyDialog(comment: Comment, floorCommentData: Comment): void {
  Object.assign(replyComment, comment)
  Object.assign(floorComment, floorCommentData)
  replyDialogVisible.value = true
}

function handleClose(): void {
  replyDialogVisible.value = false
  Object.keys(floorComment).forEach(key => delete floorComment[key])
  Object.keys(replyComment).forEach(key => delete replyComment[key])
}

// 生命周期钩子
onMounted(() => {
  getComments(pagination)
  getTotal()
})
</script>

<style scoped>

  .comment-head {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px 0;
    user-select: none;
    color: var(--themeBackground);
  }

  .commentInfo-title {
    margin-bottom: 20px;
    color: var(--greyFont);
    user-select: none;
  }

  .commentInfo-detail {
    display: flex;
  }

  .commentInfo-avatar {
    border-radius: 5px;
  }

  .commentInfo-username {
    color: var(--orangeRed);
    font-size: 16px;
    font-weight: 600;
    margin-right: 5px;
  }

  .commentInfo-username-small {
    color: var(--orangeRed);
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
  }

  .commentInfo-master {
    color: var(--green);
    border: 1px solid var(--green);
    border-radius: 0.2rem;
    font-size: 12px;
    padding: 2px 4px;
    margin-right: 5px;
  }

  .commentInfo-other {
    font-size: 12px;
    color: var(--greyFont);
    user-select: none;
  }

  .commentInfo-reply {
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    color: var(--white);
    background: var(--themeBackground);
    border-radius: 0.2rem;
    padding: 3px 6px;
  }

  .commentInfo-content {
    margin: 15px 0 25px;
    padding: 18px 20px;
    background: var(--commentContent);
    border-radius: 12px;
    color: var(--black);
    word-break: break-word;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .pagination {
    padding: 6px 20px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    user-select: none;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
  }

  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }
</style>
