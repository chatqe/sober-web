<template>
  <div >
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem :isHitokoto="false"></twoPoem>
    </div>

    <!--<div style="background: var(&#45;&#45;background);animation: hideToShow 2.5s" >-->
    <div  class="my-animation-slide-bottom">
      <div>
        <treeHole :treeHoleList="treeHoleList"
                  :avatar="!$common.isEmpty(userStore.currentUser)?userStore.currentUser.avatar:webInfoStore.webInfo?.avatar"
                  @launch="launch"
                  @deleteTreeHole="deleteTreeHole">
        </treeHole>
        <proPage :current="pagination.current"
                 :size="pagination.size"
                 :total="pagination.total"
                 :buttonSize="3"
                 :color="$constant.pageColor"
                 @toPage="toPage">
        </proPage>
      </div>

      <!-- 页脚 -->
      <myFooter :showFooter="showFooter"></myFooter>
    </div>

    <el-dialog title="微言"
               v-model="weiYanDialogVisible"
               width="40%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               :close-on-click-modal="false"
               center>
      <div>
        <div class="myCenter" style="padding-bottom: 20px">
          <el-radio-group v-model="isPublic">
            <el-radio-button :label="true">公开</el-radio-button>
            <el-radio-button :label="false">私密</el-radio-button>
          </el-radio-group>
        </div>
        <commentBox :disableGraffiti="true"
                    @submitComment="submitWeiYan">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted, nextTick, inject} from 'vue'
import {defineAsyncComponent} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useUserStore, useWebInfoStore} from '@/stores'
import router from '@/router'
import {weiYanApi} from '@/api/index.js'

// 组件动态导入
const twoPoem = defineAsyncComponent(() => import("./common/twoPoem.vue"))
const myFooter = defineAsyncComponent(() => import("./common/myFooter.vue"))
const treeHole = defineAsyncComponent(() => import("./common/treeHole.vue"))
const proPage = defineAsyncComponent(() => import("./common/proPage.vue"))
const commentBox = defineAsyncComponent(() => import("./comment/commentBox.vue"))

// 获取公共属性
const $common = inject('$common')
const $constant = inject('$constant')

// ... existing code ...

// 状态管理
const userStore = useUserStore()
const webInfoStore = useWebInfoStore()

// 响应式数据
const treeHoleList = ref([])
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})
const weiYanDialogVisible = ref(false)
const isPublic = ref(true)
const showFooter = ref(false)

// 方法
const toPage = (page) => {
  pagination.current = page
  window.scrollTo({
    top: 240,
    behavior: "smooth"
  })
  getWeiYan()
}

const launch = () => {
  if ($common.isEmpty(userStore.currentUser)) {
    ElMessage({
      message: "请先登录！",
      type: "error"
    })
    return
  }

  weiYanDialogVisible.value = true
}

const handleClose = () => {
  weiYanDialogVisible.value = false
}

const submitWeiYan = async (content) => {
  let weiYan = {
    content: content,
    isPublic: isPublic.value
  }

  try {
    await weiYanApi.saveWeiYan(weiYan)
    getWeiYan()
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
  handleClose()
}

const deleteTreeHole = async (id) => {
  if ($common.isEmpty(userStore.currentUser)) {
    ElMessage({
      message: "请先登录！",
      type: "error"
    })
    return
  }

  try {
    await ElMessageBox.confirm('确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    })

    await weiYanApi.deleteWeiYan(id)
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
    pagination.current = 1
    getWeiYan()
  } catch (error) {
    if (error.name !== 'CanceledError') {
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

const getWeiYan = async () => {
  try {
    const res = await weiYanApi.listWeiYan(pagination)
    showFooter.value = false
    if (!($common.isEmpty(res.data))) {
      res.data.records.forEach(c => {
        c.content = c.content.replace(/\n{2,}/g, '<div style="height: 12px"></div>')
        c.content = c.content.replace(/\n/g, '<br/>')
        c.content = $common.faceReg(c.content)
        c.content = $common.pictureReg(c.content)
      })
      treeHoleList.value = res.data.records
      pagination.total = res.data.total
    }
    nextTick(() => {
      showFooter.value = true
      $common.imgShow(".tree-hole-box .pictureReg")
    })
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 生命周期
onMounted(() => {
  getWeiYan()
})
</script>

<style scoped>
</style>
