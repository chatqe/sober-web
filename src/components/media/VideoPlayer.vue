<template>
  <div>
    <div>
      <vue-plyr class="video-player-box"
               ref="videoPlayerRef"
               :options="playerOptions"
               playsinline
               @play="onPlayerPlay"
               @pause="onPlayerPause"
               @ended="onPlayerEnded"
               @waiting="onPlayerWaiting"
               @playing="onPlayerPlaying"
               @loadeddata="onPlayerLoadeddata"
               @timeupdate="onPlayerTimeupdate"
               @canplay="onPlayerCanplay"
               @canplaythrough="onPlayerCanplaythrough"
               @ready="playerReadied">
        <video>
          <source :src="playerOptions.sources[0].src" :type="playerOptions.sources[0].type">
        </video>
      </vue-plyr>
    </div>
  </div>
</template>

<script setup>
import 'plyr/dist/plyr.css'
import VuePlyr from 'vue-plyr'
import { ref, reactive, computed, watch, onMounted } from 'vue'

// 定义props
const props = defineProps({
  url: {
    type: Object
  },
  cover: {
    type: String,
    default: ""
  }
})

// 响应式数据
const videoPlayerRef = ref(null)
const playerOptions = reactive({
  // 是否在页面加载后载入视频
  preload: 'metadata',
  // 自适应宽高
  fluid: true,
  // 循环播放
  loop: false,
  // 静音
  muted: false,
  // 语言
  i18n: {
    zhCN: {
      play: '播放',
      pause: '暂停',
      enterFullscreen: '全屏',
      exitFullscreen: '退出全屏',
      mute: '静音',
      unmute: '取消静音',
      enableCaptions: '开启字幕',
      disableCaptions: '关闭字幕',
      download: '下载',
      speed: '速度',
      normal: '正常',
      playbackRate: '{speed}x'
    }
  },
  // 默认语言
  language: 'zhCN',
  // 自动播放
  autoplay: false,
  // 可选的播放速度
  playbackRates: [0.5, 1, 1.5, 2],
  // 视频源
  sources: [{
    type: '',
    src: ''
  }],
  // 封面图
  poster: '',
  // 控制栏配置
  controls: [
    'play-large',
    'play',
    'progress',
    'pageNum-time',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen'
  ],
  // 当无法播放视频时显示的消息
  fallbackMessage: '此视频暂无法播放'
})

// 计算属性
const player = computed(() => {
  return videoPlayerRef.value?.plyr
})

// 监听url变化
watch(() => props.url, (val) => {
  if (val) {
    playerOptions.sources[0].src = val.src
    playerOptions.sources[0].type = val.type
    playerOptions.poster = props.cover
  }
}, { immediate: true, deep: true })

// 播放回调函数
const onPlayerPlay = (player) => {
  // 播放回调
}

const onPlayerPause = (player) => {
  // 暂停回调
}

const onPlayerEnded = (player) => {
  // 视频播完回调
}

const onPlayerWaiting = (player) => {
  // 当播放由于暂时缺少数据而停止时
}

const onPlayerPlaying = (player) => {
  // 重新启动播放时
}

const onPlayerLoadeddata = (player) => {
  // 当前播放位置的视频帧加载完成后
}

const onPlayerTimeupdate = (player) => {
  // currentTime更新时
}

const onPlayerCanplay = (player) => {
  // 可以播放但可能需要缓冲时
}

const onPlayerCanplaythrough = (player) => {
  // 可以播放直到结束时
}

// vue-plyr不直接提供statechanged事件，但可以通过其他事件组合实现类似功能
const playerStateChanged = () => {
  // 播放状态改变回调
}

const playerReadied = (player) => {
  // 组件就绪状态
}

// 生命周期钩子
onMounted(() => {
  // 组件挂载后的逻辑
})
</script>

<style>

  .video-player-box {
    border-radius: 5px;
    overflow: hidden;
  }

  .vjs-big-play-button {
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
  }

</style>
