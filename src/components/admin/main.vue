<template>
  <div class="dashboard">
    <div class="page-title">数据概览</div>

    <!-- KPI 卡片行 -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">📊 总访问量</div>
        <div class="kpi-value">{{ formatCount(historyInfo.ip_history_count) }}</div>
        <div class="kpi-sub">每个IP每天记一次</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">☀️ 今日访问</div>
        <div class="kpi-value kpi-today">{{ formatCount(historyInfo.ip_count_today) }}</div>
        <div class="kpi-sub">今日独立IP数</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">🌙 昨日访问</div>
        <div class="kpi-value kpi-yest">{{ formatCount(historyInfo.ip_count_yest) }}</div>
        <div class="kpi-sub">昨日独立IP数</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">🗺️ 省份分布</div>
        <div class="kpi-value kpi-province">{{ (historyInfo.ip_history_province || []).length }}</div>
        <div class="kpi-sub">访问省份总数</div>
      </div>
    </div>

    <!-- 横向条形图区域 -->
    <div class="chart-grid">
      <!-- 省份访问TOP10（总览） -->
      <div class="chart-card">
        <div class="chart-card-title">省份访问 TOP10（总览）</div>
        <div class="bar-chart">
          <div
            v-for="(row, i) in (historyInfo.ip_history_province || []).slice(0, 10)"
            :key="i"
            class="bar-row"
          >
            <span class="bar-label">{{ row.province }}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: barWidth(row.num, historyInfo.ip_history_province) }"
              ></div>
            </div>
            <span class="bar-value">{{ row.num }}</span>
          </div>
          <div v-if="(historyInfo.ip_history_province || []).length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <!-- IP访问TOP10（总览） -->
      <div class="chart-card">
        <div class="chart-card-title">IP访问 TOP10（总览）</div>
        <div class="bar-chart">
          <div
            v-for="(row, i) in (historyInfo.ip_history_ip || []).slice(0, 10)"
            :key="i"
            class="bar-row"
          >
            <span class="bar-label bar-ip">{{ row.ip }}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: barWidth(row.num, historyInfo.ip_history_ip) }"
              ></div>
            </div>
            <span class="bar-value">{{ row.num }}</span>
          </div>
          <div v-if="(historyInfo.ip_history_ip || []).length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <!-- 今日访问省份统计 -->
      <div class="chart-card">
        <div class="chart-card-title">今日访问省份统计</div>
        <div class="bar-chart">
          <div
            v-for="(row, i) in (historyInfo.province_today || []).slice(0, 10)"
            :key="i"
            class="bar-row"
          >
            <span class="bar-label">{{ row.province }}</span>
            <div class="bar-track">
              <div
                class="bar-fill bar-fill-today"
                :style="{ width: barWidth(row.num, historyInfo.province_today) }"
              ></div>
            </div>
            <span class="bar-value">{{ row.num }}</span>
          </div>
          <div v-if="(historyInfo.province_today || []).length === 0" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <!-- 今日访问用户 -->
      <div class="chart-card">
        <div class="chart-card-title">今日访问用户</div>
        <div class="user-list">
          <div
            v-for="(row, i) in (historyInfo.username_today || []).slice(0, 8)"
            :key="i"
            class="user-item"
          >
            <el-avatar :size="32" :src="row.avatar" class="user-avatar"/>
            <span class="user-name">{{ row.username }}</span>
          </div>
          <div v-if="!(historyInfo.username_today || []).length" class="empty-bar">暂无数据</div>
        </div>
      </div>

      <!-- 昨日访问用户 -->
      <div class="chart-card chart-card-wide">
        <div class="chart-card-title">昨日访问用户</div>
        <div class="user-list">
          <div
            v-for="(row, i) in (historyInfo.username_yest || []).slice(0, 12)"
            :key="i"
            class="user-item"
          >
            <el-avatar :size="32" :src="row.avatar" class="user-avatar"/>
            <span class="user-name">{{ row.username }}</span>
          </div>
          <div v-if="!(historyInfo.username_yest || []).length" class="empty-bar">暂无数据</div>
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { webInfoApi } from '@/api/index.js'

const loading = ref(false)
const historyInfo = ref<Record<string, any>>({})

const formatCount = (val: any) => {
  if (val == null || val === undefined) return '0'
  return String(val)
}

const barMax = (arr: any[]) => {
  if (!arr || !arr.length) return 1
  return Math.max(...arr.map((r: any) => Number(r.num) || 0), 1)
}

const barWidth = (num: number, arr: any[]) => {
  const max = barMax(arr)
  if (max === 0) return '0%'
  return `${Math.round((num / max) * 100)}%`
}

const getHistoryInfo = async () => {
  loading.value = true
  try {
    const res = await webInfoApi.getHistoryInfo()
    if (res) {
      historyInfo.value = res
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
  background:
    radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(16,185,129,0.06) 0%, transparent 50%),
    linear-gradient(180deg, #f0f4ff 0%, #f1f5f9 100%);
  padding: 0;
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
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #818cf8);
  border-radius: 12px 12px 0 0;
}

.kpi-card:nth-child(2)::before {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.kpi-card:nth-child(3)::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.kpi-card:nth-child(4)::before {
  background: linear-gradient(90deg, #ec4899, #f472b6);
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
  transition: width 0.6s ease;
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
  flex-shrink: 0;
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
