<template>
  <div>
    <div class="travel-container">
      <!-- 封面 -->
      <div class="travel-header my-animation-slide-top">
        <!-- 背景图片 -->
        <video class="index-video" autoplay="autoplay" muted="muted" loop="loop"
               :src="$constant.favoriteVideo">
        </video>
        <div style="position: absolute;left: 0;top: 0;padding: 5px 20px">
          <!-- 标题 -->
          <div style="color: var(--white);margin: 0 10px">
            <div style="line-height: 2 ;margin-top: 12px">
              时光相册
            </div>
            <div style="font-size: 22px;font-weight: bold;line-height: 2;margin-top: 15px">
              每一张照片都是一次美好的记忆
            </div>
          </div>
        </div>
      </div>

      <div class="travel-content my-animation-slide-bottom">
        <div v-if="false">
          <!-- 标签 -->
          <div class="photo-title-warp" v-if="!$common.isEmpty(photoTitleList)">
            <div v-for="(item, index) in photoTitleList" :key="index"
                 :class="{isActive: photoPagination.classify === item.classify}"
                 @click="changePhotoTitle(item.classify)">
              <proTag :info="item.classify+' '+item.count"
                      :color="$constant.before_color_list[Math.floor(Math.random() * 6)]"
                      style="margin: 12px">
              </proTag>
            </div>
          </div>

          <div class="photo-title">
            {{photoPagination.classify}}
          </div>

          <photo :resourcePathList="photoList"></photo>
          <div class="pagination-wrap">
            <div @click="pagePhotos()" class="pagination" v-if="photoPagination.total !== photoList.length">
              下一页
            </div>
            <!--新增margin-top顶住-->
            <!--<div v-else style="user-select: none; margin-top: 40.4vh;">-->
            <div v-else style="user-select: none;">
              ~~到底啦~~
            </div>
          </div>
        </div>

        <emptyState v-else></emptyState>

      </div>
    </div>

    <!-- 页脚 -->
    <div style="background: var(--favoriteBg)">
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { defineAsyncComponent } from 'vue'
import { webInfoApi } from '@/api'

// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

const myFooter = defineAsyncComponent(() => import("./common/myFooter.vue"))
const photo = defineAsyncComponent(() => import("./common/photo.vue"))
const proTag = defineAsyncComponent(() => import("./common/proTag.vue"))
const emptyState = defineAsyncComponent(() => import("./common/emptyState.vue"))

// 响应式数据
const photoPagination = ref({
  current: 1,
  size: 10,
  total: 0,
  resourceType: "lovePhoto",
  classify: ""
})
const photoTitleList = ref([])
const photoList = ref([])

// 方法
const getPhotoTitles = async () => {
  try {
    const res = await webInfoApi.listAdminLovePhoto()
    if (!$common.isEmpty(res.data)) {
      photoTitleList.value = res.data
      photoPagination.value = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        resourceType: "lovePhoto",
        classify: photoTitleList.value[0].classify
      }
      changePhoto()
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

const changePhotoTitle = (classify) => {
  if (classify !== photoPagination.value.classify) {
    photoPagination.value = {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      resourceType: "lovePhoto",
      classify: classify
    }
    photoList.value = []
    changePhoto()
  }
}

const pagePhotos = () => {
  photoPagination.value.current += 1
  changePhoto()
}

const changePhoto = async () => {
  try {
    const res = await webInfoApi.listResourcePath(photoPagination.value)
    if (!$common.isEmpty(res.data)) {
      photoList.value = photoList.value.concat(res.data.records)
      photoPagination.value.total = res.data.total
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 生命周期
onMounted(() => {
  getPhotoTitles()
})
</script>

<style scoped>

  .travel-container {
    padding: 25px;
    background: var(--favoriteBg);
  }

  .travel-header {
    margin: 60px auto 30px;
    height: 120px;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    max-width: 1200px;
    color: var(--white);
    user-select: none;
  }

  .index-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: var(--lightGreen);
  }

  .travel-content {
    margin: 0 auto;
    max-width: 1200px;
  }

  .photo-title-warp {
    max-width: 1150px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .isActive {
    animation: scale 2.5s ease-in-out infinite;
  }

  .photo-title {
    text-align: center;
    font-size: 30px;
    font-weight: 700;
    line-height: 80px;
    letter-spacing: 2px;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .pagination {
    padding: 13px 15px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
  }

  @media screen and (max-width: 1150px) {
    .photo-title-warp {
      max-width: 780px;
    }
  }

</style>
