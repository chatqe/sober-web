<template>
  <div class="admin-container">
    <sidebar />
    <div class="right-panel">
      <my-header />
      <div class="content-box">
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MyHeader from "@/components/admin/common/myHeader.vue";
import Sidebar from "@/components/admin/common/sidebar.vue";
import { useAdminTabsStore } from '@/stores/modules/adminTabs'

const route = useRoute()
const tabStore = useAdminTabsStore()

onMounted(() => {
  tabStore.initFromRoute(route as any)
})
</script>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: rgba(250, 251, 252, 1);
}
.content-box {
  flex: 1;
  overflow: hidden;
  background: rgba(250, 251, 252, 1);
}
</style>
