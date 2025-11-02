<template>
  <div id="aplayer">
    <!-- meting-js 音乐播放器 -->
    <!-- 注：meting-js 需要单独引入脚本文件才能使用，暂时注释 -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// 播放器实例引用
const player = ref(null);

// 组件挂载后的处理逻辑
onMounted(() => {
  // 当前实现使用了meting-js组件，无需额外初始化
  // 如果将来需要直接使用APlayer API，可以在这里初始化
});

// 组件卸载前的清理工作
onUnmounted(() => {
  // 如果将来直接使用APlayer实例，确保在这里销毁
  if (player.value) {
    player.value.destroy();
  }
});
</script>

<style>



.aplayer.aplayer-fixed .aplayer-body {
  border-radius: 0px 6px 6px 0px;
  background: var(--favoriteBg) !important;
}

.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
  left: -66px !important;
}

.aplayer .aplayer-pic:hover .aplayer-button {
  opacity: 1 !important;
}

.aplayer .aplayer-miniswitcher {
  border-radius: 0 6px 6px 0 !important;
  background: var(--favoriteBg) !important;
}

/*.aplayer .aplayer-pic {
  position: relative;
  float: left;
  height: 66px;
  width: 66px;
  background-size: cover;
  background-position: 50%;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  cursor: pointer;
}*/

/* 背景色 */
/*.aplayer.aplayer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 99;
  overflow: visible;
  max-width: 400px;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.aplayer * {
  box-sizing: content-box;
}
.aplayer.aplayer-fixed .aplayer-body {
  background: var(--favoriteBg) !important;
  border-radius: 0 6px 6px 0;
}
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
  width: 66px !important;
}
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
  left: -66px !important;
}
.aplayer {
  background: #fff;
  font-family: Arial, Helvetica, sans-serif;
  margin: 5px;
  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .07), 0 1px 5px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .07), 0 1px 5px 0 rgba(0, 0, 0, .1);
  border-radius: 2px;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: normal;
  position: relative;
}

.aplayer.aplayer-narrow {
  width: 66px;
}

.aplayer.aplayer-pic {
  position: relative;
  float: left;
  height: 66px;
  width: 66px;
  background-size: cover;
  background-position: 50%;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  cursor: pointer;
}*/

</style>
