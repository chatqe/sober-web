<script setup>
import { defineProps } from 'vue'

// 组件 props：支持自定义图片、描述文本等
const props = defineProps({
  // 图片路径（默认提供一张空状态图，可覆盖）
  // imageUrl: {
  //   type: String,
  //   default: "require('@/assets/file/emptyBg.jpg')" // 你的默认图片路径
  // },
  // 图片alt文本
  altText: {
    type: String,
    default: '暂无数据'
  },
  // 简单描述文本（复杂文本用插槽）
  description: {
    type: String,
    default: '暂无内容，快来添加吧~'
  },

})
</script>

<template>
  <!-- 外层容器：默认居中，自定义高度 -->
  <div class="empty-state">
    <!-- 图片区域 -->
    <!--<div class="empty-image">-->
    <!--  <img-->
    <!--      src="@/assets/file/emptyBg.jpg"-->
    <!--      :alt="altText"-->
    <!--      class="empty-img"-->
    <!--  />-->
    <!--</div>-->

    <!-- 描述文本区域 -->
    <div class="empty-description" v-if="description">
      {{ description }}
    </div>

    <!-- 自定义插槽：支持复杂描述文本 -->
    <slot name="description" v-else></slot>

    <!-- 底部操作区插槽 -->
    <div class="empty-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  /* 核心：居中显示 */
  text-align: center;
  /* 占据父容器宽度，避免内容过窄 */
  width: 90%;
  /* 核心：左右外边距自动，实现水平居中 */
  margin: 0 auto;
  min-height: 60.5vh;
  /* 内边距：与父容器保持距离 */
  padding: 40px 20px;
  box-sizing: border-box;
  /* 关键：让伪元素相对于容器定位 */
  position: relative;
  /* 确保内容在遮罩上方 */
  z-index: 1;
  /* 文字颜色（避免被背景图覆盖） */
  color: #fff;
  /* 使用flex布局确保内容垂直居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 用伪元素实现背景图 + 透明效果 */
.empty-state::before {
  content: '';
  /* 伪元素覆盖整个容器 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 设置背景图片 */
  /*background-image: url('@/assets/file/emptyBg.jpg');  图片路径 */
  background-size: cover; /* 图片覆盖容器 */
  background-position: center; /* 图片居中 */
  /* 核心：设置透明度（0-1，值越小越透明） */
  opacity: 0.7; /* 背景图半透明 */
  /* 确保伪元素在内容下方 */
  z-index: -1;
}

.empty-state1 {
  /* 脱离文档流，基于视口定位 */
  position: fixed;
  /* 水平居中：left=50% + 自身偏移 -50% */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); /* 基于自身中心点偏移，精准居中 */

  /* 宽度=视口80% */
  width: 80vw;
  /* 最大宽度限制（避免大屏过宽） */
  max-width: 800px;
  /* 最小高度 */
  min-height: 60.5vh;
  padding: 40px 20px;
  box-sizing: border-box;

  /* 内部内容居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* 文字颜色 */
  color: #000;
  z-index: 10; /* 确保在其他内容上方 */
}

/* 背景图：同样基于视口居中，宽度=视口80% */
.empty-state1::before {
  content: '';
  position: absolute;
  /* 覆盖整个empty-state */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* 背景图设置 */
  background-image: url('@/assets/file/emptyBg.jpg');
  background-size: cover; /* 覆盖容器 */
  background-position: center; /* 图片自身居中 */
  background-repeat: no-repeat;

  opacity: 0.7;
  z-index: -1; /* 在内容下方 */
}

/* 图片区域 */
.empty-image {
  /* 确保图片容器居中（冗余保障） */
  margin: 0 auto;
  /* 限制图片最大宽度不超过父容器（关键！避免溢出） */
  max-width: 100%;
}

.empty-img {
  /* 响应式图片：默认宽度60%视口，最大600px */
  width: 61vw;
  height: auto; /* 保持比例 */
  object-fit: contain;
}

/* 描述文本 */
.empty-description {
  margin-top: 20px;
  font-size: 16px;
  /*color: #666;*/
  /*color: #000;*/
  color: #fff;
  line-height: 1.5;
}

/* 底部操作区 */
.empty-footer {
  margin-top: 30px;
}

/* 响应式调整：小屏设备 */
@media screen and (max-width: 767px) {
  .empty-state {
    padding: 30px 10px;
  }

  .empty-img {
    width: 70vw; /* 小屏图片占比更大 */
    max-width: 300px;
  }

  .empty-description {
    font-size: 14px;
    padding: 0 10px;
  }
}
</style>