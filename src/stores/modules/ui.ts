import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useUiStore = defineStore('ui', () => {
  // 鼠标点击动画开关
  const mouseAnimation = ref(false)

  function toggleMouseAnimation(): void {
    mouseAnimation.value = !mouseAnimation.value
  }

  // 暗黑模式
  const isDark = ref(false)

  function changeColor(): void {
    isDark.value = !isDark.value
    const root = document.querySelector<HTMLElement>(':root')
    if (!root) return
    if (isDark.value) {
      root.style.setProperty('--background', '#272727')
      root.style.setProperty('--fontColor', 'white')
      root.style.setProperty('--borderColor', '#4F4F4F')
      root.style.setProperty('--borderHoverColor', 'black')
      root.style.setProperty('--articleFontColor', '#E4E4E4')
      root.style.setProperty('--articleGreyFontColor', '#D4D4D4')
      root.style.setProperty('--commentContent', '#D4D4D4')
      root.style.setProperty('--favoriteBg', '#1e1e1e')
    } else {
      root.style.setProperty('--background', 'white')
      root.style.setProperty('--fontColor', 'black')
      root.style.setProperty('--borderColor', 'rgba(0, 0, 0, 0.5)')
      root.style.setProperty('--borderHoverColor', 'rgba(110, 110, 110, 0.4)')
      root.style.setProperty('--articleFontColor', '#1F1F1F')
      root.style.setProperty('--articleGreyFontColor', '#616161')
      root.style.setProperty('--commentContent', '#F7F9FE')
      root.style.setProperty('--favoriteBg', '#f7f9fe')
    }
  }

  // 移动端抽屉开关
  const toolbarDrawer = ref(false)

  function openToolbarDrawer(): void {
    toolbarDrawer.value = true
  }

  function closeToolbarDrawer(): void {
    toolbarDrawer.value = false
  }

  // 登录弹窗开关
  const showAuthModal = ref(false)

  function openAuthModal(): void {
    showAuthModal.value = true
  }

  function closeAuthModal(): void {
    showAuthModal.value = false
  }

  // 移动端判断（由 resize 事件驱动）
  const mobile = ref(false)

  function setMobile(isMobile: boolean): void {
    mobile.value = isMobile
  }

  return {
    mouseAnimation,
    toggleMouseAnimation,
    isDark,
    changeColor,
    toolbarDrawer,
    openToolbarDrawer,
    closeToolbarDrawer,
    showAuthModal,
    openAuthModal,
    closeAuthModal,
    mobile,
    setMobile,
  }
})
