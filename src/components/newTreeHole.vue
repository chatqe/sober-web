<template>
  <!-- 赞赏 -->
  <div class="shadow-box-mini background-opacity wow new-treehole-box "
       v-if="!$common.isEmpty(newTreeHoleList)">
    <div style="font-weight: bold;margin-bottom: 20px">🧨最新树洞</div>
    <div>
      <vue-seamless-scroll :data="newTreeHoleList" style="height: 300px;overflow: hidden">
        <div v-for="(item, i) in newTreeHoleList"
             style="display: flex;justify-content: space-between"
             :key="i">
          <div style="display: flex">
            <el-avatar style="margin-bottom: 10px" :size="36" :src="item.avatar"></el-avatar>
            <div style="margin-left: 10px;height: 36px;line-height: 36px;overflow: hidden;max-width: 80px">
              {{ item.message }}
            </div>
          </div>
<!--          <div style="height: 36px;line-height: 36px">-->
<!--            {{ item.admire }}元-->
<!--          </div>-->
        </div>
      </vue-seamless-scroll>
    </div>
    </div>
</template>


<script>

/**
 *  基于 Vue.js 的插件，用于实现 无缝滚动 效果。
 *  该插件允许你创建一个内容循环滚动的效果，使得用户可以在一个可滚动区域中看到持续流动的内容，类似于新闻滚动条、广告横幅等。
 *
 */
import vueSeamlessScroll from "vue-seamless-scroll";

export default {
  components: {
    vueSeamlessScroll
  },
  data() {

    return {
      pagination: {
        current: 1,
        size: 5,
        recommendStatus: true
      },
      recommendArticles: [],
      newTreeHoleList: [],
      showAdmireDialog: false,
      articleSearch: ""
    }
  },
  computed: {
    webInfo() {
      return this.$store.state.webInfo;
    },
    sortInfo() {
      return this.$store.state.sortInfo;
    }
  },
  created() {
    this.getRecommendArticles();
    // this.getAdmire();
    this.getLatestTreeHole();
  },
  methods: {
    selectSort(sort) {
      this.$emit("selectSort", sort);
    },
    selectArticle() {
      this.$emit("selectArticle", this.articleSearch);
    },
    showAdmire() {
      if (this.$common.isEmpty(this.$store.state.currentUser)) {
        this.$message({
          message: "请先登录！",
          type: "error"
        });
        return;
      }

      this.showAdmireDialog = true;
    },
    getAdmire() {
      this.$http.get(this.$constant.baseURL + "/webInfo/getAdmire")
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.admires = res.data;
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    getRecommendArticles() {
      this.$http.post(this.$constant.baseURL + "/article/listArticle", this.pagination)
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.recommendArticles = res.data.records;
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    showTip() {
      this.$router.push({path: '/weiYan'});
    },

    getLatestTreeHole() {
      this.$http.get(this.$constant.baseURL + "/webInfo/latestTreeHole")
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.newTreeHoleList = res.data;
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    }
  }

}
</script>

<style scoped>
.card-content1 {
  background: linear-gradient(-45deg, #e8d8b9, #eccec5, #a3e9eb, #bdbdf0, #eec1ea);
  background-size: 400% 400%;
  animation: gradientBG 10s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  position: relative;
  /*color: var(--white);*/
  overflow: hidden;
}

.card-content1 :not(:first-child) {
  z-index: 10;
}

.web-name {
  font-size: 30px;
  font-weight: bold;
  margin: 20px 0;
}

.web-info {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.blog-info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.blog-info-num {
  margin-top: 12px;
}

.collection-btn {
  position: relative;
  margin-top: 12px;
  background: var(--lightGreen);
  cursor: pointer;
  width: 65%;
  height: 35px;
  border-radius: 1rem;
  text-align: center;
  line-height: 35px;
  color: var(--white);
  overflow: hidden;
  z-index: 1;
  margin-bottom: 25px;
}

.collection-btn::before {
  background: var(--gradualRed);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: "";
  transform: scaleX(0);
  transform-origin: 0;
  transition: transform 0.5s ease-out;
  transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
  border-radius: 1rem;
  z-index: -1;
}

.collection-btn:hover::before {
  transform: scaleX(1);
}

.card-content2-title {
  font-size: 18px;
  margin-bottom: 20px;
}

.card-content2-icon {
  color: var(--red);
  margin-right: 5px;
  animation: scale 1s ease-in-out infinite;
}

.aside-post-detail {
  display: flex;
  cursor: pointer;
}

.aside-post-image {
  width: 40%;
  border-radius: 0.2rem;
  margin-right: 8px;
  overflow: hidden;
}

.error-aside-image {
  background: var(--themeBackground);
  color: var(--white);
  padding: 10px;
  text-align: center;
  width: 100%;
  height: 100%;
}

.aside-post-title {
  width: 60%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.aside-post-date {
  margin-top: 8px;
  margin-bottom: 20px;
  color: var(--greyFont);
  font-size: 12px;
}

.post-sort {
  border-radius: 1rem;
  margin-bottom: 15px;
  line-height: 30px;
  transition: all 0.3s;
}

.post-sort:hover {
  background: var(--themeBackground);
  padding: 2px 15px;
  cursor: pointer;
  color: var(--white);
}

.sort-name {
  font-weight: bold;
  font-size: 25px;
  margin-top: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sort-name:after {
  top: 74px;
  width: 22px;
  left: 26px;
  height: 2px;
  background: var(--white);
  content: "";
  border-radius: 1px;
  position: absolute;
}

.new-treehole-box {
  background: var(--springBg) center center / cover no-repeat;
  padding: 25px;
  border-radius: 10px;
  animation: hideToShow 1s ease-in-out;
  margin-top: 30px;
}

.admire-btn {
  padding: 13px 15px;
  background: var(--maxLightRed);
  border-radius: 3rem;
  color: var(--white);
  width: 100px;
  user-select: none;
  cursor: pointer;
  text-align: center;
  margin: 20px auto 0;
  transition: all 1s;
}

.admire-btn:hover {
  transform: scale(1.2);
}

.admire-image {
  margin: 0 auto 10px;
  border-radius: 10px;
  height: 150px;
  width: 150px;
  background: var(--admireImage) center center / cover no-repeat;
}

.admire-content {
  font-size: 12px;
  color: var(--maxGreyFont);
  line-height: 1.5;
  margin: 5px;
}

.ais-SearchBox-input {
  padding: 0 14px;
  height: 30px;
  width: calc(100% - 50px);
  outline: 0;
  border: 2px solid var(--lightGreen);
  border-right: 0;
  border-radius: 40px 0 0 40px;
  color: var(--maxGreyFont);
  background: var(--white);
}

.ais-SearchBox-submit {
  height: 30px;
  width: 50px;
  border: 2px solid var(--lightGreen);
  border-left: 0;
  border-radius: 0 40px 40px 0;
  background: var(--white);
  cursor: pointer;
}
</style>
