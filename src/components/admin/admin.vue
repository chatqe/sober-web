<template>
  <div class="admin-container">
    <sidebar />
    <div class="right-panel">
      <my-header />
      <tab-bar />
      <div class="content-box">
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyHeader from "@/components/admin/common/myHeader.vue";
import Sidebar from "@/components/admin/common/sidebar.vue";
import TabBar from "@/components/admin/common/tabBar.vue";
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
}
</style>
