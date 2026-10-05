<template>
  <div class="shadow-box background-opacity wow new-treehole-box "
       v-if="!$common.isEmpty(danmakuList)">
    <div style="font-weight: bold;margin-bottom: 20px">🧨最新树洞</div>
    <div class="seamless-scroll-container">
      <div class="seamless-scroll-content">
        <!--
          as any 类型断言：vue3-seamless-scroll@3.0.2 的类型声明将 props
          定义为 ComputedGetter<T>（函数），但实际运行时组件直接读值，
          并非调用函数。已尝试以下方案均失败：
          - .d.ts declare module 覆盖：被 skipLibCheck + bundler moduleResolution 忽略
          - @ts-expect-error 行内注释：Vue SFC 模板不允许 // 注释语法（Illegal '/' in tags）
          保留此断言直至库升级或找到可用的类型覆盖方式。
          见 TECH_DEBT.md → "Danmaku.vue vue3-seamless-scroll as any 断言"
        -->
        <Vue3SeamlessScroll
            class="scroll-wrap"
            :list="(danmakuList as any)"
            :wheel="(true as any)"
            :step="(1.5 as any)"
            :v-model="(true as any)"
            :hover="(true as any)">
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
    const res = await danmakuApi.latest()
    if (!$common.isEmpty(res)) {
      try {
        danmakuList.value = res
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
