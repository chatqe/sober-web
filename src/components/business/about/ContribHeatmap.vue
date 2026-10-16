<template>
  <div class="contrib-heatmap shadow-box">
    <div class="contrib-header">
      <span class="contrib-title">Github Activities</span>
      <div class="contrib-nav">
        <el-button class="contrib-year-btn" :disabled="year <= minYear" @click="prevYear">&laquo;</el-button>
        <span class="contrib-year">{{ year }} contributions</span>
        <el-button class="contrib-year-btn" :disabled="year >= maxYear" @click="nextYear">&raquo;</el-button>
      </div>
    </div>

    <div v-if="loading" class="contrib-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中…</span>
    </div>

    <div v-else class="contrib-body">
      <div class="contrib-count-line">
        <strong>{{ total }} contributions in {{ year }}</strong>
      </div>

      <div class="contrib-scroll">
        <div class="contrib-chart">
          <!-- 月份刻度 -->
          <div class="contrib-months">
            <span
              v-for="(m, i) in monthMarks"
              :key="i"
              class="contrib-month"
              :style="{ left: m.offset + '%' }"
            >{{ m.label }}</span>
          </div>

          <!-- 周次格子：grid-flow-column 让 7 列按周换列 -->
          <div class="contrib-grid-wrap">
            <div class="contrib-weekdays">
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>
            <div class="contrib-grid">
              <div
                v-for="(day, i) in days"
                :key="i"
                class="contrib-cell"
                :class="levelClass(day.count)"
                :title="day.title"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="contrib-legend">
        <span>Less</span>
        <i v-for="lv in 5" :key="lv" class="legend-cell" :class="'lv' + lv"></i>
        <span>More</span>
      </div>
    </div>
  </div>

  <div v-if="!loading && !weeks.length" class="contrib-empty">
    GitHub 贡献数据暂未接入，接口就绪后展示
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { getGitHubContributions } from '@/api/modules/about'
import type { GitHubWeekData } from '@/api/modules/about'

// ===== 数据获取 =====
const maxYear = new Date().getFullYear()
const minYear = maxYear - 3
const year = ref(maxYear)
const loading = ref(true)
const weeks = ref<GitHubWeekData[]>([])
const total = ref(0)

async function load(): Promise<void> {
  loading.value = true
  try {
    const res = await getGitHubContributions(year.value)
    weeks.value = res.weeks ?? []
    total.value = res.total ?? 0
  } catch (e) {
    console.error('[contrib heatmap] load failed', e)
  } finally {
    loading.value = false
  }
}

function prevYear(): void {
  if (year.value > minYear) {
    year.value -= 1
    weeks.value = []
    load()
  }
}

function nextYear(): void {
  if (year.value < maxYear) {
    year.value += 1
    weeks.value = []
    load()
  }
}

onMounted(load)

// ===== 展示派生 =====
/** 5 级色阶阈值（对齐 GitHub 视觉密度） */
const LEVELS = [0, 1, 5, 15] as const

function levelClass(count: number | null | undefined): string {
  const n = count ?? 0
  if (n <= 0) return 'lv0'
  if (n <= LEVELS[0]) return 'lv1'
  if (n <= LEVELS[1]) return 'lv2'
  if (n <= LEVELS[2]) return 'lv3'
  return 'lv4'
}

interface DayCell {
  weekIndex: number
  dayIndex: number
  count: number | null
  title: string
}

/** 展平为 7 × weeks.length 的格子（按列渲染时 week-major 顺序） */
const days = computed<DayCell[]>(() => {
  const list: DayCell[] = []
  weeks.value.forEach((week, wi) => {
    const [y, m, d] = week.date.split('-').map(Number)
    const monday = new Date(y, m - 1, d)
    for (let di = 0; di < 7; di++) {
      const date = new Date(monday.getTime() + di * 86400000)
      const inRange = di === 0 || date.getFullYear() === year.value
      const count = inRange ? (week.counts?.[di] ?? 0) : 0
      list.push({
        weekIndex: wi,
        dayIndex: di,
        count: inRange ? count : null,
        title: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}: ${count} contributions`,
      })
    }
  })
  return list
})

/** 月份刻度：每 4 周标一个，避开左端重叠 */
const monthMarks = computed(() => {
  const marks: { label: string; offset: number }[] = []
  const totalWeeks = weeks.value.length
  if (!totalWeeks) return marks
  const monthLabel: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let lastMarked = -1
  for (let w = 3; w < totalWeeks; w += 4) {
    const [y, m] = weeks.value[w].date.split('-').map(Number)
    if (m !== lastMarked) {
      lastMarked = m
      marks.push({ label: monthLabel[m - 1], offset: (w / totalWeeks) * 100 })
    }
  }
  return marks
})
</script>

<style scoped>
.contrib-heatmap {
  background: var(--white);
  border-radius: 10px;
  padding: 20px 24px;
  margin: 16px 0;
}

.contrib-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.contrib-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--black, #333);
}

.contrib-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contrib-year {
  font-size: 14px;
  color: var(--greyFont);
}

.contrib-year-btn {
  min-width: 32px;
  padding: 4px 8px;
  font-size: 14px;
}

.contrib-state {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--greyFont);
  padding: 20px 0;
}

.contrib-count-line {
  font-size: 14px;
  color: var(--greyFont);
  margin-bottom: 12px;
}

.contrib-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}

.contrib-chart {
  min-width: 560px;
  position: relative;
}

.contrib-months {
  position: relative;
  height: 18px;
  margin-left: 44px;
  font-size: 12px;
  color: var(--greyFont);
}

.contrib-month {
  position: absolute;
  transform: translateX(-50%);
}

.contrib-grid-wrap {
  display: flex;
}

.contrib-weekdays {
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  color: var(--greyFont);
}

.contrib-weekdays span {
  height: 13px;
  line-height: 13px;
}

/* 格子：grid-flow_column 7 行自动换列，格子 13px + 2px 间距（GitHub 同款尺寸） */
.contrib-grid {
  display: grid;
  grid-template-rows: repeat(7, 13px);
  grid-auto-flow: column;
  grid-auto-columns: 13px;
  gap: 2px;
}

.contrib-cell {
  width: 13px;
  height: 13px;
  border-radius: 2px;
  cursor: default;
}

.contrib-cell.lv0 { background: #ebedf0; }
.contrib-cell.lv1 { background: #9be9a8; }
.contrib-cell.lv2 { background: #40c463; }
.contrib-cell.lv3 { background: #30a14e; }
.contrib-cell.lv4 { background: #216e39; }

/* 深色主题下格子底色调深 */
[data-theme='dark'] .contrib-cell.lv0 { background: #161b22; }
[data-theme='dark'] .contrib-cell.lv1 { background: #0e4429; }
[data-theme='dark'] .contrib-cell.lv2 { background: #006d32; }
[data-theme='dark'] .contrib-cell.lv3 { background: #008a3e; }
[data-theme='dark'] .contrib-cell.lv4 { background: #00a94d; }

.contrib-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 12px;
  color: var(--greyFont);
  margin-top: 10px;
}

.legend-cell {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-cell.lv1 { background: #9be9a8; }
.legend-cell.lv2 { background: #40c463; }
.legend-cell.lv3 { background: #30a14e; }
.legend-cell.lv4 { background: #216e39; }

.contrib-empty {
  text-align: center;
  color: var(--greyFont);
  padding: 20px 0;
  font-size: 14px;
}
</style>
