<script setup lang="ts">
import { defineAsyncComponent, inject, ref } from 'vue'
import type { Ref } from 'vue'
import {ElMessage} from 'element-plus'
import {webInfoApi} from '@/api/index.js';
import type { CommonUtils, AppConstants } from '@/types'

const emptyState = defineAsyncComponent(() => import("./common/emptyState.vue"))

// 获取注入的全局属性
const $common: CommonUtils = inject('$common')!
const $constant: AppConstants = inject('$constant')!

// 定义收藏项类型
interface CollectItem {
  url: string
  cover: string
  title: string
  introduction: string
}

// 定义收藏数据类型
interface CollectData {
  [key: string]: CollectItem[]
}

// 响应式数据
const collects: Ref<CollectData> = ref({})

// 方法
defineExpose({
  toUrl,
  getCollect
})

function toUrl(url: string): void {
  window.open(url)
}

// function changeFavorite(newCard) {
//   if (newCard === 1) {
//     if ($common.isEmpty(collects.value)) {
//       getCollect()
//     }
//   }
//   card.value = newCard
// }

async function getCollect(): Promise<void> {
  try {
    const res = await webInfoApi.listCollect()
    if (!res.data) return
    if ($common.isEmpty(res.data)) return
    if (typeof res.data !== 'object') return
    collects.value = res.data as CollectData
  } catch (error: any) {
    ElMessage.error(error.message || '获取收藏失败')
  }
}
</script>

<template>

  <!-- 收藏夹 -->
  <div v-if="!$common.isEmpty(collects)" class="my-animation-hideToShow">
    <div v-for="(value, key) in collects" :key="key" style="margin-top: 20px">
      <div class="collect-classify">
        {{key}}
      </div>
      <div class="favorite-item-wrap">
        <div v-for="(item, index) in value" :key="index" @click="toUrl(item.url)" class="favorite-item">
          <div>
            <el-avatar class="favorite-item-image" :size="60"
                       :src="item.cover">
            </el-avatar>
          </div>
          <div style="width: calc(100% - 80px)">
            <div class="favorite-item-title">
              {{item.title}}
            </div>
            <div class="favorite-item-introduction">
              {{item.introduction}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <emptyState v-else></emptyState>
</template>

<style scoped>
.collect-classify {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.favorite-item-wrap {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
}

.favorite-item {
  transition: all 0.3s;
  border-radius: 12px;
  box-shadow: 0 8px 16px -4px #2c2d300c;
  background: var(--background);
  display: flex;
  width: calc(100% / 4 - 20px);
  max-width: 320px;
  height: 90px;
  overflow: hidden;
  padding: 15px;
  cursor: pointer;
  margin: 10px;
}

.favorite-item:hover {
  background: #425AEF;
  color: var(--white);
}

.favorite-item:hover .favorite-item-image {
  transition: all 0.6s;
  width: 0 !important;
  height: 0 !important;
  opacity: 0;
  margin-right: 0;
}

.favorite-item:hover div:nth-child(2) {
  width: 100% !important;
}

.favorite-item-image {
  margin-right: 20px;
  transition: all 0.3s;
}

.favorite-item-title {
  font-size: 19px;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
}

.favorite-item-introduction {
  opacity: 0.7;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 14px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>