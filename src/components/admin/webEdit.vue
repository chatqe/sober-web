<template>
  <div class="page-container">
    <div class="settings-layout">
      <aside class="settings-nav">
        <div class="nav-header">
          <el-icon size="18"><Setting /></el-icon>
          <span>网站设置</span>
        </div>
        <nav class="nav-list">
          <div
            v-for="item in navItems"
            :key="item.key"
            class="nav-item"
            :class="{ active: activeSection === item.key }"
            @click="activeSection = item.key"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </div>
        </nav>
      </aside>

      <main class="settings-content">
        <!-- 基础信息 -->
        <div v-show="activeSection === 'basic'" class="setting-section">
          <div class="section-header">
            <el-icon size="16"><Setting /></el-icon>
            <span>基础信息</span>
          </div>
          <div class="section-body">
            <el-form
              ref="ruleFormRef"
              :model="webInfo"
              :rules="rules"
              label-width="90px"
              class="settings-form"
            >
              <div class="form-grid">
                <el-form-item label="网站名称" prop="webName" class="form-col">
                  <el-input v-model="webInfo.webName" placeholder="请输入网站名称" maxlength="10" />
                </el-form-item>
                <el-form-item label="网站标题" prop="webTitle" class="form-col">
                  <el-input v-model="webInfo.webTitle" placeholder="请输入网站标题" />
                </el-form-item>
              </div>
              <div class="form-grid">
                <el-form-item label="页脚" prop="footer" class="form-col">
                  <el-input v-model="webInfo.footer" placeholder="请输入页脚信息" maxlength="100" />
                </el-form-item>
                <el-form-item label="网站状态" prop="status" class="form-col">
                  <div class="switch-wrapper">
                    <el-switch v-model="webInfo.status" @change="() => changeWebStatus(webInfo)" />
                    <span class="switch-label">{{ webInfo.status ? '在线' : '离线' }}</span>
                  </div>
                </el-form-item>
              </div>
              <el-form-item label="背景图片" prop="backgroundImage">
                <div class="media-input">
                  <el-input v-model="webInfo.backgroundImage" placeholder="请输入背景图片URL" />
                  <el-image
                    v-if="webInfo.backgroundImage"
                    class="preview-thumb"
                    :src="webInfo.backgroundImage"
                    fit="cover"
                    :preview-src-list="[webInfo.backgroundImage]"
                  />
                </div>
                <uploadPicture
                  :isAdmin="true"
                  :prefix="'webBackgroundImage'"
                  @addPicture="addBackgroundImage"
                  :maxSize="3"
                  :maxNumber="1"
                />
              </el-form-item>
              <el-form-item label="站点头像" prop="avatar">
                <div class="media-input">
                  <el-input v-model="webInfo.avatar" placeholder="请输入头像URL" />
                  <el-image
                    v-if="webInfo.avatar"
                    class="preview-thumb"
                    :src="webInfo.avatar"
                    fit="cover"
                    :preview-src-list="[webInfo.avatar]"
                  />
                </div>
                <uploadPicture
                  :isAdmin="true"
                  :prefix="'webAvatar'"
                  @addPicture="addAvatar"
                  :maxSize="2"
                  :maxNumber="1"
                />
              </el-form-item>
              <el-form-item label="欢迎语配置" prop="waifuJson">
                <div class="json-editor">
                  <el-input
                    :disabled="disabled"
                    :rows="5"
                    type="textarea"
                    v-model="webInfo.waifuJson"
                    placeholder='请粘贴JSON格式的欢迎语配置'
                  />
                  <el-button
                    :type="disabled ? 'primary' : 'danger'"
                    size="small"
                    round
                    @click="disabled = !disabled"
                    style="margin-top: 8px"
                  >
                    {{ disabled ? '点击编辑' : '停止编辑' }}
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
            <div class="form-actions">
              <el-button type="primary" @click="submitForm">保存基础信息</el-button>
            </div>
          </div>
        </div>

        <!-- 公告 -->
        <div v-show="activeSection === 'notice'" class="setting-section">
          <div class="section-header">
            <el-icon size="16"><Bell /></el-icon>
            <span>站点公告</span>
          </div>
          <div class="section-body">
            <div class="tag-cloud">
              <el-tag
                v-for="(notice, i) in notices"
                :key="i"
                closable
                :disable-transitions="false"
                @close="handleClose(notices, notice)"
              >
                {{ notice }}
              </el-tag>
              <el-input
                v-if="inputNoticeVisible"
                v-model="inputNoticeValue"
                ref="saveNoticeInput"
                size="small"
                class="tag-input"
                @keyup.enter="handleInputNoticeConfirm"
                @blur="handleInputNoticeConfirm"
              />
              <el-button v-else size="small" @click="showNoticeInput()">+ 添加公告</el-button>
            </div>
            <div class="form-actions">
              <el-button type="primary" @click="saveNotice()">保存公告</el-button>
            </div>
          </div>
        </div>

        <!-- 随机名称 -->
        <div v-show="activeSection === 'name'" class="setting-section">
          <div class="section-header">
            <el-icon size="16"><User /></el-icon>
            <span>随机名称库</span>
          </div>
          <div class="section-body">
            <div class="tag-cloud">
              <el-tag
                v-for="(name, i) in randomName"
                :key="i"
                effect="dark"
                :type="types[Math.floor(Math.random() * 5)]"
                closable
                :disable-transitions="false"
                @close="handleClose(randomName, name)"
              >
                {{ name }}
              </el-tag>
              <el-input
                v-if="inputRandomNameVisible"
                v-model="inputRandomNameValue"
                ref="saveRandomNameInput"
                size="small"
                class="tag-input"
                @keyup.enter="handleInputRandomNameConfirm"
                @blur="handleInputRandomNameConfirm"
              />
              <el-button v-else size="small" @click="showRandomNameInput">+ 添加名称</el-button>
            </div>
            <div class="form-actions">
              <el-button type="primary" @click="saveRandomName()">保存名称库</el-button>
            </div>
          </div>
        </div>

        <!-- 随机头像 -->
        <div v-show="activeSection === 'avatar'" class="setting-section">
          <div class="section-header">
            <el-icon size="16"><Avatar /></el-icon>
            <span>随机头像库</span>
          </div>
          <div class="section-body">
            <div class="avatar-grid">
              <div v-for="(avatar, i) in randomAvatar" :key="i" class="avatar-item">
                <el-tag closable :disable-transitions="false" @close="handleClose(randomAvatar, avatar)">
                  {{ avatar }}
                </el-tag>
                <el-image
                  lazy
                  class="avatar-thumb"
                  :src="avatar"
                  fit="cover"
                  :preview-src-list="randomAvatar"
                  :index="i"
                />
              </div>
            </div>
            <div class="tag-input-row">
              <el-input
                v-if="inputRandomAvatarVisible"
                v-model="inputRandomAvatarValue"
                ref="saveRandomAvatarInput"
                size="small"
                class="tag-input"
                @keyup.enter="handleInputRandomAvatarConfirm"
                @blur="handleInputRandomAvatarConfirm"
              />
              <el-button v-else size="small" @click="showRandomAvatarInput">+ 添加头像</el-button>
              <uploadPicture
                :isAdmin="true"
                :prefix="'randomAvatar'"
                @addPicture="addRandomAvatar"
                :maxSize="1"
                :maxNumber="5"
              />
            </div>
            <div class="form-actions">
              <el-button type="primary" @click="saveRandomAvatar()">保存头像库</el-button>
            </div>
          </div>
        </div>

        <!-- 随机封面 -->
        <div v-show="activeSection === 'cover'" class="setting-section">
          <div class="section-header">
            <el-icon size="16"><Picture /></el-icon>
            <span>随机封面库</span>
          </div>
          <div class="section-body">
            <div class="cover-grid">
              <div v-for="(cover, i) in randomCover" :key="i" class="cover-item">
                <el-tag closable :disable-transitions="false" @close="handleClose(randomCover, cover)">
                  {{ cover }}
                </el-tag>
                <el-image
                  lazy
                  class="cover-thumb"
                  :src="cover"
                  fit="cover"
                  :preview-src-list="randomCover"
                  :index="i"
                />
              </div>
            </div>
            <div class="tag-input-row">
              <el-input
                v-if="inputRandomCoverVisible"
                v-model="inputRandomCoverValue"
                ref="saveRandomCoverInput"
                size="small"
                class="tag-input"
                @keyup.enter="handleInputRandomCoverConfirm"
                @blur="handleInputRandomCoverConfirm"
              />
              <el-button v-else size="small" @click="showRandomCoverInput">+ 添加封面</el-button>
              <uploadPicture
                :isAdmin="true"
                :prefix="'randomCover'"
                @addPicture="addRandomCover"
                :maxSize="8"
                :maxNumber="5"
              />
            </div>
            <div class="form-actions">
              <el-button type="primary" @click="saveRandomCover()">保存封面库</el-button>
            </div>
          </div>
        </div>

        <!-- 重置按钮 -->
        <div class="reset-bar">
          <el-button type="danger" plain @click="resetForm">重置所有修改</el-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, inject } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Setting, Bell, User, Avatar, Picture
} from '@element-plus/icons-vue';
import { webInfoApi } from '@/api/index.js';
import uploadPicture from '../common/uploadPicture.vue';

const $constant = inject('$constant');
const $common = inject('$common');

// 导航配置
const navItems = [
  { key: 'basic', label: '基础信息', icon: Setting },
  { key: 'notice', label: '站点公告', icon: Bell },
  { key: 'name', label: '随机名称', icon: User },
  { key: 'avatar', label: '随机头像', icon: Avatar },
  { key: 'cover', label: '随机封面', icon: Picture },
];
const activeSection = ref('basic');

// 响应式数据
const disabled = ref(true);
const types = ['', 'success', 'info', 'danger', 'warning'];
const inputNoticeVisible = ref(false);
const inputNoticeValue = ref('');
const inputRandomNameVisible = ref(false);
const inputRandomNameValue = ref('');
const inputRandomAvatarVisible = ref(false);
const inputRandomAvatarValue = ref('');
const inputRandomCoverVisible = ref(false);
const inputRandomCoverValue = ref('');
const webInfo = reactive({
  id: null,
  webName: '',
  webTitle: '',
  footer: '',
  backgroundImage: '',
  avatar: '',
  waifuJson: '',
  status: false,
});
const notices = ref([]);
const randomAvatar = ref([]);
const randomName = ref([]);
const randomCover = ref([]);
const rules = {
  webName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' },
  ],
  webTitle: [{ required: true, message: '请输入网站标题', trigger: 'blur' }],
  footer: [{ required: true, message: '请输入页脚', trigger: 'blur' }],
  backgroundImage: [{ required: true, message: '请输入背景', trigger: 'change' }],
  status: [{ required: true, message: '请设置网站状态', trigger: 'change' }],
  avatar: [{ required: true, message: '请上传头像', trigger: 'change' }],
};
const ruleFormRef = ref(null);
const saveNoticeInput = ref(null);
const saveRandomNameInput = ref(null);
const saveRandomAvatarInput = ref(null);
const saveRandomCoverInput = ref(null);

onMounted(() => {
  getWebInfo();
});

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

const changeWebStatus = async (info) => {
  try {
    await webInfoApi.updateWebInfo({ id: info.id, status: info.status });
    await getWebInfo();
    ElMessage.success('保存成功！');
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const getWebInfo = async () => {
  try {
    const res = await webInfoApi.getAdminWebInfo();
    if (!res) return;
    webInfo.id = res.id;
    webInfo.webName = res.webName;
    webInfo.webTitle = res.webTitle;
    webInfo.footer = res.footer;
    webInfo.backgroundImage = res.backgroundImage;
    webInfo.avatar = res.avatar;
    webInfo.waifuJson = res.waifuJson;
    webInfo.status = res.status;
    notices.value = JSON.parse(res.notices || '[]');
    randomAvatar.value = JSON.parse(res.randomAvatar || '[]');
    randomName.value = JSON.parse(res.randomName || '[]');
    randomCover.value = JSON.parse(res.randomCover || '[]');
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
  updateWebInfo({ id: webInfo.id, notices: JSON.stringify(notices.value) });
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
  updateWebInfo({ id: webInfo.id, randomName: JSON.stringify(randomName.value) });
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
  updateWebInfo({ id: webInfo.id, randomAvatar: JSON.stringify(randomAvatar.value) });
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
  updateWebInfo({ id: webInfo.id, randomCover: JSON.stringify(randomCover.value) });
};

const updateWebInfo = async (value) => {
  try {
    await ElMessageBox.confirm('确认保存？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true,
    });
    await webInfoApi.updateWebInfo(value);
    await getWebInfo();
    ElMessage.success('保存成功！');
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
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

/* 左右布局 */
.settings-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* 左侧导航 */
.settings-nav {
  width: 180px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: sticky;
  top: 0;
}
.nav-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 16px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1d2e;
  border-bottom: 1px solid #f0f0f0;
}
.nav-list {
  padding: 8px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475467;
  transition: all 0.15s ease;
}
.nav-item:hover {
  background: #f1f5f9;
  color: #1a1d2e;
}
.nav-item.active {
  background: #eef2ff;
  color: #5362f6;
  font-weight: 500;
}

/* 右侧内容区 */
.settings-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-section {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1d2e;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafbfc;
}
.section-body {
  padding: 20px;
}

/* 表单网格 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 24px;
}
.form-col {
  flex: 1;
  min-width: 0;
}
.switch-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.switch-label {
  font-size: 13px;
  color: #64748b;
}

/* 媒体输入（URL + 预览图） */
.media-input {
  display: flex;
  align-items: center;
  gap: 10px;
}
.preview-thumb {
  border-radius: 4px;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
}

/* JSON 编辑器 */
.json-editor {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}
.tag-input {
  width: 200px;
  margin: 0;
}
.tag-input-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

/* 头像网格 */
.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 100px;
}
.avatar-thumb {
  border-radius: 8px;
  width: 64px;
  height: 64px;
  border: 1px solid #e2e8f0;
}

/* 封面网格 */
.cover-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.cover-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 120px;
}
.cover-thumb {
  border-radius: 8px;
  width: 96px;
  height: 64px;
  border: 1px solid #e2e8f0;
}

/* 操作栏 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
.reset-bar {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 12px 20px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
