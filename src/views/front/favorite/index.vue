<template>
  <div>
    <div class="favorite-container">
      <!-- 封面 -->
      <div class="favorite-header my-animation-slide-top">
        <video class="index-video" autoplay muted loop
               :src="$constant.favoriteVideo">
        </video>
        <div style="position: absolute;left: 0;top: 0;padding: 5px 20px">
          <!-- 标题 -->
          <div style="color: var(--white);margin: 0 10px">
            <div style="line-height: 2 ;margin-top: 12px">
              {{ favVideoInfo.title }}
            </div>
            <div style="font-size: 22px;font-weight: bold;line-height: 2;margin-top: 15px">
              {{ favVideoInfo.desc }}
            </div>
          </div>
        </div>
      </div>

      <!-- 内容 -->
      <div class="favorite-content">
        <router-view/>
      </div>
    </div>
  </div>
  <!-- 页脚 -->
  <!--<div style="background: var(&#45;&#45;background)" >-->
  <!--<div>-->
  <!--  <MyFooter/>-->
  <!--</div>-->
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import {ElMessage} from 'element-plus'
import {webInfoApi} from '@/api/index.js';
import myFooter from '../../../components/business/MyFooter.vue'
import type { CommonUtils, AppConstants } from '@/types'

// 获取注入的全局属性
const $common: CommonUtils = inject('$common')!
const $constant: AppConstants = inject('$constant')!

// 定义数据类型
interface FavVideoInfo {
  title: string
  desc: string
}

interface CollectItem {
  url: string
  cover: string
  title: string
  introduction: string
}

interface CollectData {
  [key: string]: CollectItem[]
}

// 响应式数据
const card: Ref<number | null> = ref(null)
const favVideoInfo: Ref<FavVideoInfo> = ref({
  title: "百宝箱",
  desc: "留下你的网站吧,嘻嘻嘻",
})
const collects: Ref<CollectData> = ref({})

// 生命周期钩子
onMounted(() => {
  card.value = 3
})

// 方法
defineExpose({
  toUrl,
  changeFavorite,
  getCollect
})

function toUrl(url: string): void {
  window.open(url)
}

function changeFavorite(newCard: number): void {
  if (newCard === 1) {
    if ($common.isEmpty(collects.value)) {
      getCollect()
    }
  }
  card.value = newCard
}

async function getCollect(): Promise<void> {
  try {
    const res = await webInfoApi.listCollect()
    if (!res || !Array.isArray(res)) return
    const data = res as any
    const collectsData: CollectData = {}
    if (data.recordList && Array.isArray(data.recordList)) {
      data.recordList.forEach((item: any) => {
        if (!collectsData[item.classify]) {
          collectsData[item.classify] = []
        }
        collectsData[item.classify].push(item)
      })
    }
    collects.value = collectsData
  } catch (error: any) {
    ElMessage.error(error.message || '获取收藏失败')
  }
}
</script>

<style scoped>

.favorite-container {
  padding: 25px;
 /* background: var(--favoriteBg);*/
}

.favorite-header {
  margin: 60px auto 30px;
  height: 120px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  max-width: 1200px;
}

.index-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-image::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--translucent);
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 60px;
}

.card-item {
  transition: all 0.3s;
  position: relative;
  width: 250px;
  height: 120px;
  border-radius: 20px;
  animation: hideToShow 1s ease-in-out;
  cursor: pointer;
  overflow: hidden;
  margin: 10px;
  color: var(--white);
}

.card-item:hover {
  transform: translateY(-6px);
}

.card-name {
  font-weight: bold;
  font-size: 25px;
}

.card-name:after {
  top: 50px;
  width: 22px;
  left: 26px;
  height: 2px;
  background: var(--white);
  content: "";
  border-radius: 1px;
  position: absolute;
}

.card-desc {
  font-weight: bold;
  margin-top: 15px;
}

.favorite-content {
  margin: 0 auto;
  max-width: 1200px;
}

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

@media screen and (max-width: 906px) {
  .card-container {
    margin-top: 0;
  }
}

@media screen and (max-width: 906px) {
  .favorite-item {
    width: calc(100% / 3 - 20px);
  }

  .favorite-header {
    height: 360px;
  }
}

@media screen and (max-width: 636px) {
  .favorite-item {
    width: calc(100% / 2 - 20px);
  }

  .favorite-header {
    height: 500px;
  }
}

@media screen and (max-width: 400px) {
  .favorite-item {
    width: calc(100% - 20px);
  }
}
</style>