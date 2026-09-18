<template>
  <div v-if="!$common.isEmpty(danmakuList)" class="shadow-box-mini background-opacity wow danmaku-card">
    <div style="font-weight: bold;margin-bottom: 10px">🧨最新动态</div>
    <div class="danmaku-container">
      <vue-danmaku
        ref="danmaku"
        v-model:danmus="danmakuList"
        :isSuspend="true"
        :top="5"
        useSlot
        loop
        :speeds="120"
        :channelWidth="20"
        :step="2"
        :randomChannel="true">
        <template #danmu="{ danmu }">
          <div class="danmu-item">
            <img v-if="danmu.avatar" class="danmu-avatar" :src="danmu.avatar" alt=""/>
            <span>{{ danmu.message }}</span>
          </div>
        </template>
      </vue-danmaku>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from 'vue'
import type {Ref} from 'vue'
import vueDanmaku from 'vue-danmaku'
import {danmakuApi} from '@/api/modules'

interface CommonUtils {
  isEmpty: (value: any) => boolean
  [key: string]: any
}

const $common = inject<CommonUtils>('$common')!

const danmakuList: Ref<any[]> = ref([])

const getDanmaku = async (): Promise<void> => {
  try {
    const res = await danmakuApi.latest()
    if (!$common.isEmpty(res.data)) {
      danmakuList.value = res.data.map((item: any) => ({
        id: item.id,
        avatar: item.avatar,
        message: item.message || '',
        time: Math.floor(Math.random() * 5 + 10)
      }))
    }
  } catch (e: any) {
    danmakuList.value = []
  }
}

onMounted(() => {
  getDanmaku()
})
</script>

<style scoped>
.danmaku-card {
  padding: 8px;
  border-radius: 10px;
  margin-top: 30px;
  animation: hideToShow 1s ease-in-out;
  background: var(--card-bg);
  overflow: hidden;
}

.danmaku-container {
  height: 60px;
  overflow: hidden;
  position: relative;
}

.danmaku {
  width: 100%;
  height: 100%;
}

.danmu-item {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  white-space: nowrap;
  font-size: 13px;
  line-height: 1.4;
  color: var(--greyFont);
  background: rgba(0, 0, 0, 0.15);
  border-radius: 50px;
}

.danmu-item .danmu-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 6px;
  object-fit: cover;
}
</style>
