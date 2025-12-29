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

  .content-box {
    position: absolute;
    left: 130px;
    right: 0;
    top: 70px;
    bottom: 0;
    transition: left .3s ease-in-out;
  }

  .content {
    width: auto;
    height: 100%;
    padding: 30px;
    overflow-y: scroll;
  }

</style>
