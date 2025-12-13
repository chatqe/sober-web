<template>
  <!-- 播放器逻辑层 -->
  <VueAudioPlayer
      ref="playerRef"
      :audio-list="audioList"
      :before-play="onBeforePlay"
      theme-color="#EC4141"
      :show-prev-next="true"
      :is-loop="true"
      :volume="0.6"
      :disabled-progress-drag="false"
  />

  <!-- 自定义控制面板 -->
  <section class="audio-panel">
    <button class="btn-icon" @click="toggle">
      <i :class="isPlaying ? 'i-pause' : 'i-play'"/>
    </button>

    <span class="time">{{ fmt(current) }} / {{ fmt(duration) }}</span>

    <div class="progress" @click="seek">
      <div class="progress-bar" :style="{ width: percent + '%' }"/>
    </div>

    <button class="btn-icon" @click="next">
      <i class="i-next"/>
    </button>

    <input
        v-model="volume"
        type="range"
        class="volume"
        min="0"
        max="1"
        step="0.01"
        @input="setVol"
    />
  </section>
</template>

<script setup>
import {defineAsyncComponent, ref, watch} from 'vue'

/* 异步加载，首屏不增加体积 */
const VueAudioPlayer = defineAsyncComponent(() =>
    import('@liripeng/vue-audio-player').then(m => m.VueAudioPlayer)
)



/* 数据 */
const playerRef = ref(null)
const audioList = ref([{}])
const isPlaying = ref(false)
const current = ref(0)
const duration = ref(0)
const volume = ref(0.6)
const percent = ref(0)

/* 方法 */
const toggle = () => playerRef.value?.togglePlay?.()
const next = () => playerRef.value?.playNext?.()
const setVol = () => {
  const audio = playerRef.value.$el.querySelector('audio')
  if (audio) audio.volume = volume.value
}

const seek = e => {
  const dom = e.currentTarget
  const x = e.offsetX / dom.offsetWidth
  const audio = playerRef.value.$el.querySelector('audio')
  if (audio) audio.currentTime = x * duration.value
}

const fmt = t => {
  const m = Math.floor(t / 60).toString().padStart(2, '0')
  const s = Math.floor(t % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/* 生命周期钩子 */
const onBeforePlay = () => {
  const audio = playerRef.value.$el.querySelector('audio')
  if (!audio) return true

  audio.addEventListener('timeupdate', () => {
    current.value = audio.currentTime
    duration.value = audio.duration || 0
    percent.value = duration.value ? (current.value / duration.value) * 100 : 0
  })
  audio.addEventListener('ended', () => (isPlaying.value = false))
  audio.addEventListener('play', () => (isPlaying.value = true))
  audio.addEventListener('pause', () => (isPlaying.value = false))
  return true
}
</script>

<style scoped>
.audio-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .08);
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.progress {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: #ec4141;
  border-radius: 2px;
}

.time {
  font-size: 12px;
  color: #666;
}

.volume {
  width: 80px;
}

/* 图标占位 */
.i-play::before {
  content: "▶";
}

.i-pause::before {
  content: "❚❚";
}

.i-next::before {
  content: "⏭";
}
</style>