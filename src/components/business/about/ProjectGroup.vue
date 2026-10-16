<template>
  <div v-if="!isEmpty(items)" class="project-group">
    <h2 class="project-group-title">{{ title }}</h2>
    <div class="project-cards">
      <div
        v-for="item in items"
        :key="item.id ?? item.title"
        class="project-card shadow-box"
      >
        <div class="project-card-main">
          <div class="project-card-title" @click="openUrl(item.url)">
            {{ item.title }}
            <el-icon v-if="item.url"><Link /></el-icon>
          </div>
          <div class="project-card-desc">{{ item.introduction }}</div>
        </div>

        <div class="project-card-links">
          <el-button
            v-if="item.url"
            circle
            size="small"
            title="源码"
            @click="openUrl(item.url)"
          >
            <el-icon><Link /></el-icon>
          </el-button>
          <el-button
            v-if="!$common.isEmpty(item.demonstration)"
            circle
            size="small"
            title="演示"
            @click="openUrl(item.demonstration)"
          >
            <el-icon><View /></el-icon>
          </el-button>
          <el-button
            v-if="!$common.isEmpty(item.docs)"
            circle
            size="small"
            title="文档"
            @click="openUrl(item.docs)"
          >
            <el-icon><Document /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="project-empty">
    <el-empty :description="emptyText" :image-size="60" />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { ElButton } from 'element-plus'
import { Link, View, Document } from '@element-plus/icons-vue'
import { useCommon } from '@/composables/useCommon'

interface ProjectItem {
  id?: number
  title?: string
  url?: string
  introduction?: string
  /** 扩展字段（资源路径 extraJson 里配置），没有则不渲染对应按钮 */
  demonstration?: string
  docs?: string
  [key: string]: any
}

const props = withDefaults(defineProps<{
  title: string
  items: ProjectItem[]
  emptyText?: string
}>(), {
  items: () => [],
  emptyText: '暂无数据',
})

const $common = useCommon()
const isEmpty = $common.isEmpty

function openUrl(url?: string): void {
  if (url) window.open(url, '_blank', 'noopener')
}</script>

<style scoped>
.project-group {
  margin: 30px 0;
}

.project-group-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px;
  background: var(--white);
  border-radius: 10px;
  padding: 18px 20px;
  overflow: hidden;
  /* 渐变描边：参考图 RAGnote 卡片样式 */
  position: relative;
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  padding: 1.5px;
  background: linear-gradient(120deg, #f43f3b, #ec008c, #15c6ff);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card-main {
  flex: 1;
}

.project-card-title {
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.project-card-title:hover {
  color: var(--lightGreen);
}

.project-card-desc {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--greyFont);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-card-links {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.project-empty {
  padding: 20px 0;
}
</style>
