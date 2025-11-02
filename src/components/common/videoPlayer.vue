<template>
  <div>
    <div>
      <video-player class="video-player-box"
                    ref="videoPlayerRef"
                    :options="playerOptions"
                    :playsinline="true"

                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"

                    @waiting="onPlayerWaiting($event)"
                    @playing="onPlayerPlaying($event)"
                    @loadeddata="onPlayerLoadeddata($event)"
                    @timeupdate="onPlayerTimeupdate($event)"
                    @canplay="onPlayerCanplay($event)"
                    @canplaythrough="onPlayerCanplaythrough($event)"

                    @statechanged="playerStateChanged($event)"
                    @ready="playerReadied($event)">
      </video-player>
    </div>
  </div>
</template>

<script setup>
import 'video.js/dist/video-js.css'
import {videoPlayer} from 'vue-video-player'
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
  //是否在页面加载后载入视频
  preload: 'metadata',
  aspectRatio: '16:9',
  //自适应宽高
  fluid: true,
  loop: false,
  muted: false,
  language: 'zh-CN',
  autoplay: false,
  //可选的播放速度
  playbackRates: [0.5, 1.0, 1.5, 2.0],
  sources: [{
    type: '',
    src: ''
  }],
  poster: '',
  notSupportedMessage: '此视频暂无法播放',
  controlBar: {
    //暂停和播放键
    playToggle: true,
    //进度条
    progressControl: true,
    //全屏按钮
    fullscreenToggle: true
  }
})

// 计算属性
const player = computed(() => {
  return videoPlayerRef.value?.player
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

const playerStateChanged = (player) => {
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
