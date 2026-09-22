<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Document /></el-icon>
        <span>文章信息</span>
      </div>
      <el-form :model="article" :rules="rules" ref="ruleForm" label-width="150px"
               class="demo-ruleForm">
      <el-form-item label="标题" prop="articleTitle">
        <el-input maxlength="30" v-model="article.articleTitle"></el-input>
      </el-form-item>

      <el-form-item label="视频链接" prop="videoUrl">
        <el-input maxlength="1000" v-model="article.videoUrl"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="articleContent">
        <MdEditor ref="md" @upload-image="imgAdd" v-model="article.articleContent" />
      </el-form-item>

      <el-form-item label="是否启用评论" prop="commentStatus">
        <el-tag :type="article.commentStatus === false ? 'danger' : 'success'"
                disable-transitions>
          {{article.commentStatus === false ? '否' : '是'}}
        </el-tag>
        <el-switch v-model="article.commentStatus"></el-switch>
      </el-form-item>

      <el-form-item label="是否推荐" prop="recommendStatus">
        <el-tag :type="article.recommendStatus === false ? 'danger' : 'success'"
                disable-transitions>
          {{article.recommendStatus === false ? '否' : '是'}}
        </el-tag>
        <el-switch v-model="article.recommendStatus"></el-switch>
      </el-form-item>

      <el-form-item label="是否可见" prop="viewStatus">
        <el-tag :type="article.viewStatus === false ? 'danger' : 'success'"
                disable-transitions>
          {{article.viewStatus === false ? '否' : '是'}}
        </el-tag>
        <el-switch v-model="article.viewStatus"></el-switch>
      </el-form-item>

      <el-form-item v-if="article.viewStatus === false" label="不可见时的访问密码" prop="password">
        <el-input maxlength="30" v-model="article.password"></el-input>
      </el-form-item>

      <el-form-item v-if="article.viewStatus === false" label="密码提示" prop="tips">
        <el-input maxlength="60" v-model="article.tips"></el-input>
      </el-form-item>

      <el-form-item label="封面" prop="articleCover">
        <div style="display: flex">
          <el-input v-model="article.articleCover"></el-input>
          <el-image class="table-td-thumb"
                    lazy
                    style="margin-left: 10px"
                    :preview-src-list="[article.articleCover]"
                    :src="article.articleCover"
                    fit="cover"></el-image>
        </div>
        <uploadPicture :isAdmin="true" :prefix="'articleCover'" style="margin-top: 10px" @addPicture="addArticleCover"
                       :maxSize="8"
                       :maxNumber="1"></uploadPicture>
      </el-form-item>
      <el-form-item label="分类" prop="sortId">
        <el-select v-model="article.sortId" placeholder="请选择分类">
          <el-option
            v-for="item in sorts"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="labelId">
        <el-select v-model="article.labelId" placeholder="请选择标签">
          <el-option
            v-for="item in labelsTemp"
            :key="item.id"
            :label="item.tagName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form>
      <div class="form-actions">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button type="danger" @click="resetForm('ruleForm')">重置所有修改</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { commonApi, articleApi, categoryApi } from '@/api/index.js'

// 组件导入
import uploadPicture from '../../../components/media/UploadPicture.vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

// 使用store
const userStore = useUserStore()

// 路由相关
const route = useRoute()
const router = useRouter()

// 获取路由参数
const id = computed(() => route.query.id)

// 响应式数据
const md = ref(null)
const ruleForm = ref(null)
const article = reactive({
  articleTitle: "",
  articleContent: "",
  commentStatus: true,
  recommendStatus: false,
  viewStatus: true,
  password: "",
  tips: "",
  articleCover: "",
  videoUrl: "",
  sortId: null,
  labelId: null
})
const sorts = ref([])
const labels = ref([])
const labelsTemp = ref([])
const rules = {
  articleTitle: [
    {required: true, message: '请输入标题', trigger: 'change'}
  ],
  articleContent: [
    {required: true, message: '请输入内容', trigger: 'change'}
  ],
  commentStatus: [
    {required: true, message: '是否启用评论', trigger: 'change'}
  ],
  recommendStatus: [
    {required: true, message: '是否推荐', trigger: 'change'}
  ],
  viewStatus: [
    {required: true, message: '是否可见', trigger: 'change'}
  ],
  articleCover: [
    {required: true, message: '封面', trigger: 'change'}
  ],
  sortId: [
    {required: true, message: '分类', trigger: 'change'}
  ],
  labelId: [
    {required: true, message: '标签', trigger: 'blur'}
  ]
}

// 监听分类ID变化
watch(() => article.sortId, (newVal, oldVal) => {
  if (oldVal !== null) {
    article.labelId = null;
  }
  if (newVal && labels.value.length > 0) {
    labelsTemp.value = labels.value.filter(l => l.categoryId === newVal);
  }
}, { immediate: false })

// 图片添加处理
const imgAdd = async (file, insertImage) => {
  let suffix = "";
  if (file.name.lastIndexOf('.') !== -1) {
    suffix = file.name.substring(file.name.lastIndexOf('.'));
  }

  // 获取用户信息
  const currentAdmin = userStore.currentAdmin
  let key = "articlePicture" + "/" + currentAdmin.username.replace(/[^a-zA-Z]/g, '') + currentAdmin.id + new Date().getTime() + Math.floor(Math.random() * 1000) + suffix;

  let storeType = localStorage.getItem("defaultStoreType");

  let fd = new FormData();
  fd.append("file", file);
  fd.append("originalName", file.name);
  fd.append("key", key);
  fd.append("relativePath", key);
  fd.append("type", "articlePicture");
  fd.append("storeType", storeType);

  try {
    if (storeType === "local") {
      const res = await articleApi.uploadFile(fd);
      if (res.data) {
        // 使用md-editor-v3的insertImage回调函数插入图片
        insertImage(res.data);
      }
    } else if (storeType === "qiniu") {
      const res = await articleApi.getUpToken(fd.get("key"));
      if (res.data) {
        fd.append("token", res.data);
        const uploadRes = await commonApi.uploadQiniu({ qiniuUrl: import.meta.env.VITE_QINIU_URL, formData: fd });
        if (uploadRes.key) {
          let url = `${import.meta.env.VITE_QINIU_DOWNLOAD}${uploadRes.key}`;
          let fileObj = fd.get("file");
          await articleApi.saveResource({
            type: "articlePicture",
            url: url,
            size: fileObj.size,
            fileType: fileObj.type,
            fileName: fileObj.name,
            storeType: "qiniu"
          });
          // 使用md-editor-v3的insertImage回调函数插入图片
          insertImage(url);
        }
      }
    }
  } catch (error) {
    ElMessage({
      message: error.message || '上传失败',
      type: "error"
    });
    // 上传失败时返回false
    return false;
  }
}

// 添加文章封面
const addArticleCover = (res) => {
  article.articleCover = res;
}

// 获取分类和标签
const getSortAndLabel = async () => {
  try {
    const res = await categoryApi.getSortAndLabel()
    if (res && Object.keys(res).length > 0) {
      sorts.value = res.sorts;
      labels.value = res.labels;
      if (id.value) {
        getArticle();
      }
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取分类标签失败',
      type: "error"
    });
  }
}

// 获取文章详情
const getArticle = async () => {
  try {
    const res = await articleApi.getArticleById(id.value)
    if (res.data) {
      Object.assign(article, res.data);
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取文章失败',
      type: "error"
    });
  }
}

// 提交表单
const submitForm = (formName) => {
  if (article.viewStatus === false && !article.password) {
    ElMessage({
      message: "文章不可见时必须输入密码！",
      type: "error"
    });
    return;
  }

  ruleForm.value.validate((valid) => {
    if (valid) {
      if (!id.value) {
        saveArticle(article)
      } else {
        article.id = id.value;
        updateArticle(article)
      }
    } else {
      ElMessage({
        message: "请完善必填项！",
        type: "error"
      });
    }
  });
}

// 重置表单
const resetForm = (formName) => {
  ruleForm.value.resetFields();
  if (id.value) {
    getArticle();
  }
}

// 保存文章
const saveArticle = async (value) => {
  try {
    await ElMessageBox.confirm('确认保存？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })

    await articleApi.saveArticle(value)
    ElMessage({
      message: "保存成功！",
      type: "success"
    });
    router.push({path: '/postList'});
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        message: error.message || '保存失败',
        type: "error"
      });
    } else {
      ElMessage({
        type: 'warning',
        message: '已取消保存!'
      });
    }
  }
}

// 更新文章
const updateArticle = async (value) => {
  try {
    await ElMessageBox.confirm('确认保存？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })

    await articleApi.updateArticle(value)
    ElMessage({
      message: "保存成功！",
      type: "success"
    });
    router.push({path: '/postList'});
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        message: error.message || '保存失败',
        type: "error"
      });
    } else {
      ElMessage({
        type: 'warning',
        message: '已取消保存!'
      });
    }
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getSortAndLabel();
})
</script>

<style scoped>
  .page-container { display: flex; flex-direction: column; gap: 16px; }
  .page-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
  }
  .section-header {
    display: flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 600; color: #1a1d2e;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }
  .form-actions { display: flex; gap: 10px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
  .table-td-thumb {
    border-radius: 2px;
    width: 40px;
    height: 40px;
  }
  .el-switch { margin-left: 10px; }
  .el-form-item { margin-bottom: 20px; }
</style>
