<template>{{ display }}</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  /** 目标数值 */
  value?: number | null
  /** 增长动画时长（毫秒） */
  duration?: number
  /** 自定义格式化，默认取整输出 */
  formatter?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  duration: 900,
})

const format = (value: number): string =>
  props.formatter ? props.formatter(value) : String(Math.round(value))

const current = ref(0)
const display = computed(() => format(current.value))

let rafId = 0

const stop = (): void => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

const animateTo = (target: number): void => {
  stop()
  if (!Number.isFinite(target)) {
    target = 0
  }
  // 系统开启“减少动态效果”时直接展示终值
  if (
    props.duration <= 0 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    current.value = target
    return
  }
  const from = current.value
  if (from === target) return

  const start = performance.now()
  const tick = (now: number): void => {
    const progress = Math.min((now - start) / props.duration, 1)
    // easeOutCubic：先快后慢，接近目标值时更平滑
    const eased = 1 - Math.pow(1 - progress, 3)
    current.value = from + (target - from) * eased
    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      current.value = target
      rafId = 0
    }
  }
  rafId = requestAnimationFrame(tick)
}

watch(
  () => Number(props.value) || 0,
  (target) => animateTo(target),
  { immediate: true },
)

onBeforeUnmount(stop)
</script>
