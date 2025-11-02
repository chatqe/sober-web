<template>
  <div class="sidebar">
    <div
        @click="toggleCollapse"
        class="collapse-trigger"
    >
      <el-icon>
        <Menu/>
      </el-icon>
      <span>折叠</span>
    </div>

    <el-menu
        class="sidebar-el-menu"
        background-color="#ebf1f6"
        text-color="#606266"
        active-text-color="#20a0ff"
        :unique-opened="true"
        :default-active="currentRoutePath"
        :router="true"
        :collapse="isCollapse"
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
import {ref, computed, onMounted} from 'vue'
import router from '@/router'
import {useUserStore} from '@/stores'
import {
  Menu,
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

// 响应式数据
const isCollapse = ref(false)

// 计算属性
const isBoss = computed(() => userStore.currentAdmin?.isBoss || false)
const currentRoutePath = computed(() => router.currentRoute.value.path)


// 菜单配置数据
const items = ref([
  {
    icon: House,
    index: '/main',
    title: '系统首页',
    isBoss: true
  }, {
    icon: Setting,
    index: '/webEdit',
    title: '网站设置',
    isBoss: true
  }, {
    icon: User,
    index: '/userList',
    title: '用户管理',
    isBoss: true
  }, {
    icon: Document,
    index: '/postList',
    title: '文章管理',
    isBoss: false
  }, {
    icon: Notebook,
    index: '/sortList',
    title: '分类管理',
    isBoss: true
  }, {
    icon: EditPen,
    index: '/commentList',
    title: '评论管理',
    isBoss: false
  }, {
    icon: ChatDotRound,
    index: '/treeHoleList',
    title: '留言管理',
    isBoss: true
  }, {
    icon: Paperclip,
    index: '/resourceList',
    title: '资源管理',
    isBoss: true
  }, {
    icon: CreditCard,
    index: '/resourcePathList',
    title: '资源聚合',
    isBoss: true
  }, {
    icon: Sugar,
    index: '/loveList',
    title: '表白墙',
    isBoss: true
  }
])


// 过滤菜单项（根据权限）
const filteredItems = computed(() => {
  return items.filter(item => isBoss.value || !item.isBoss)
})

// 图标映射函数
const getIconComponent = (iconComponent) => {
  return iconComponent || Menu
}

// 折叠/展开侧边栏
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 生命周期
onMounted(() => {
  // 可以在这里添加初始化逻辑
})
</script>

<style scoped>
.sidebar {
  display: block;
  position: fixed;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: auto;
  width: v-bind('isCollapse ? "64px" : "200px"');
  user-select: none;
  transition: width 0.3s ease;
  z-index: 1000;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.collapse-trigger {
  color: #606266;
  cursor: pointer;
  background-color: #ebf1f6;
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #d1dbe5;
  transition: all 0.3s ease;
}

.collapse-trigger:hover {
  background-color: #d1dbe5;
}

.collapse-trigger .el-icon {
  margin-right: 8px;
  font-size: 17px;
}

.collapse-trigger span {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-el-menu {
  border: none;
  height: calc(100% - 49px);
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}

.sidebar-el-menu.el-menu--collapse {
  width: 64px;
}

.sidebar-el-menu .el-menu-item {
  padding: 0 10px !important;
}

.sidebar-el-menu .el-sub-menu__title {
  padding: 0 10px !important;
}

/* 折叠状态下的样式 */
.sidebar.el-menu--collapse .collapse-trigger span {
  display: none;
}

.sidebar.el-menu--collapse .el-sub-menu__title span,
.sidebar.el-menu--collapse .el-menu-item span {
  display: none;
}
</style>