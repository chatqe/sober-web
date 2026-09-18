<template>
  <div>
    <!-- 画布 -->
    <div style="padding: 5px" @mousemove="canvasOutMove($event)" @touchmove="canvasOutMove($event)">
      <div class="graffiti-container">
        <canvas id="canvas"
                ref="canvasRef"
                width="766"
                height="400"
                @mousedown="canvasDown($event)"
                @mouseup="canvasUp($event)"
                @mousemove="canvasMove($event)"
                @touchstart="canvasDown($event)"
                @touchend="canvasUp($event)"
                @touchmove="canvasMove($event)">
        </canvas>
      </div>
    </div>

    <div style="padding: 10px 0 0 5px;">
      <!-- 颜色 -->
      <div class="graffiti-tools">
        <span class="graffiti-title">画笔颜色</span>
        <div class="myCenter" style="margin-left: 2rem">
          <div v-for="(color, index) in colors"
               :class="{ activeColor: config.lineColor === color }"
               :style="{ background: color }"
               @click="setColor(color)"
               class="graffiti-color"
               :key="index">
          </div>
        </div>
      </div>

      <!-- 大小 -->
      <div class="graffiti-tools">
        <span class="graffiti-title">画笔大小</span>
        <div class="myCenter" style="margin-left: 2rem">
          <el-icon v-for="(pen, index) in brushSize"
             :key="index"
             class="graffiti-size"
             :class="[pen.className, { activeSize: config.lineWidth === pen.lineWidth }]"
             @click="setBrush(pen.lineWidth)">
          <Edit />
          </el-icon>
        </div>
      </div>

      <!-- 操作 -->
      <div class="graffiti-tools">
        <span class="graffiti-title">操作</span>
        <div class="myCenter" style="margin-left: 3.7rem">
          <el-icon v-for="(control, index) in controls"
             :title="control.title"
             :class="control.className"
             class="graffiti-operate"
             @click="controlCanvas(control.action)"
             :key="index">
          <component :is="control.icon" />
          </el-icon>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="graffiti-tools" style="justify-content: center">
        <proButton :info="'文字'"
                   @click.native="showComment()"
                   :before="$constant.before_color_1"
                   :after="$constant.after_color_1"
                   style="margin-right: 6px">
        </proButton>
        <proButton :info="'提交'"
                   @click.native="getImage()"
                   :before="$constant.before_color_2"
                   :after="$constant.after_color_2">
        </proButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted, inject } from 'vue'
  import { ElMessage, ElIcon } from 'element-plus'
  import { Edit, ArrowLeft, ArrowRight, Refresh } from '@element-plus/icons-vue'
  import { useUserStore } from '@/stores'
  import { uploadApi, qiniuApi } from '@/api/index.js'
  import { defineAsyncComponent } from 'vue'

  // 定义接口
  interface CommonUtils {
    isEmpty: (value: any) => boolean;
    saveResource: (prefix: string | null, type: string, url: string, size: number, mimeType: string, originalName: string | null, storeType: string) => void;
  }

  interface AppConstants {
    before_color_1: string;
    after_color_1: string;
    before_color_2: string;
    after_color_2: string;
    qiniuUrl: string;
    qiniuDownload: string;
    [key: string]: any;
  }

  interface User {
    id: number;
    username: string;
    [key: string]: any;
  }

  interface Config {
    lineWidth: number;
    lineColor: string;
    shadowBlur: number;
  }

  interface BrushSize {
    className: string;
    lineWidth: number;
    icon: string;
  }

  interface Control {
    title: string;
    action: string;
    icon: any;
    className: string;
  }
  
  // 动态导入组件
  const proButton = defineAsyncComponent(() => import("../common/proButton.vue"))
  
  // 注入全局属性
  const $common = inject<CommonUtils>('$common')!
  const $constant = inject<AppConstants>('$constant')!
  
  // 定义事件
  const emit = defineEmits<{
    (e: 'showComment'): void;
    (e: 'addGraffitiComment', img: string): void;
  }>()
  
  // 状态管理
  const userStore = useUserStore()
  
  // 画布引用
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const canvasMoveUse = ref<boolean>(false)
  const context = ref<CanvasRenderingContext2D | null>(null)
  // 存储当前表面状态数组-上一步
  const preDrawAry = ref<ImageData[]>([])
  // 存储当前表面状态数组-下一步
  const nextDrawAry = ref<ImageData[]>([])
  // 中间数组
  const middleAry = ref<ImageData[]>([])
  // 配置参数
  const config = reactive<Config>({
    lineWidth: 5,
    lineColor: "#8154A3",
    shadowBlur: 2,
  })
  
  const colors = ["#8154A3", "#fef4ac", "#0018ba", "#ffc200", "#f32f15", "#cccccc", "#5ab639"]
  const brushSize = ref<BrushSize[]>([
    {
      className: "small",
      lineWidth: 5,
      icon: 'Edit'
    }, {
      className: "middle",
      lineWidth: 10,
      icon: 'Edit'
    }, {
      className: "big",
      lineWidth: 15,
      icon: 'Edit'
    }
  ])
  
  // 计算属性
  const controls = computed<Control[]>(() => {
    return [{
      title: "上一步",
      action: "prev",
      icon: ArrowLeft,
      className: preDrawAry.value.length
        ? "active"
        : "ban",
    }, {
      title: "下一步",
      action: "next",
      icon: ArrowRight,
      className: nextDrawAry.value.length
        ? "active"
        : "ban",
    }, {
      title: "清除",
      action: "clear",
      icon: Refresh,
      className:
        preDrawAry.value.length || nextDrawAry.value.length
          ? "active"
          : "ban",
    }]
  })
  
  onMounted((): void => {
    if (canvasRef.value) {
      context.value = canvasRef.value.getContext("2d", {willReadFrequently: true})
      initDraw()
      setCanvasStyle()
    }
  })
    // 方法定义
      function canvasOutMove(e: MouseEvent | TouchEvent): void {
        if (canvasRef.value && e.target !== canvasRef.value) {
          canvasMoveUse.value = false
        }
      }
      
      function initDraw(): void {
        if (!context.value) return
        const preData = context.value.getImageData(0, 0, 1200, 600)
        // 空绘图表面进栈
        middleAry.value.push(preData)
      }
      
      function canvasUp(e: MouseEvent | TouchEvent): void {
        if (!context.value) return
        const preData = context.value.getImageData(0, 0, 1200, 600)
        if (!nextDrawAry.value.length) {
          // 当前绘图表面进栈
          middleAry.value.push(preData)
        } else {
          middleAry.value = []
          middleAry.value = middleAry.value.concat(preDrawAry.value)
          middleAry.value.push(preData)
          nextDrawAry.value = []
        }
        canvasMoveUse.value = false
        context.value.beginPath()
      }
      
      function canvasDown(e: MouseEvent | TouchEvent): void {
        canvasMoveUse.value = true
        // client是基于整个页面的坐标
        // offset是canvas距离顶部以及左边的距离
        setCanvasStyle()
        // 清除子路径
        if (!context.value) return
        context.value.beginPath()
        context.value.moveTo((e as MouseEvent).layerX, (e as MouseEvent).layerY)
        // 当前绘图表面状态
        const preData = context.value.getImageData(0, 0, 1200, 600)
        // 当前绘图表面进栈
        preDrawAry.value.push(preData)
      }
      
      function canvasMove(e: MouseEvent | TouchEvent): void {
        if (canvasMoveUse.value && context.value) {
          context.value.lineTo((e as MouseEvent).layerX, (e as MouseEvent).layerY)
          context.value.stroke()
        }
      }
      
      // 设置绘画配置
      function setCanvasStyle(): void {
        if (!context.value) return
        context.value.lineWidth = config.lineWidth
        context.value.shadowBlur = config.shadowBlur
        context.value.shadowColor = config.lineColor
        context.value.strokeStyle = config.lineColor
      }
      
      // 设置颜色
      function setColor(color: string): void {
        config.lineColor = color
      }
      
      // 设置笔刷大小
      function setBrush(size: number): void {
        config.lineWidth = size
      }
      
      function controlCanvas(action: string): void {
        if (!context.value) return
        switch (action) {
          case "prev":
            if (preDrawAry.value.length) {
              const popData = preDrawAry.value.pop()
              const midData = middleAry.value[preDrawAry.value.length + 1]
              nextDrawAry.value.push(midData)
              context.value.putImageData(popData, 0, 0)
            }
            break
          case "next":
            if (nextDrawAry.value.length) {
              const popData = nextDrawAry.value.pop()
              const midData = middleAry.value[middleAry.value.length - nextDrawAry.value.length - 2]
              preDrawAry.value.push(midData)
              context.value.putImageData(popData, 0, 0)
            }
            break
          case "clear":
            clearContext()
            if (middleAry.value.length > 0) {
              middleAry.value = [middleAry.value[0]]
            }
            break
        }
      }
      
      function clearContext(): void {
        if (!context.value) return
        context.value.clearRect(0, 0, context.value.canvas.width, context.value.canvas.height)
        preDrawAry.value = []
        nextDrawAry.value = []
      }
      
      function showComment(): void {
        clearContext()
        emit("showComment")
      }
      
      function getImage(): void {
        if ($common.isEmpty(userStore.currentUser)) {
          ElMessage.error("请先登录！")
          return
        }

        if (preDrawAry.value.length < 1) {
          ElMessage.warning("你还没画呢~")
          return
        }

        if (!canvasRef.value) return
        const dataURL = canvasRef.value.toDataURL("image/png")
        let arr = dataURL.split(",")
        let mine = arr[0].match(/:(.*?);/)[1]
        let str = atob(arr[1])
        let n = str.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = str.charCodeAt(n)
        }
        let obj = new Blob([u8arr], {type: mine})
        let key = "graffiti" + "/" + userStore.currentUser.username.replace(/[^a-zA-Z]/g, '') + userStore.currentUser.id + new Date().getTime() + Math.floor(Math.random() * 1000) + ".png"

        let storeType = localStorage.getItem("defaultStoreType")

        let fd = new FormData()
        fd.append("file", obj)
        fd.append("key", key)
        fd.append("relativePath", key)
        fd.append("type", "graffiti")
        fd.append("storeType", storeType)

        if (storeType === "local") {
          saveLocal(fd)
        } else if (storeType === "qiniu") {
          saveQiniu(fd)
        }
      }
      
      async function saveLocal(fd: FormData): Promise<void> {
        try {
          const res = await uploadApi.uploadFile(fd)
          if (!res.data) return
          
          clearContext()
          let url = res.data
          let img = "[你画我猜," + url + "]"
          emit("addGraffitiComment", img)
        } catch (error: any) {
          ElMessage.error(error.message || '上传失败')
        }
      }
      
      async function saveQiniu(fd: FormData): Promise<void> {
        try {
          const tokenRes = await qiniuApi.getUpToken(fd.get("key") as string)
          if (!tokenRes.data) return
          
          fd.append("token", tokenRes.data)
          
          const uploadRes = await qiniuApi.uploadQiniu($constant.qiniuUrl, fd)
          if (!uploadRes.key) return
          
          clearContext()
          let url = $constant.qiniuDownload + uploadRes.key
          let file = fd.get("file") as File
          $common.saveResource(null, "graffiti", url, file.size, file.type, null, "qiniu")
          let img = "[你画我猜," + url + "]"
          emit("addGraffitiComment", img)
        } catch (error: any) {
          ElMessage.error(error.message || '上传失败')
        }
      }
</script>

<style scoped>
  .graffiti-container {
    overflow: hidden;
    border: 2px var(--lightGray) solid;
    border-radius: 4px;
  }

  .graffiti-tools {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .graffiti-title {
    font-size: 14px;
  }

  .graffiti-color {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    float: left;
    margin-right: 20px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .graffiti-color:hover {
    width: 1.3rem;
    height: 1.3rem;
  }

  .activeColor {
    width: 1.3rem;
    height: 1.3rem;
  }

  .graffiti-size {
    cursor: pointer;
    margin-right: 20px;
  }

  .graffiti-size.small {
    font-size: 14px;
  }

  .graffiti-size.middle {
    font-size: 16px;
  }

  .graffiti-size.big {
    font-size: 18px;
  }

  .activeSize {
    background-color: var(--themeBackground);
    color: var(--white);
    border-radius: 50%;
    padding: 2px;
  }

  .graffiti-operate {
    margin-right: 20px;
    cursor: pointer;
    font-size: 18px;
  }

  .graffiti-operate.ban {
    cursor: not-allowed
  }
</style>
