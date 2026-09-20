<template>
  <div class="admin-container">
    <myHeader />
    <sidebar />
    <div class="content-box">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyHeader from "@/components/admin/common/myHeader.vue";
import Sidebar from "@/components/admin/common/sidebar.vue";
</script>

<style scoped>
.admin-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  grid-area: sidebar;
  min-height: 0;
  overflow-y: auto;
}

.my-header {
  grid-area: header;
}

.content-box {
  grid-area: main;
  min-height: 0;
  overflow-y: auto;
  padding: 30px;
  background: #f1f5f9;
}

.content {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
