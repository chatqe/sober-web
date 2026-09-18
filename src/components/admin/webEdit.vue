<template>
  <div class="page-container">
    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Setting /></el-icon>
        <span>基础信息</span>
      </div>
      <el-form
          ref="ruleFormRef"
          :model="webInfo"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm">
        <el-form-item label="网站名称" prop="webName">
          <el-input v-model="webInfo.webName"></el-input>
        </el-form-item>

        <el-form-item label="网站标题" prop="webTitle">
          <el-input v-model="webInfo.webTitle"></el-input>
        </el-form-item>

        <el-form-item label="页脚" prop="footer">
          <el-input v-model="webInfo.footer"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch v-model="webInfo.status" @change="() => changeWebStatus(webInfo)"></el-switch>
        </el-form-item>

        <el-form-item label="背景" prop="backgroundImage">
          <div style="display: flex">
            <el-input v-model="webInfo.backgroundImage"></el-input>
            <el-image lazy class="table-td-thumb"
                      style="margin-left: 10px"
                      :preview-src-list="[webInfo.backgroundImage]"
                      :src="webInfo.backgroundImage"
                      fit="cover"></el-image>
          </div>
          <uploadPicture :isAdmin="true" :prefix="'webBackgroundImage'" style="margin-top: 15px"
                         @addPicture="addBackgroundImage"
                         :maxSize="3"
                         :maxNumber="1"></uploadPicture>
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <div style="display: flex">
            <el-input v-model="webInfo.avatar"></el-input>
            <el-image lazy class="table-td-thumb"
                      style="margin-left: 10px"
                      :preview-src-list="[webInfo.avatar]"
                      :src="webInfo.avatar"
                      fit="cover"></el-image>
          </div>
          <uploadPicture :isAdmin="true" :prefix="'webAvatar'" style="margin-top: 15px" @addPicture="addAvatar"
                         :maxSize="2"
                         :maxNumber="1"></uploadPicture>
        </el-form-item>

        <el-form-item label="提示" prop="waifuJson">
          <div style="display: flex">
            <el-input :disabled="disabled" :rows="6" type="textarea" v-model="webInfo.waifuJson"></el-input>
            <i class="el-icon-edit my-icon" @click="disabled = !disabled"></i>
          </div>
        </el-form-item>
      </el-form>
      <div class="form-actions">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Bell /></el-icon>
        <span>公告</span>
      </div>
      <el-tag
        :key="i"
        v-for="(notice, i) in notices"
        closable
        :disable-transitions="false"
        @close="handleClose(notices, notice)">
        {{notice}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputNoticeVisible"
        v-model="inputNoticeValue"
        ref="saveNoticeInput"
        size="small"
        @keyup.enter="handleInputNoticeConfirm"
        @blur="handleInputNoticeConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showNoticeInput()">+ 公告</el-button>
      <div class="form-actions">
        <el-button type="primary" @click="saveNotice()">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><User /></el-icon>
        <span>随机名称</span>
      </div>
      <el-tag
        :key="i"
        effect="dark"
        v-for="(name, i) in randomName"
        closable
        :disable-transitions="false"
        :type="types[Math.floor(Math.random() * 5)]"
        @close="handleClose(randomName, name)">
        {{name}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputRandomNameVisible"
        v-model="inputRandomNameValue"
        ref="saveRandomNameInput"
        size="small"
        @keyup.enter="handleInputRandomNameConfirm"
        @blur="handleInputRandomNameConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomNameInput">+ 随机名称</el-button>
      <div class="form-actions">
        <el-button type="primary" @click="saveRandomName()">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Avatar /></el-icon>
        <span>随机头像</span>
      </div>
      <div :key="i"
           style="display: flex"
           v-for="(avatar, i) in randomAvatar">
        <el-tag
          style="white-space: normal;height: unset"
          closable
          :disable-transitions="false"
          @close="handleClose(randomAvatar, avatar)">
          {{avatar}}
        </el-tag>
        <div>
          <el-image lazy class="table-td-thumb"
                    style="margin: 10px"
                    :preview-src-list="[avatar]"
                    :src="avatar"
                    fit="cover"></el-image>
        </div>
      </div>

      <el-input
        class="input-new-tag"
        v-if="inputRandomAvatarVisible"
        v-model="inputRandomAvatarValue"
        ref="saveRandomAvatarInput"
        size="small"
        @keyup.enter="handleInputRandomAvatarConfirm"
        @blur="handleInputRandomAvatarConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomAvatarInput">+ 随机头像</el-button>
      <uploadPicture :isAdmin="true" :prefix="'randomAvatar'" style="margin: 10px" @addPicture="addRandomAvatar"
                     :maxSize="1"
                     :maxNumber="5"></uploadPicture>
      <div class="form-actions">
        <el-button type="primary" @click="saveRandomAvatar()">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <div class="section-header">
        <el-icon size="16"><Picture /></el-icon>
        <span>随机封面</span>
      </div>
      <div :key="i"
           style="display: flex"
           v-for="(cover, i) in randomCover">
        <el-tag
          style="white-space: normal;height: unset"
          closable
          :disable-transitions="false"
          @close="handleClose(randomCover, cover)">
          {{cover}}
        </el-tag>
        <div>
          <el-image lazy class="table-td-thumb"
                    style="margin: 10px"
                    :preview-src-list="[cover]"
                    :src="cover"
                    fit="cover"></el-image>
        </div>
      </div>

      <el-input
        class="input-new-tag"
        v-if="inputRandomCoverVisible"
        v-model="inputRandomCoverValue"
        ref="saveRandomCoverInput"
        size="small"
        @keyup.enter="handleInputRandomCoverConfirm"
        @blur="handleInputRandomCoverConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomCoverInput">+ 随机封面</el-button>
      <uploadPicture :isAdmin="true" :prefix="'randomCover'" style="margin: 10px" @addPicture="addRandomCover"
                     :maxSize="8"
                     :maxNumber="5"></uploadPicture>
      <div class="form-actions">
        <el-button type="primary" @click="saveRandomCover()">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <div class="form-actions" style="justify-content: flex-start">
        <el-button type="danger" @click="resetForm('ruleForm')">重置所有修改</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, nextTick, inject } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { Setting, Bell, User, Avatar, Picture } from '@element-plus/icons-vue';
  import { webInfoApi } from '@/api/index.js';

  // 注入全局属性
  const $constant = inject('$constant');
  const $common = inject('$common');

  // 响应式数据
  const disabled = ref(true);
  const types = ['', 'success', 'info', 'danger', 'warning'];
  const inputNoticeVisible = ref(false);
  const inputNoticeValue = ref("");
  const inputRandomNameVisible = ref(false);
  const inputRandomNameValue = ref("");
  const inputRandomAvatarVisible = ref(false);
  const inputRandomAvatarValue = ref("");
  const inputRandomCoverVisible = ref(false);
  const inputRandomCoverValue = ref("");
  const webInfo = reactive({
    id: null,
    webName: "",
    webTitle: "",
    footer: "",
    backgroundImage: "",
    avatar: "",
    waifuJson: "",
    status: false
  });
  const notices = ref([]);
  const randomAvatar = ref([]);
  const randomName = ref([]);
  const randomCover = ref([]);
  const rules = {
    webName: [
      {required: true, message: '请输入网站名称', trigger: 'blur'},
      {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change'}
    ],
    webTitle: [
      {required: true, message: '请输入网站标题', trigger: 'blur'}
    ],
    footer: [
      {required: true, message: '请输入页脚', trigger: 'blur'}
    ],
    backgroundImage: [
      {required: true, message: '请输入背景', trigger: 'change'}
    ],
    status: [
      {required: true, message: '请设置网站状态', trigger: 'change'}
    ],
    avatar: [
      {required: true, message: '请上传头像', trigger: 'change'}
    ]
  };
  
  // 表单引用
  const ruleFormRef = ref(null);
  const saveNoticeInput = ref(null);
  const saveRandomNameInput = ref(null);
  const saveRandomAvatarInput = ref(null);
  const saveRandomCoverInput = ref(null);

  // 生命周期
  onMounted(() => {
    getWebInfo();
  });

  // 方法定义
  const addBackgroundImage = (res) => {
    webInfo.backgroundImage = res;
  };

  const addAvatar = (res) => {
    webInfo.avatar = res;
  };

  const addRandomAvatar = (res) => {
    randomAvatar.value.push(res);
  };

  const addRandomCover = (res) => {
    randomCover.value.push(res);
  };

  const changeWebStatus = async (webInfo) => {
    try {
      await webInfoApi.updateWebInfo({
        id: webInfo.id,
        status: webInfo.status
      });
      await getWebInfo();
      ElMessage.success("保存成功！");
    } catch (error) {
      ElMessage.error(error.message);
    }
  };

  const getWebInfo = async () => {
    try {
      const res = await webInfoApi.getAdminWebInfo();
      if (!res.data) return;
      webInfo.id = res.data.id;
      webInfo.webName = res.data.webName;
      webInfo.webTitle = res.data.webTitle;
      webInfo.footer = res.data.footer;
      webInfo.backgroundImage = res.data.backgroundImage;
      webInfo.avatar = res.data.avatar;
      webInfo.waifuJson = res.data.waifuJson;
      webInfo.status = res.data.status;
      notices.value = JSON.parse(res.data.notices || '[]');
      randomAvatar.value = JSON.parse(res.data.randomAvatar || '[]');
      randomName.value = JSON.parse(res.data.randomName || '[]');
      randomCover.value = JSON.parse(res.data.randomCover || '[]');
    } catch (error) {
      ElMessage.error(error.message);
    }
  };

  const submitForm = async () => {
    try {
      await ruleFormRef.value.validate();
      await updateWebInfo(webInfo);
    } catch (error) {
      if (error !== false) {
        ElMessage.error(error.message);
      }
    }
  };

  const resetForm = () => {
    if (ruleFormRef.value) {
      ruleFormRef.value.resetFields();
    }
    getWebInfo();
  };

  const handleClose = (array, item) => {
    const index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  };

  const handleInputNoticeConfirm = () => {
    if (inputNoticeValue.value) {
      notices.value.push(inputNoticeValue.value);
    }
    inputNoticeVisible.value = false;
    inputNoticeValue.value = '';
  };

  const showNoticeInput = () => {
    inputNoticeVisible.value = true;
    nextTick(() => {
      if (saveNoticeInput.value?.input) {
        saveNoticeInput.value.input.focus();
      }
    });
  };

  const saveNotice = () => {
    const param = {
      id: webInfo.id,
      notices: JSON.stringify(notices.value)
    };
    updateWebInfo(param);
  };

  const handleInputRandomNameConfirm = () => {
    if (inputRandomNameValue.value) {
      randomName.value.push(inputRandomNameValue.value);
    }
    inputRandomNameVisible.value = false;
    inputRandomNameValue.value = '';
  };

  const showRandomNameInput = () => {
    inputRandomNameVisible.value = true;
    nextTick(() => {
      if (saveRandomNameInput.value?.input) {
        saveRandomNameInput.value.input.focus();
      }
    });
  };

  const saveRandomName = () => {
    const param = {
      id: webInfo.id,
      randomName: JSON.stringify(randomName.value)
    };
    updateWebInfo(param);
  };

  const handleInputRandomAvatarConfirm = () => {
    if (inputRandomAvatarValue.value) {
      randomAvatar.value.push(inputRandomAvatarValue.value);
    }
    inputRandomAvatarVisible.value = false;
    inputRandomAvatarValue.value = '';
  };

  const showRandomAvatarInput = () => {
    inputRandomAvatarVisible.value = true;
    nextTick(() => {
      if (saveRandomAvatarInput.value?.input) {
        saveRandomAvatarInput.value.input.focus();
      }
    });
  };

  const saveRandomAvatar = () => {
    const param = {
      id: webInfo.id,
      randomAvatar: JSON.stringify(randomAvatar.value)
    };
    updateWebInfo(param);
  };

  const handleInputRandomCoverConfirm = () => {
    if (inputRandomCoverValue.value) {
      randomCover.value.push(inputRandomCoverValue.value);
    }
    inputRandomCoverVisible.value = false;
    inputRandomCoverValue.value = '';
  };

  const showRandomCoverInput = () => {
    inputRandomCoverVisible.value = true;
    nextTick(() => {
      if (saveRandomCoverInput.value?.input) {
        saveRandomCoverInput.value.input.focus();
      }
    });
  };

  const saveRandomCover = () => {
    const param = {
      id: webInfo.id,
      randomCover: JSON.stringify(randomCover.value)
    };
    updateWebInfo(param);
  };

  const updateWebInfo = async (value) => {
    try {
      await ElMessageBox.confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      });
      
      await webInfoApi.updateWebInfo(value);
      await getWebInfo();
      ElMessage.success("保存成功！");
    } catch (error) {
      if (error === 'cancel') {
        ElMessage.success('已取消保存!');
        return;
      }
      ElMessage.error(error.message || '保存失败');
    }
  };
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
  .form-actions { display: flex; justify-content: flex-end; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
  .el-tag { margin: 10px; }
  .button-new-tag { margin: 10px; height: 32px; line-height: 32px; padding-top: 0; padding-bottom: 0; }
  .input-new-tag { width: 200px; margin: 10px; }
  .my-icon { cursor: pointer; margin-left: 10px; font-size: 18px; font-weight: bold; color: var(--blue); }
  .table-td-thumb { border-radius: 2px; width: 40px; height: 40px; }
</style>
