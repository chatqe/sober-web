import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

type ScrollDirection = 'up' | 'down'

// 方向反转防抖阈值：反向滚动累积超过该像素数才切换 direction，
// 避免阈值以上的轻微来回滚导致导航显隐抖动
const DIRECTION_THRESHOLD = 4

export const useScrollStore = defineStore('scroll', () => {
  const scrollY = ref(0)
  const scrollHeight = ref(0)
  const innerHeight = ref(0)
  const direction = ref<ScrollDirection>('up')

  const maxScroll = computed(() => Math.max(scrollHeight.value - innerHeight.value, 1))

  /** 0 ~ 1 阅读进度 */
  const progress = computed(() => Math.min(Math.max(scrollY.value / maxScroll.value, 0), 1))

  let rafId = 0
  let directionDistance = 0

  function measure(): void {
    scrollHeight.value = document.documentElement.scrollHeight
    innerHeight.value = window.innerHeight
  }

  function onScroll(): void {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      const prev = scrollY.value
      const next =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      const delta = next - prev
      scrollY.value = next

      // 无位移不处理
      if (Math.abs(delta) < 0.1) return

      const newDir: ScrollDirection = delta > 0 ? 'down' : 'up'
      // 同向滚动：重置反向累积
      if (newDir === direction.value) {
        directionDistance = 0
        return
      }
      // 反向滚动：累积到阈值才真正切换方向
      directionDistance += Math.abs(delta)
      if (directionDistance >= DIRECTION_THRESHOLD) {
        direction.value = newDir
        directionDistance = 0
      }
    })
  }

  function init(): void {
    measure()
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', measure, {passive: true})
  }

  function destroy(): void {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', measure)
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
    directionDistance = 0
  }

  return {
    scrollY,
    scrollHeight,
    innerHeight,
    direction,
    progress,
    init,
    destroy,
    measure,
  }
})
