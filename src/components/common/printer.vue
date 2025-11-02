<template>
  <div>
    <slot name="paper" :content="content"></slot>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

// 定义props
const props = defineProps({
  //内容
  printerInfo: {
    type: String,
    default: ""
  },
  //速度
  duration: {
    type: Number,
    default: 100
  },
  //延迟
  delay: {
    type: Number,
    default: 3000
  },
  working: {
    type: Boolean,
    default: true
  },
  once: {
    type: Boolean,
    default: false
  }
});

// 响应式数据
const content = ref("");
const cursor = ref(0);
const timer = ref(null);
const timeout = ref(null);
const print = ref(true);

/**
 * 定时
 */
const start = (work) => {
  //延迟
  timeout.value = setTimeout(() => {
    //速度
    timer.value = setInterval(() => {
      work();
      if (cursor.value === 0 || (cursor.value === props.printerInfo.length && !props.once)) {
        //此处为了延迟
        clearInterval(timer.value);
        start(work);
      } else if (cursor.value === props.printerInfo.length && props.once) {
        clearInterval(timer.value);
      }
    }, props.duration);
  }, props.delay);
};

/**
 * 逻辑
 */
const work = () => {
  let currentCursor = cursor.value;
  currentCursor += print.value ? 1 : -1;
  if (print.value) {
    if (currentCursor === props.printerInfo.length + 1) {
      currentCursor -= 2;
      print.value = !print.value;
    }
  } else {
    if (currentCursor === -1) {
      currentCursor += 2;
      print.value = !print.value;
    }
  }
  cursor.value = currentCursor;
};

const toBegin = () => {
  cursor.value = 0;
  if (timeout.value !== null) {
    clearTimeout(timeout.value);
    if (timer.value !== null) {
      clearInterval(timer.value);
    }
  }
  if (props.working) {
    start(work);
  } else {
    content.value = props.printerInfo;
  }
};

// 监听props变化
watch(() => props.working, () => {
  toBegin();
});

watch(() => props.printerInfo, () => {
  toBegin();
});

// 监听cursor变化
watch(cursor, (currentCursor) => {
  //slice(start,end)：不包含end
  content.value = props.printerInfo.slice(0, currentCursor);
});

// 组件挂载时初始化
onMounted(() => {
  if (props.working) {
    start(work);
  } else {
    content.value = props.printerInfo;
  }
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
});
</script>
