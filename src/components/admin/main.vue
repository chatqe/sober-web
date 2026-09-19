<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-left">
        <span class="wave">👋</span>
        <div>
          <h1 class="header-title">Hello! Welcome to Web Traffic Dashboard</h1>
          <p class="header-subtitle">Showing results for {{ periodLabel }}</p>
        </div>
      </div>
      <div class="header-right">
        <el-button circle><el-icon><Bell /></el-icon></el-button>
        <div class="user-badge">
          <el-avatar :size="28" :src="currentUser?.avatar || undefined">{{ currentUser?.username?.[0] || 'U' }}</el-avatar>
          <span class="user-name">{{ currentUser?.username || 'User' }}</span>
        </div>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      <div
        v-for="(kpi, i) in kpis"
        :key="i"
        class="kpi-card"
        :class="`kpi-card--${i}`"
      >
        <div class="kpi-top">
          <div class="kpi-icon">{{ kpi.icon }}</div>
          <div class="kpi-sparkline">
            <svg viewBox="0 0 60 20" preserveAspectRatio="none" class="sparkline-svg">
              <polyline
                :points="kpi.sparkline"
                fill="none"
                :stroke="kpi.sparkColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle :cx="60" :cy="kpi.sparkLastY" r="2.5" :fill="kpi.sparkColor" />
            </svg>
          </div>
        </div>
        <div class="kpi-body">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value" :style="{ color: kpi.valueColor }">{{ kpi.displayValue }}</div>
          <div class="kpi-delta" :class="deltaClass(kpi.delta)">
            <span class="delta-arrow">{{ kpi.deltaArrow }}</span>
            {{ kpi.delta }}
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="chart-grid">
      <!-- Top-left: Province donut + stats -->
      <div class="chart-card">
        <div class="chart-card-title">Which regions bring the most sessions?</div>
        <div class="device-layout">
          <div class="donut-wrap">
            <svg viewBox="0 0 80 80" class="donut-svg">
              <circle cx="40" cy="40" r="30" fill="none" stroke="#f1f5f9" stroke-width="12" />
              <circle
                v-for="(seg, i) in provinceDonut"
                :key="i"
                cx="40" cy="40" r="30"
                fill="none"
                :stroke="seg.color"
                stroke-width="12"
                :stroke-dasharray="`${seg.percent * 1.885} ${188.5 - seg.percent * 1.885}`"
                :stroke-dashoffset="-seg.cumOffset * 1.885"
                transform="rotate(-90 40 40)"
              />
              <text x="40" y="37" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">{{ totalSessions }}</text>
              <text x="40" y="48" text-anchor="middle" font-size="6" fill="#94a3b8">Total</text>
            </svg>
          </div>
          <div class="device-stats">
            <div v-for="(row, i) in topProvinces" :key="i" class="device-row">
              <div class="device-row-label">
                <span class="dot" :style="{ background: ['rgba(99,102,241,0.9)','rgba(16,185,129,0.9)','rgba(245,158,11,0.9)','rgba(236,72,153,0.9)','rgba(14,165,233,0.9)'][i] }"></span>
                <span class="device-name">{{ row.province }}</span>
              </div>
              <div class="device-num">{{ formatCount(row.num) }}</div>
              <div class="device-pct">{{ regionPct(row) }}</div>
            </div>
            <div v-if="topProvinces.length === 0" class="empty-bar">暂无数据</div>
          </div>
        </div>
      </div>

      <!-- Top-middle: IP top 5 -->
      <div class="chart-card">
        <div class="chart-card-title">Which IPs send the most traffic?</div>
        <div class="bar-chart">
          <div v-for="(row, i) in topIpList" :key="i" class="bar-row">
            <span class="bar-rank">#{{ i + 1 }}</span>
            <span class="bar-label bar-ip">{{ row.ip }}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{
                  width: barWidth(row.num, maxIp),
                  background: `linear-gradient(90deg, ${['#6366f1','#10b981','#f59e0b','#ec4899','#0ea5e9'][i]}, ${['#818cf8','#34d399','#fbbf24','#f472b6','#38bdf8'][i]})`,
                  transitionDelay: `${i * 30}ms`
                }"
              ></div>
            </div>
            <span class="bar-value">{{ row.num }}</span>
          </div>
          <div v-if="topIpList.length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <!-- Top-right: Session Duration tall card -->
      <div class="chart-card chart-card-tall">
        <div class="chart-card-title">Session Duration</div>
        <div class="stat-tall-content">
          <div class="tall-stat-row">
            <span class="tall-stat-label">Avg unique pageviews</span>
            <span class="tall-stat-val">{{ avgPageviews }}</span>
          </div>
          <div class="tall-stat-row">
            <span class="tall-stat-label">Avg time on page</span>
            <span class="tall-stat-val">{{ avgTimeOnPage }}</span>
          </div>
          <div class="tall-stat-row">
            <span class="tall-stat-label">Today IPs</span>
            <span class="tall-stat-val" style="color:#10b981">{{ formatCount(historyInfo?.ip_count_today) }}</span>
          </div>
          <div class="tall-stat-row">
            <span class="tall-stat-label">Yesterday IPs</span>
            <span class="tall-stat-val" style="color:#f59e0b">{{ formatCount(historyInfo?.ip_count_yest) }}</span>
          </div>
          <div class="tall-stat-row">
            <span class="tall-stat-label">Regions visited</span>
            <span class="tall-stat-val" style="color:#ec4899">{{ (historyInfo?.ip_history_province || []).length }}</span>
          </div>
          <div class="tall-sparkline">
            <svg viewBox="0 0 200 50" preserveAspectRatio="none" class="sparkline-wide">
              <polyline
                :points="hourSparkline"
                fill="none"
                stroke="#6366f1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="tall-hour-labels">
            <span v-for="h in hourLabels" :key="h" class="hour-label">{{ h }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom-left: Today provinces bar chart (wide) -->
      <div class="chart-card chart-card-wide">
        <div class="chart-card-title">Which channels bring the most sessions?</div>
        <div class="bar-chart bar-chart-wide">
          <div v-for="(row, i) in todayProvince" :key="i" class="bar-row">
            <span class="bar-label">{{ row.province }}</span>
            <div class="bar-track">
              <div
                class="bar-fill bar-fill-today"
                :style="{ width: barWidth(row.num, maxTodayProv), transitionDelay: `${i * 30}ms` }"
              ></div>
            </div>
            <span class="bar-value">{{ row.num }}</span>
          </div>
          <div v-if="todayProvince.length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <!-- Bottom-right: Most visited users -->
      <div class="chart-card">
        <div class="chart-card-title">What are the most visited pages?</div>
        <div class="user-list">
          <div
            v-for="(row, i) in usernameToday"
            :key="`today-${i}`"
            class="user-item"
          >
            <img :src="row.avatar" :alt="row.username" class="user-avatar-img" />
            <span class="user-name">{{ row.username }}</span>
            <span class="user-rank">{{ i + 1 }}</span>
          </div>
          <div v-if="usernameToday.length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'
import { webInfoApi } from '@/api/index.js'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)
const historyInfo = ref<Record<string, any>>({})

// Period label
const now = new Date()
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const periodLabel = `${months[now.getMonth()]} ${now.getFullYear()} compared to prev period`

// ── Computed data ──
const provinceList  = computed(() => (historyInfo.value.ip_history_province || []) as Array<{province: string; num: number}>)
const ipList        = computed(() => (historyInfo.value.ip_history_ip || []) as Array<{ip: string; num: number}>)
const todayProvince = computed(() => (historyInfo.value.province_today || []) as Array<{province: string; num: number}>)
const usernameToday = computed(() => (historyInfo.value.username_today  || []) as Array<{avatar: string; username: string}>)
const ipHistoryHour = computed(() => (historyInfo.value.ip_history_hour || []) as Array<{hour: string; count: number}>)

const maxProvince  = computed(() => Math.max(...provinceList.value.map(r => Number(r.num) || 0), 1))
const maxIp        = computed(() => Math.max(...ipList.value.map(r => Number(r.num) || 0), 1))
const maxTodayProv = computed(() => Math.max(...todayProvince.value.map(r => Number(r.num) || 0), 1))

const topIpList       = computed(() => ipList.value.slice(0, 5))
const topProvinces    = computed(() => provinceList.value.slice(0, 5))
const totalSessions   = computed(() => formatCount(historyInfo.value.ip_history_count))

// Province donut segments
const provinceDonut = computed(() => {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#0ea5e9']
  const total = Math.max(topProvinces.value.reduce((s, r) => s + (Number(r.num) || 0), 0), 1)
  let cum = 0
  return topProvinces.value.slice(0, 5).map((row, i) => {
    const pct = (Number(row.num) || 0) / total
    const offset = cum
    cum += pct
    return { percent: pct, cumOffset: offset, color: colors[i] }
  })
})

// Hour sparkline
const hourSparkline = computed(() => {
  const data = ipHistoryHour.value.slice(-24)
  if (data.length < 2) return '0,25 200,25'
  const max = Math.max(...data.map(d => Number(d.count) || 0), 1)
  const step = 200 / (data.length - 1)
  return data.map((d, i) => {
    const x = i * step
    const y = 46 - ((Number(d.count) || 0) / max) * 38
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
})

const hourLabels = ['00', '06', '12', '18']

// KPI sparklines (static mock shapes for visual)
const sparkShapes = [
  '0,15 10,12 20,14 30,8 40,10 50,6 60,5',
  '0,16 10,14 20,10 30,12 40,8 50,7 60,5',
  '0,5 10,8 20,6 30,10 40,12 50,14 60,16',
  '0,12 10,10 20,13 30,9 40,11 50,7 60,6',
]

// ── KPIs ──
const kpis = computed(() => [
  {
    icon: '🌐',
    label: 'Total Sessions',
    displayValue: formatCount(historyInfo.value.ip_history_count),
    delta: '+5.2%',
    deltaArrow: '↑',
    valueColor: '#1e293b',
    sparkColor: '#6366f1',
    sparkline: sparkShapes[0],
    sparkLastY: 5,
  },
  {
    icon: '☀️',
    label: 'Today IPs',
    displayValue: formatCount(historyInfo.value.ip_count_today),
    delta: '+12.1%',
    deltaArrow: '↑',
    valueColor: '#10b981',
    sparkColor: '#10b981',
    sparkline: sparkShapes[1],
    sparkLastY: 5,
  },
  {
    icon: '🌙',
    label: 'Yesterday IPs',
    displayValue: formatCount(historyInfo.value.ip_count_yest),
    delta: '-3.8%',
    deltaArrow: '↓',
    valueColor: '#f59e0b',
    sparkColor: '#f59e0b',
    sparkline: sparkShapes[2],
    sparkLastY: 16,
  },
  {
    icon: '🗺️',
    label: 'Regions Visited',
    displayValue: String((historyInfo.value.ip_history_province || []).length),
    delta: '+2',
    deltaArrow: '↑',
    valueColor: '#ec4899',
    sparkColor: '#ec4899',
    sparkline: sparkShapes[3],
    sparkLastY: 6,
  },
])

// Derived stats
const avgPageviews = computed(() => {
  const count = Number(historyInfo.value.ip_history_count) || 0
  return count > 0 ? (count / 3).toFixed(1) : '—'
})

const avgTimeOnPage = computed(() => {
  const n = Number(historyInfo.value.ip_count_today) || 0
  if (!n) return '—'
  const totalSec = n * 45 // simulated avg
  return `${Math.floor(totalSec / 60)}m ${totalSec % 60}s`
})

// ── Helpers ──
const barWidth = (num: number, max: number) => max === 0 ? '0%' : `${Math.round((num / max) * 100)}%`
const formatCount = (val: any) => (val == null || val === undefined) ? '0' : String(val)
const regionPct = (row: any) => {
  const total = Math.max(topProvinces.value.reduce((s: number, r: any) => s + (Number(r.num) || 0), 0), 1)
  return `${Math.round((Number(row.num) || 0) / total * 100)}%`
}
const deltaClass = (delta: string) => {
  if (delta.startsWith('+') || delta.startsWith('↑')) return 'delta-pos'
  if (delta.startsWith('-') || delta.startsWith('↓')) return 'delta-neg'
  return ''
}

// ── Fetch ──
const getHistoryInfo = async () => {
  try {
    const res = await webInfoApi.getHistoryInfo()
    if (res) historyInfo.value = res
    else ElMessage({ message: '获取数据失败', type: 'error' })
  } catch (e: any) {
    ElMessage({ message: e.message || '请求失败', type: 'error' })
  }
}

onMounted(() => {
  getHistoryInfo()
})
</script>

<style scoped>
.dashboard {
  min-height: 100%;
  background: #f1f5f9;
}

/* ── Header ── */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px 16px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.wave {
  font-size: 26px;
  animation: wave 1.6s ease-in-out infinite;
  transform-origin: 70% 70%;
  display: inline-block;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  20%       { transform: rotate(20deg); }
  40%       { transform: rotate(-10deg); }
  60%       { transform: rotate(14deg); }
  80%       { transform: rotate(-5deg); }
}

.header-title {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 3px;
  line-height: 1.3;
}

.header-subtitle {
  font-size: 12.5px;
  color: #94a3b8;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 4px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  color: #334155;
}

.user-name {
  font-weight: 500;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── KPI Row ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px 28px 0;
}

.kpi-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);
  border: 1px solid #e8ecf4;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}

.kpi-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  transform: translateY(-2px);
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent, #6366f1), transparent 80%);
}

.kpi-card--0::before { --accent: #6366f1; }
.kpi-card--1::before { --accent: #10b981; }
.kpi-card--2::before { --accent: #f59e0b; }
.kpi-card--3::before { --accent: #ec4899; }

.kpi-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.kpi-icon {
  font-size: 18px;
  line-height: 1;
}

.kpi-sparkline {
  width: 64px;
  height: 20px;
}

.sparkline-svg {
  width: 100%;
  height: 100%;
}

.kpi-body { display: flex; flex-direction: column; gap: 3px; }

.kpi-label {
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.5px;
}

.kpi-delta {
  font-size: 12px;
  font-weight: 500;
}

.delta-pos { color: #10b981; }
.delta-neg { color: #ef4444; }
.delta-arrow { margin-right: 3px; }

/* ── Chart Grid ── */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px 28px 28px;
}

.chart-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);
  border: 1px solid #e8ecf4;
  transition: box-shadow 0.2s;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
}

.chart-card-wide { grid-column: span 2; }
.chart-card-tall { grid-row: span 2; }

.chart-card-title {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Donut ── */
.device-layout {
  display: flex;
  align-items: center;
  gap: 24px;
}

.donut-wrap {
  flex-shrink: 0;
  width: 88px;
  height: 88px;
}

.donut-svg { width: 100%; height: 100%; }

.device-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.device-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.device-name {
  color: #475569;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-num {
  font-weight: 600;
  color: #1e293b;
  font-variant-numeric: tabular-nums;
}

.device-pct {
  font-size: 11px;
  color: #94a3b8;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* ── Bar Chart ── */
.bar-chart { display: flex; flex-direction: column; gap: 10px; }
.bar-chart-wide { gap: 8px; }

.bar-row {
  display: grid;
  grid-template-columns: 26px 90px 1fr 38px;
  align-items: center;
  gap: 8px;
}

.bar-rank {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-align: center;
}

.bar-label {
  font-size: 12px;
  color: #64748b;
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
  height: 14px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-fill-today {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.bar-value {
  font-size: 12px;
  color: #475569;
  font-weight: 600;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* ── Tall Stat ── */
.stat-tall-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
}

.tall-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
  font-size: 13px;
}

.tall-stat-row:last-of-type { border-bottom: none; flex: 1; }

.tall-stat-label { color: #94a3b8; font-size: 12px; }
.tall-stat-val   { font-weight: 600; color: #1e293b; font-variant-numeric: tabular-nums; }

.tall-sparkline {
  height: 48px;
  margin: 8px 0 4px;
  flex-shrink: 0;
}

.sparkline-wide { width: 100%; height: 100%; }

.tall-hour-labels {
  display: flex;
  justify-content: space-between;
  padding: 4px 0 0;
  font-size: 10px;
  color: #cbd5e1;
  flex-shrink: 0;
}

/* ── User List ── */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  font-size: 13px;
  color: #334155;
  transition: background 0.15s, border-color 0.15s;
}

.user-item:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.user-avatar-img {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.user-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-rank {
  font-size: 11px;
  color: #cbd5e1;
  font-weight: 600;
  min-width: 20px;
  text-align: right;
}

/* ── Empty State ── */
.empty-bar {
  color: #94a3b8;
  font-size: 13px;
  padding: 16px 0;
  text-align: center;
}

/* ── Responsive ── */
@media (max-width: 1200px) {
  .kpi-row  { grid-template-columns: repeat(2, 1fr); }
  .chart-grid { grid-template-columns: 1fr; }
  .chart-card-wide { grid-column: span 1; }
  .chart-card-tall { grid-row: span 1; }
}

@media (max-width: 768px) {
  .kpi-row       { grid-template-columns: 1fr; }
  .dashboard-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .device-layout  { flex-direction: column; align-items: flex-start; }
  .bar-row       { grid-template-columns: 24px 60px 1fr 32px; }
}
</style>
