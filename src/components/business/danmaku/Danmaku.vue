<template>
  <div class="shadow-box background-opacity wow new-treehole-box "
       v-if="!$common.isEmpty(danmakuList)">
    <div style="font-weight: bold;margin-bottom: 20px">🧨最新树洞</div>
    <div class="seamless-scroll-container">
      <div class="seamless-scroll-content">
        <Vue3SeamlessScroll
            class="scroll-wrap"
            :list="danmakuList"
            :wheel="true"
            :step="1.5"
            :v-model="true"
            :hover="true">
          <ul class="ui-wrap">
            <li v-for="(item, i) in danmakuList" :key="i" class="li-item">
              <div style="display: flex">
                <el-avatar style="margin-bottom: 10px" :size="36" :src="item.avatar"></el-avatar>
                <div style="margin-left: 10px;height: 36px;line-height: 36px;overflow: hidden;max-width: 80px">
                  {{ item.message }}
                </div>
              </div>
            </li>
          </ul>
        </Vue3SeamlessScroll>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {inject, onMounted, ref} from 'vue'
import type {Ref} from 'vue'
import {ElMessage} from 'element-plus'
import {Vue3SeamlessScroll} from "vue3-seamless-scroll";
import {danmakuApi} from '@/api/modules'

interface CommonUtils {
  isEmpty: (value: any) => boolean

  [key: string]: any
}

const $common = inject<CommonUtils>('$common')!

interface ApiResponse {
  data: any

  [key: string]: any
}

const danmakuList: Ref<any[]> = ref([])

const getDanmaku = async (): Promise<void> => {
  try {
    const res: ApiResponse = await danmakuApi.latest()
    if (!$common.isEmpty(res.data)) {
      try {
        danmakuList.value = res.data
      } catch (error: any) {
        ElMessage({
          message: error.message,
          type: "error"
        })
      }
    }
  } catch (error: any) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

onMounted(() => {
  getDanmaku()
})
</script>

<style scoped>

.scroll-wrap {
  height: 300px;
  overflow: hidden;
}

/*重置ul浏览器默认样式*/
.ui-wrap {
  list-style: none;
  padding: 0;
  margin: 0 auto;
}

.li-item {
  display: flex;
  justify-content: space-between;
}

.new-treehole-box {
  background: var(--springBg) center center / cover no-repeat;
  padding: 25px;
  border-radius: 10px;
  animation: hideToShow 1s ease-in-out;
  margin-top: 30px;
}

/* 无缝滚动容器样式 */
.seamless-scroll-container {
  height: 300px;
  overflow: hidden;
  position: relative;
}

.seamless-scroll-content {
  will-change: transform;
  transition: none;
}
</style>
