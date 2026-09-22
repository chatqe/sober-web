<script setup>
import { ref } from 'vue'
import { ElRadioGroup, ElRadio, ElAutocomplete, ElButton } from 'element-plus'
import axios from 'axios'

/* 1. 响应式数据 */
const engine = ref('baidu')          // 当前引擎
const keyword = ref('')              // 输入内容

/* 2. 引擎 → 搜索地址模板 */
const engineTpl = {
  baidu:  'https://www.baidu.com/s?wd=',
  google: 'https://www.google.com/search?q=',
  bing:   'https://cn.bing.com/search?q=',
  duck:   'https://duckduckgo.com/?q='
}

/* 3. 关键词变化时拉取百度 Sug */
const fetchSuggestions = async (queryString, callback) => {
  if (!queryString) { callback([]); return }
  // 百度 sug 接口（JSONP 改为 CORS 代理，vercel 或 cf-worker 均可）
  const url = `https://api.baobing.cn/sug?code=utf-8&k=${encodeURIComponent(queryString)}`
  const { data } = await axios.get(url).catch(() => ({ data: null }))
  const results = (data?.s || []).map(item => ({ value: item }))
  callback(results)
}

/* 4. 搜索跳转 */
function handleSearch () {
  const q = keyword.value.trim()
  if (!q) return
  const target = engineTpl[engine.value] + encodeURIComponent(q)
  window.open(target, '_blank')   // 新标签打开
}
</script>

<template>
  <div class="wrap">
    <h1>🔍 搜索一下</h1>

    <!-- 搜索引擎 Tab -->
    <el-radio-group v-model="engine" size="small">
      <el-radio value="baidu">百度</el-radio>
      <el-radio value="google">Google</el-radio>
      <el-radio value="bing">必应</el-radio>
      <el-radio value="duck">Duck</el-radio>
    </el-radio-group>

    <!-- 搜索框 -->
    <el-autocomplete
        v-model="keyword"
        :fetch-suggestions="fetchSuggestions"
        placeholder="输入关键词回车搜索"
        clearable
        style="width: 520px; margin-top: 12px"
        @select="handleSearch"
        @keyup.enter="handleSearch"
    />

    <!-- 搜索按钮 -->
    <el-button type="primary" style="margin-left: 8px" @click="handleSearch">
      搜索
    </el-button>
  </div>
</template>

<style scoped>
.wrap {
  margin: 20vh auto 0;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
h1 {
  font-size: 48px;
  margin-bottom: 24px;
  color: #333;
}
</style>