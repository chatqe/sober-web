<template>
  <div class="poem-container myCenter my-animation-hideToShow"
       v-if="!$common.isEmpty(guShi.origin) || !$common.isEmpty(hitokoto.hitokoto)">
    <!-- 背景图片 -->
    <el-image class="my-el-image poem-image"
              style="position: absolute;margin-top: -50px"
              v-once
              lazy
              :src="webInfoStore.webInfo.randomCover[Math.floor(Math.random() * webInfoStore.webInfo.randomCover.length)]"
              fit="cover">
      <template #error>
        <div class="image-slot"></div>
      </template>
    </el-image>
    <div class="poem-wrap">
      <div v-if="isShehui"><span>须知少时拏云志，曾许人间第一流</span></div>
      <div v-else><span>{{isHitokoto?hitokoto.from:guShi.origin}}</span></div>
      <p class="poem">{{isHitokoto?hitokoto.hitokoto:guShi.content}}</p>
      <p class="info" v-if="!isShehui && (!isHitokoto || (isHitokoto && !$common.isEmpty(hitokoto.from_who)))">
        {{isHitokoto?hitokoto.from_who:guShi.author}}
      </p>
      <!--<div v-else><span>{{ isHitokoto ? hitokoto.from : "青肆" }}</span></div>-->
      <!--<p class="poem">{{ isHitokoto ? hitokoto.hitokoto : "须知少时拏云志，曾许人间第一流" }}</p>-->
      <!--<p class="info" v-if="!isShehui && (!isHitokoto || (isHitokoto && (!$common.isEmpty(hitokoto.from_who))))">-->
      <!--  {{ isHitokoto ? hitokoto.from_who : guShi.author }}-->
      <!--</p>-->
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, inject} from 'vue';
import {useWebInfoStore} from '@/stores';

// 定义props
const props = defineProps({
  isHitokoto: {
    type: Boolean,
    default: true
  },
  isShehui: {
    type: Boolean,
    default: false
  }
});

// 获取公共属性
const $constant = inject('$constant');
const $common = inject('$common');
const webInfoStore = useWebInfoStore();

// 响应式数据
const guShi = ref({
  "content": "须知少日拏云志，曾许人间第一流",
  "origin": "清·题三十小象",
  "author": "青肆",
  "category": "..."
});

const hitokoto = ref({
  "hitokoto": "须知少时拏云志，曾许人间第一流",
  "from": "青肆",
  "from_who": "..."
});

// 发送请求获取数据的方法
const sendShehui = async () => {
  try {
    const response = await fetch($constant.shehui);
    const shehui = await response.text();
    hitokoto.value.hitokoto = shehui.substring(1, shehui.length - 1);
  } catch (error) {
    console.error('获取鬼畜数据失败:', error);
  }
};

const getGuShi = async () => {
  try {
    const response = await fetch($constant.jinrishici);
    guShi.value = await response.json();
  } catch (error) {
    console.error('获取诗句失败:', error);
  }
};

const getHitokoto = async () => {
  try {
    const response = await fetch($constant.hitokoto);
    hitokoto.value = await response.json();
  } catch (error) {
    console.error('获取一言失败:', error);
  }
};

// 组件挂载后初始化数据
onMounted(() => {
  if (!props.isShehui) {
    if (props.isHitokoto) {
      getHitokoto();
    } else {
      getGuShi();
    }
  } else {
    hitokoto.value.from = "";
    hitokoto.value.from_who = "";
    sendShehui();
  }
});
</script>
<style scoped>

.poem-container {
  padding: 90px 0 40px;
  position: relative;
}

.poem-wrap {
  border-radius: 10px;
  z-index: 10;
  text-align: center;
  letter-spacing: 4px;
  font-weight: 300;
  width: 100%;
  max-width: 800px;
}

.poem-wrap div span {
  padding: 5px 10px;
  color: var(--white);
  font-size: 2em;
  border-radius: 5px;
}

.poem-wrap p {
  width: 100%;
  max-width: 800px;
  color: var(--white);
}

.poem-wrap p.poem {
  margin: 40px auto;
  font-size: 1.5em;
}

.poem-wrap p.info {
  margin: 20px auto 40px;
  font-size: 1.1em;
}
</style>
