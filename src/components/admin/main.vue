<template>
  <div class="dashboard" :class="{ loaded: isLoaded }">
    <div class="page-title">数据概览</div>

    <!-- KPI 卡片行 -->
    <div class="kpi-row">
      <div class="kpi-card" :style="{ '--accent': accentColor[0] }">
        <div class="kpi-label">📊 总访问量</div>
        <div class="kpi-value">{{ formatCount(historyInfo.ip_history_count) }}</div>
        <div class="kpi-sub">每个IP每天记一次</div>
      </div>
      <div class="kpi-card" :style="{ '--accent': accentColor[1] }">
        <div class="kpi-label">☀️ 今日访问</div>
        <div class="kpi-value kpi-today">{{ formatCount(historyInfo.ip_count_today) }}</div>
        <div class="kpi-sub">今日独立IP数</div>
      </div>
      <div class="kpi-card" :style="{ '--accent': accentColor[2] }">
        <div class="kpi-label">🌙 昨日访问</div>
        <div class="kpi-value kpi-yest">{{ formatCount(historyInfo.ip_count_yest) }}</div>
        <div class="kpi-sub">昨日独立IP数</div>
      </div>
      <div class="kpi-card" :style="{ '--accent': accentColor[3] }">
        <div class="kpi-label">🗺️ 省份分布</div>
        <div class="kpi-value kpi-province">{{ provinceCount }}</div>
        <div class="kpi-sub">访问省份总数</div>
      </div>
    </div>

    <!-- 横向条形图区域 -->
    <div class="chart-grid">
      <div class="chart-card">
        <div class="chart-card-title">省份访问 TOP10（总览）</div>
        <div class="bar-chart">
          <div v-for="(row, i) in provinceList" :key="i" class="bar-row">
            <span class="bar-label">{{ row.province }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: provinceWidths[i] }"></div>
            </div>
            <span class="bar-value">{{ row.num }}</span>
          </div>
          <div v-if="provinceList.length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">IP访问 TOP10（总览）</div>
        <div class="bar-chart">
          <div v-for="(row, i) in ipList" :key="i" class="bar-row">
            <span class="bar-label bar-ip">{{ row.ip }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: ipWidths[i] }"></div>
            </div>
            <span class="bar-value">{{ row.num }}</span>
          </div>
          <div v-if="ipList.length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">今日访问省份统计</div>
        <div class="bar-chart">
          <div v-for="(row, i) in todayProvinceList" :key="i" class="bar-row">
            <span class="bar-label">{{ row.province }}</span>
            <div class="bar-track">
              <div class="bar-fill bar-fill-today" :style="{ width: todayProvinceWidths[i] }"></div>
            </div>
            <span class="bar-value">{{ row.num }}</span>
          </div>
          <div v-if="todayProvinceList.length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">今日访问用户</div>
        <div class="user-list">
          <div v-for="(row, i) in todayUserList" :key="i" class="user-item">
            <img :src="row.avatar" class="user-avatar" :alt="row.username" />
            <span class="user-name">{{ row.username }}</span>
          </div>
          <div v-if="todayUserList.length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <div class="chart-card chart-card-wide">
        <div class="chart-card-title">昨日访问用户</div>
        <div class="user-list">
          <div v-for="(row, i) in yestUserList" :key="i" class="user-item">
            <img :src="row.avatar" class="user-avatar" :alt="row.username" />
            <span class="user-name">{{ row.username }}</span>
          </div>
          <div v-if="yestUserList.length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { webInfoApi } from '@/api/index.js'

const loading = ref(false)
const isLoaded = ref(false)
const historyInfo = ref<Record<string, any>>({})

const accentColor = ['#6366f1', '#10b981', '#f59e0b', '#ec4899']

// 直接取 slice，避免模板里重复调用
const provinceList   = computed(() => (historyInfo.value.ip_history_province  || []).slice(0, 10))
const ipList         = computed(() => (historyInfo.value.ip_history_ip        || []).slice(0, 10))
const todayProvinceList = computed(() => (historyInfo.value.province_today     || []).slice(0, 10))
const todayUserList      = computed(() => (historyInfo.value.username_today   || []).slice(0, 8))
const yestUserList       = computed(() => (historyInfo.value.username_yest    || []).slice(0, 12))

const provinceCount = computed(() => (historyInfo.value.ip_history_province || []).length)

// 预计算每条 bar 的宽度，渲染时直接读数组，不再现场 Math.max
const provinceWidths   = computed(() => computeWidths(provinceList.value))
const ipWidths         = computed(() => computeWidths(ipList.value))
const todayProvinceWidths = computed(() => computeWidths(todayProvinceList.value))

function computeWidths(arr: any[]) {
  if (!arr.length) return arr.map(() => '0%')
  const max = Math.max(...arr.map((r: any) => Number(r.num) || 0), 1)
  return arr.map((r: any) => max === 0 ? '0%' : `${Math.round((Number(r.num) || 0) / max * 100)}%`)
}

const getHistoryInfo = async () => {
  loading.value = true
  try {
    const res = await webInfoApi.getHistoryInfo()
    if (res) {
      historyInfo.value = res
      // 数据到达即标记，bar 直接在目标宽度渲染，无动画闪烁
      isLoaded.value = true
    } else {
      ElMessage({ message: '获取数据失败', type: 'error' })
    }
  } catch (error: any) {
    ElMessage({ message: error.message || '请求失败', type: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getHistoryInfo()
})
</script>

<style scoped>
.dashboard {
  min-height: 100%;
  /* 单层纯色背景，消除多层渐变合成开销 */
  background: #f1f5f9;
  padding: 0;
  border-radius: 8px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  padding: 24px 24px 0;
  margin-bottom: 20px;
}

/* ── KPI 卡片行 ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 24px 20px;
}

.kpi-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 22px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #e2e8f0;
  /* 用 inset box-shadow 替代 ::before，省去伪元素合成 */
  box-shadow:
    0 1px 3px rgba(0,0,0,0.06),
    0 1px 2px rgba(0,0,0,0.04),
    inset 0 3px 0 0 var(--accent, #6366f1);
  position: relative;
}

.kpi-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.kpi-today { color: #10b981; }
.kpi-yest  { color: #f59e0b; }
.kpi-province { color: #ec4899; }

.kpi-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}

/* ── 图表网格 ── */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 0 24px 24px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #e2e8f0;
}

.chart-card-wide {
  grid-column: span 2;
}

.chart-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

/* ── 横向条形图 ── */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-label {
  width: 80px;
  font-size: 12px;
  color: #64748b;
  text-align: right;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-ip {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #94a3b8;
}

.bar-track {
  flex: 1;
  height: 18px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #818cf8);
  border-radius: 4px;
  /* 仅在 loaded 后才启动过渡，数据到来时直接渲染目标宽度，不闪烁 */
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.dashboard.loaded .bar-fill {
  /* loaded 后才有过渡，之前宽度按 0% 渲染但不触发动画 */
}

.bar-fill-today {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.bar-value {
  width: 36px;
  font-size: 12px;
  color: #475569;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
}

/* ── 用户列表 ── */
.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #334155;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

.user-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 空状态 ── */
.empty-bar {
  color: #94a3b8;
  font-size: 13px;
  padding: 12px 0;
  text-align: center;
}

/* ── 加载遮罩 ── */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 999;
  font-size: 14px;
  color: #64748b;
}

.loading-overlay .el-icon {
  font-size: 28px;
  color: #6366f1;
}
</style>
