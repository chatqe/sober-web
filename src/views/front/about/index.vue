<template>
  <div class="about-page my-animation-slide-bottom">
    <div class="about-container">
      <!-- 页面标题 -->
      <div class="about-header my-animation-slide-top">
        <div class="about-header-badge">
          <span class="badge-dot"></span>
          About {{ webInfoStore.webInfo?.webName || 'Astro-Theme-Pure' }} Project
        </div>
        <h1 class="about-title">Github Activities</h1>
      </div>

      <!-- GitHub 贡献热力图 -->
      <contrib-heatmap />

      <!-- 说明文案 + 赞赏按钮 -->
      <div class="about-info my-animation-slide-bottom">
        <div class="about-info-text">
          <p>如果你对某个项目方向感兴趣，可以从这里进入源码、站内页面或相关记录。</p>
          <p>如果你认为某个项目有用或有趣并愿意合作，可以赞赏以支持我的工作，或联系讨论。</p>
        </div>
        <div class="about-info-action">
          <button class="sponsor-btn" @click="scrollTo('sponsorship')">
            <el-icon><Coin /></el-icon>
            赞赏我的工作
          </button>
        </div>
      </div>

      <!-- 项目列表：Programs -->
      <div ref="programsRef" class="about-section" :id="'about-sections'">
        <project-group
          title="Programs"
          :items="programsList"
          empty-text="暂无 Programs 数据"
        />
      </div>

      <!-- 项目列表：Learnings -->
      <div ref="learningsRef" class="about-section">
        <project-group
          title="Learnings"
          :items="learningsList"
          empty-text="暂无 Learnings 数据"
        />
      </div>

      <!-- 赞赏区（内嵌，仅在获取到赞赏码图片时显示） -->
      <div v-if="!sponsorshipEmpty" ref="sponsorshipRef" class="about-section sponsorship-section shadow-box">
        <h2 class="section-title">Sponsorship</h2>
        <div class="sponsorship-wrap">
          <img
            v-if="sponsorshipImg"
            :src="sponsorshipImg"
            alt="赞赏码"
            class="sponsorship-img"
          />
          <p class="sponsorship-tip">感谢支持，请备注您的昵称以便联系~</p>
        </div>
      </div>

      <!-- Guest Book（留言区，复用全站留言 API） -->
      <div ref="guestBookRef" class="about-section">
        <h2 class="section-title">Guest Book</h2>
        <guest-book />
      </div>

      <!-- 右侧 TOC（桌面端） -->
      <aside class="about-toc" v-if="!mobile">
        <h4 class="toc-title">Table of Contents</h4>
        <ul class="toc-list">
          <li
            v-for="item in tocItems"
            :key="item.id"
            class="toc-item"
            :class="{ 'toc-active': activeSection === item.id }"
            @click="scrollTo(item.id)"
          >
            {{ item.label }}
          </li>
        </ul>
      </aside>
    </div>

    <!-- 页脚 -->
    <my-footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject, defineAsyncComponent } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Coin } from '@element-plus/icons-vue'
import { useWebInfoStore, useUiStore } from '@/stores'
import type { CommonUtils, AppConstants } from '@/types'

// 异步导入组件
const contribHeatmap = defineAsyncComponent(() => import('@/components/business/about/ContribHeatmap.vue'))
const projectGroup = defineAsyncComponent(() => import('@/components/business/about/ProjectGroup.vue'))
const guestBook = defineAsyncComponent(() => import('@/components/business/about/GuestBook.vue'))
const myFooter = defineAsyncComponent(() => import('@/components/business/MyFooter.vue'))

// 获取注入的全局属性
const $common: CommonUtils = inject('$common')!
const $constant: AppConstants = inject('$constant')!

// stores
const webInfoStore = useWebInfoStore()
const uiStore = useUiStore()
const mobile = computed(() => uiStore.mobile)

// ===== 数据获取 =====
const programsList = ref<any[]>([])
const learningsList = ref<any[]>([])
const sponsorshipEmpty = ref(true)
const sponsorshipImg = ref('')

// TOC refs
const programsRef = ref<HTMLElement | null>(null)
const learningsRef = ref<HTMLElement | null>(null)
const sponsorshipRef = ref<HTMLElement | null>(null)
const guestBookRef = ref<HTMLElement | null>(null)

const activeSection = ref('programs')

const tocItems = computed(() => {
  const items: { id: string; label: string }[] = [
    { id: 'programs', label: 'Programs' },
    { id: 'learnings', label: 'Learnings' },
  ]
  if (!sponsorshipEmpty.value) {
    items.push({ id: 'sponsorship', label: 'Sponsorship' })
  }
  items.push({ id: 'guestbook', label: 'Guest Book' })
  return items
})

// ===== 赞赏码图片（从资源路径 API 获取，classify = 'sponsorship'）=====
// 端点 /webInfo/listResourcePath 当前 404（后端接口路径已变更），切换为 resAgg 端点
async function loadSponsorship(): Promise<void> {
  try {
    const { getAboutProjects } = await import('@/api/modules/about')
    const res: any = await getAboutProjects('sponsorship')
    const record = res?.records?.[0]
    if (record?.url) {
      sponsorshipImg.value = record.url
      sponsorshipEmpty.value = false
    }
  } catch (e) {
    console.error('[sponsorship] load failed', e)
  }
}

// ===== 项目列表 =====
async function loadProjects(): Promise<void> {
  try {
    const { getAboutProjects } = await import('@/api/modules/about')
    const programs: any = await getAboutProjects('Programs')
    programsList.value = programs?.records ?? []
    const learnings: any = await getAboutProjects('Learnings')
    learningsList.value = learnings?.records ?? []
  } catch (e: any) {
    ElMessage.error(e?.message || '获取项目列表失败')
  }
}

// ===== TOC 滚动 =====
function scrollTo(id: string): void {
  const map: Record<string, Ref<HTMLElement | null>> = {
    programs: programsRef,
    learnings: learningsRef,
    sponsorship: sponsorshipRef,
    guestbook: guestBookRef,
  }
  const el = map[id]?.value
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeSection.value = id
}

let scrollObserver: IntersectionObserver | null = null

function setupTocObserver(): void {
  if (mobile.value || !('IntersectionObserver' in window)) return
  const sections: { el: HTMLElement | null; id: string }[] = [
    { el: programsRef.value, id: 'programs' },
    { el: learningsRef.value, id: 'learnings' },
    ...(sponsorshipEmpty.value ? [] : [{ el: sponsorshipRef.value, id: 'sponsorship' }]),
    { el: guestBookRef.value, id: 'guestbook' },
  ]
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const match = sections.find(s => s.el === entry.target)
        if (match) activeSection.value = match.id
      }
    })
  }, { threshold: [0.2] })
  sections.forEach(s => { if (s.el) scrollObserver!.observe(s.el) })
}

// ===== 生命周期 =====
onMounted(async () => {
  await loadProjects()
  loadSponsorship()
  setTimeout(setupTocObserver, 300)
})

onBeforeUnmount(() => {
  scrollObserver?.disconnect()
})
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: var(--background);
}

.about-container {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

/* 标题区 */
.about-header {
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
}

.about-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--lightGray);
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  color: var(--fontColor);
  margin-bottom: 16px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
}

.about-title {
  font-size: 40px;
  font-weight: 500;
  letter-spacing: 2px;
  margin: 0;
}

/* 说明文案区 */
.about-info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin: 24px 0;
  padding: 20px;
  background: var(--maxMaxLightGray, #f5f5f5);
  border-radius: 10px;
}

.about-info-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.8;
  color: var(--fontColor);
}

.about-info-text p {
  margin: 0 0 4px;
}

.sponsor-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--lightGray);
  background: var(--white);
  color: var(--fontColor);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  flex-shrink: 0;
}

.sponsor-btn:hover {
  border-color: var(--themeBackground);
  color: var(--themeBackground);
}

/* 通用 section 标题 */
.section-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 1px;
  color: var(--fontColor);
}

.about-section {
  margin: 40px 0;
  scroll-margin-top: 80px;
}

/* 赞赏区 */
.sponsorship-section {
  background: var(--white);
  border-radius: 10px;
  padding: 24px;
  text-align: center;
}

.sponsorship-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.sponsorship-img {
  width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sponsorship-tip {
  font-size: 13px;
  color: var(--greyFont);
}

/* 右侧 TOC */
.about-toc {
  position: sticky;
  top: 100px;
  float: right;
  width: 200px;
  margin-left: 20px;
  padding: 16px;
  background: var(--maxMaxLightGray, #f5f5f5);
  border-radius: 10px;
  font-size: 14px;
}

.toc-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--fontColor);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  padding: 4px 0;
  color: var(--greyFont);
  cursor: pointer;
  transition: color 0.2s;
}

.toc-item:hover,
.toc-active {
  color: var(--themeBackground);
}

/* 响应式：移动端 TOC 隐藏 */
@media (max-width: 1100px) {
  .about-toc {
    display: none;
  }
}

@media (max-width: 700px) {
  .about-info {
    flex-direction: column;
  }
}
</style>
