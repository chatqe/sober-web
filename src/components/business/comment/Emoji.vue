<template>
  <div>
    <transition name="body">
      <div v-show="showEmoji">
        <span class="emoji-item"
              v-for="(value, key, index) in emojiListURL"
              :key="index"
              @click="addEmoji(key)">
          <img class="emoji" :src="value" :title="key" width="24px" height="24px"/>
        </span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';

// 定义props
const props = defineProps({
  showEmoji: {
    type: Boolean
  }
});

// 定义事件
const emit = defineEmits(['addEmoji']);

// 获取公共属性
const $constant = inject('$constant');

// 响应式数据
const emojiList = $constant.emojiList;
const emojiListURL = ref({});

// 添加表情处理函数
const addEmoji = (key) => {
  emit("addEmoji", key);
};

// 获取表情列表
const getEmojiList = (emojiList) => {
  let emojiName;
  let url;
  let result = {}
  for (let i = 0; i < emojiList.length; i++) {
    emojiName = "[" + emojiList[i] + "]";
    let j = i + 1;
    // url = $constant.qiniuDownload + "emoji/q" + j + ".gif";
    url = $constant.fileEmojiUrl + "emoji/q" + j + ".gif";
    result[emojiName] = url;
  }
  return result;
};

// 组件挂载后初始化表情列表
onMounted(() => {
  emojiListURL.value = getEmojiList(emojiList);
});
</script>

<style scoped>

  .emoji-item {
    cursor: pointer;
    display: inline-block;
  }

  .emoji-item:hover {
    transition: all 0.2s;
    border-radius: 0.25rem;
    background: var(--lightGray);
  }

  .emoji {
    margin: 0.25rem;
    /* 把此元素放置在父元素的中部 */
    vertical-align: middle;
  }

  .body-enter-active, .body-leave-active {
    transition: all 0.3s;
  }

  .body-enter-from, .body-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }
</style>
