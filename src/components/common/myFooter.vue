<template>
  <footer v-show="visible" class="app-footer">
    <div class="footer-box footer-title">{{ webInfo.footer }}</div>
    <div class="footer-box icp">Powered By<a href="https://youngwanton.top" target="_blank"> YoungWanton</a></div>
    <div class="footer-box">© 2025 Your Company</div>
  </footer>
</template>

<script setup>
import {computed, defineProps} from 'vue';
import {useWebInfoStore} from '@/stores';

defineProps({
  gradDir: {
    type: String,
    default: 'to bottom'
  },
  visible: {
    type: Boolean,
    default: true
  }
})

// 从Pinia获取状态
const webInfoStore = useWebInfoStore();
const webInfo = computed(() => webInfoStore.webInfo);

</script>

<style scoped>
.app-footer {
  --grad-dir: v-bind(gradDir);
  height: 190px;
  position: relative; /* 让伪元素以它做定位基准 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  color: #000; /* 文字黑色 */
  overflow: hidden; /* 防止渐变溢出 */
  isolation: isolate; /* 创建新的堆叠上下文，防止子元素被父元素::before/::after 遮住 */
}

/* 白色→透明 遮罩层 */
.app-footer::before {
  content: '';
  position: absolute;
  inset: 0; /* top/right/bottom/left 全部 0 */
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /* height: 100%;  高度为容器百分比*/
  /*background: linear-gradient(to bottom, var(--background) 10%, transparent 100%);*/
  background-image: linear-gradient(var(--grad-dir), var(--background) 10%, transparent 100%);
  z-index: 1; /* 盖住背景图，但低于文字 */
  pointer-events: none;
}

/* 真正的大背景图 */
.app-footer1::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('https://cdn.youngwanton.top/qingsi/static/backgroundImg/173184198345798169878.jpg');
  background-size: cover;
  /*background-position: center bottom;*/
  background-position: center calc(100% + 200px); /* 居中底部对齐的情况下 向上挪动200px */
  background-repeat: no-repeat;
  background-attachment: fixed; /* 关键：随页面滚动而移动 */
  z-index: -1; /* 沉到最底 */
}

.footer-box {
  position: relative; /* 提升层级，确保在遮罩之上 */
  z-index: 2;
  margin: 4px 0;
  font-size: 14px;
  background: transparent;
  transform: translateY(25px);
}

.footer-title {
  padding-top: 10px;
  font-size: 16px;
}

.icp, .icp a {
  /*color: var(--maxGreyFont);*/
  color: #000;
  font-size: 13px;
}

.icp {
  padding-top: 10px;
  padding-bottom: 10px;
}

.icp a {
  text-decoration: none;
  transition: all 0.3s;
}

.icp a:hover {
  color: var(--background);
}
</style>