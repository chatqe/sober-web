<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem :isHitokoto="false"></twoPoem>
    </div>

    <div style="background: var(--background)" class="my-animation-slide-bottom">
      <div class="about-wrap">
        <h1 style="font-size: 40px;font-weight: 500;letter-spacing: 5px;">两只毛驴鸣翠柳</h1>
        <!-- 对话框 -->
        <div class="about-box">
          <h4>与 {{ webName }} 对话中...</h4>
          <div v-if="sayShow" ref="sayContainerRef" class="say-container">
            <!-- 消息列表 -->
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="[
                message.type === 'right' ? 'say-right' : 'say-left',
                'my-animation-slide-bottom'
              ]"
            >
              <span :class="message.type === 'right' ? 'say-item-right' : 'say-item-left'">
                {{ message.content }}
              </span>
            </div>
            
            <!-- 选择按钮 -->
            <div v-if="showSelectButtons" class="say-left my-animation-slide-bottom">
              <button
                v-for="(option, index) in selectOptions"
                :key="index"
                class="say-select"
                @click="handleSelect(index, option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import type { Ref } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useWebInfoStore } from '@/stores'
import type { CommonUtils, AppConstants } from '@/types'

// 获取注入的全局属性
const $common: CommonUtils = inject('$common')!
const $constant: AppConstants = inject('$constant')!

// 组件动态导入
const twoPoem = defineAsyncComponent(() => import('../../../components/business/twoPoem/TwoPoem.vue'))
const myFooter = defineAsyncComponent(() => import('../../../components/business/MyFooter.vue'))

// 使用store
const webInfoStore = useWebInfoStore()
const webName = webInfoStore.webInfo?.webName || ''

// 定义消息类型
interface Message {
  type: 'left' | 'right'
  content: string
}

// 定义选择选项类型
interface SelectOption {
  label: string
  value: string
}

// 响应式数据
const sayShow: Ref<boolean> = ref(false)
const sayIndex: Ref<number> = ref(0)
const messages: Ref<Message[]> = ref([])
const showSelectButtons: Ref<boolean> = ref(false)
const selectOptions: Ref<SelectOption[]> = ref([])
const sayContainerRef: Ref<HTMLElement | null> = ref(null)

// 定义对话内容类型
interface SayContentItem {
  talk: string[]
  reply: string[]
}

const sayContent: Ref<SayContentItem[]> = ref([
  {
    "talk": ["Hi, there👋", "这是一个 Vue2 Vue3 与 SpringBoot 结合的产物~"],
    "reply": ["然后呢？ 😃", "少废话！ 🙄"]
  }, {
    "talk": ["😘",
      "本站平时仅用于交流和学习新知识",
      "如涉及侵权请联系站长删除对应资源，谢谢！！！"],
    "reply": ["这个网站有什么用吗？ 😂"]
  }, {
    "talk": ["拥有自己的独立网站难道不酷吗🚀",
      "那就摸鱼吧👋",
      "摸鱼大军请在聊天室集合🥝"],
    "reply": []
  }
])

// 处理选择选项
const handleSelect = async (index: number, value: string): Promise<void> => {
  // 添加用户回复消息
  messages.value.push({
    type: 'right',
    content: value
  })
  
  // 隐藏选择按钮
  showSelectButtons.value = false
  selectOptions.value = []
  
  if (index === 0) {
    setTimeout(() => {
      say()
    }, 500)
  } else {
    // 添加机器人回复
    setTimeout(() => {
      messages.value.push({
        type: 'left',
        content: '👋 👋 👋'
      })
    }, 500)
  }
}

// 对话函数
const say = (): void => {
  if (!$common.isEmpty(sayContent.value[sayIndex.value]) && !$common.isEmpty(sayContent.value[sayIndex.value].talk)) {
    sayContent.value[sayIndex.value].talk.forEach((value, index, talk) => {
      setTimeout(() => {
        // 添加左侧对话消息
        messages.value.push({
          type: 'left',
          content: value
        })
        
        if (talk.length === index + 1) {
          if (!$common.isEmpty(sayContent.value[sayIndex.value].reply)) {
            setTimeout(() => {
              // 显示回复选项
              const replies = sayContent.value[sayIndex.value].reply
              selectOptions.value = replies.map((reply, idx) => ({
                label: reply,
                value: reply
              }))
              showSelectButtons.value = true
              sayIndex.value += 1
            }, 500)
          }
        }
      }, index * 500)
    })
  }
}

// 组件挂载后执行
onMounted(() => {
  setTimeout(() => {
    sayShow.value = true
    say()
  }, 2000)
})
</script>

<style scoped>
  .about-wrap {
    text-align: center;
    width: 95%;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px 80px;
  }

  .about-box {
    min-height: 450px;
    padding: 5px;
    background-color: var(--maxMaxLightGray);
    border-radius: 10px;
  }

  .say-container {
    text-align: left;
    padding: 10px;
    height: 400px;
    overflow-y: auto;
  }

  .say-left {
    display: flex;
    margin: 10px 0;
  }

  .say-right {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
  }

  .say-item-left {
    background-color: #f0f0f0;
    padding: 10px 15px;
    border-radius: 10px;
    max-width: 60%;
  }

  .say-item-right {
    background-color: #52c41a;
    color: white;
    padding: 10px 15px;
    border-radius: 10px;
    max-width: 60%;
  }

  .say-select {
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
  }

  .say-select:hover {
    background-color: #0050b3;
  }
</style>
