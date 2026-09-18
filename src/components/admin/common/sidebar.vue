<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        background-color="#f8fafc"
        text-color="#475569"
        active-text-color="#4f46e5"
        :unique-opened="true"
        :default-active="currentRoutePath"
        :router="true"
    >
      <template v-for="item in filteredItems" :key="item.index">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index">
            <template #title>
              <el-icon>
                <component :is="getIconComponent(item.icon)"/>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>

            <template v-for="subItem in item.subs" :key="subItem.index">
              <el-sub-menu v-if="subItem.subs" :index="subItem.index">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                    v-for="threeItem in subItem.subs"
                    :key="threeItem.index"
                    :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>

        <template v-else>
          <el-menu-item :index="item.index">
            <template #title>
              <el-icon>
                <component :is="getIconComponent(item.icon)"/>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import router from '@/router'
import {useUserStore} from '@/stores'
import {
  House,
  Setting,
  User,
  Document,
  Notebook,
  EditPen,
  ChatDotRound,
  Paperclip,
  CreditCard,
  Sugar
} from '@element-plus/icons-vue'

const userStore = useUserStore()

const isAdmin = computed(() => userStore.currentAdmin?.isAdmin || false)
const currentRoutePath = computed(() => router.currentRoute.value.path)

const items = [
  {
    icon: House,
    index: 'main',
    title: '报表管理',
    isAdmin: true
  }, {
    icon: Setting,
    index: 'webEdit',
    title: '网站设置',
    isAdmin: true
  }, {
    icon: User,
    index: 'userList',
    title: '用户管理',
    isAdmin: true
  }, {
    icon: Document,
    index: 'postList',
    title: '文章管理',
    isAdmin: false
  }, {
    icon: Notebook,
    index: 'sortList',
    title: '分类管理',
    isAdmin: true
  }, {
    icon: EditPen,
    index: 'commentList',
    title: '评论管理',
    isAdmin: false
  }, {
    icon: ChatDotRound,
    index: 'treeHoleList',
    title: '弹幕管理',
    isAdmin: true
  }, {
    icon: Paperclip,
    index: 'resourceList',
    title: '资源管理',
    isAdmin: true
  }, {
    icon: CreditCard,
    index: 'resourcePathList',
    title: '资源聚合',
    isAdmin: true
  }, {
    icon: Sugar,
    index: 'loveList',
    title: '表白墙',
    isAdmin: true
  }
]

const filteredItems = computed(() => {
  return items.filter(item => isAdmin.value || !item.isAdmin)
})

const getIconComponent = (iconComponent) => {
  return iconComponent
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: fixed;
  left: 0;
  top: 70px;
  bottom: 0;
  width: 200px;
  overflow-y: auto;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  z-index: 1000;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu {
  border: none;
  height: 100%;
}

.sidebar-el-menu .el-menu-item {
  padding: 0 12px !important;
  height: 44px;
  line-height: 44px;
  border-radius: 6px;
  margin: 2px 8px;
  font-size: 14px;
}

.sidebar-el-menu .el-sub-menu__title {
  padding: 0 12px !important;
  height: 44px;
  line-height: 44px;
  border-radius: 6px;
  margin: 2px 8px;
  font-size: 14px;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 100%;
}

.sidebar-el-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  font-weight: 500;
}

.sidebar-el-menu .el-sub-menu__title.is-active {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  font-weight: 500;
}

.sidebar-el-menu .el-menu-item:hover,
.sidebar-el-menu .el-menu-item:focus,
.sidebar-el-menu .el-sub-menu__title:hover,
.sidebar-el-menu .el-sub-menu__title:focus {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}
</style>
