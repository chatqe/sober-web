<template>
  <div id="aplayer">
    <meting-js
      id="13467780618"
      lrc-type="1"
      server="netease"
      order="list"
      type="playlist"
      fixed="true"
      list-olded="true"
      autoplay="false"
      list-folded="false"
    ></meting-js>
  </div>
</template>

<script>
export default {
  name: 'aPlayer',
  mounted() {
    // const container = document.getElementById('aplayer')
    // // 初始化 APlayer
    // if (container) {
    //   this.player = new APlayer({
    //     container: container,
    //     fixed: true,
    //     // mini: true,
    //     autoplay: false,
    //     listFolded: true,
    //     listmaxheight: '400px',
    //     // 歌曲列表
    //     audio: [{
    //       name: '半岛铁盒',// 歌曲名字
    //       artist: '周杰伦',// 歌曲演唱者
    //       url: 'https://echeverra.cn/wp-content/uploads/2022/05/周杰伦-半岛铁盒.mp3',// 歌曲地址（这里用外链地址）
    //       cover: 'https://echeverra.cn/wp-content/uploads/2022/05/周杰伦-半岛铁盒-mp3-image.png',
    //       lrc: "",// 歌词
    //       theme: "rgb(61, 162, 230)",// 播放这首歌曲时的主题色
    //     },
    //
    //     ]
    //   });
    // }

    // 确保APlayer初始化完成
    // this.$nextTick(() => {
    //   const miniSwitcher = document.querySelector('#aplayer > div.aplayer-body > div.aplayer-miniswitcher > button');
    //   if (miniSwitcher) {
    //     miniSwitcher.addEventListener('click', (event) => {
    //       console.log('展开按钮被点击了！');
    //       var aplayerBody = document.querySelector('#aplayer > div.aplayer-body');
    //       console.log(aplayerBody)
    //       aplayerBody.style.left = '0px !important;';
    //       // 在这里添加你的自定义逻辑
    //     });
    //   }
    // });

  },
  beforeDestroy() {
    // 销毁 APlayer 实例
    if (this.player) {
      this.player.destroy();
    }
  }
};
</script>

<style>



.aplayer.aplayer-fixed .aplayer-body {
  border-radius: 0px 6px 6px 0px;
  background: var(--favoriteBg) !important;
}

.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
  left: -66px !important;
}

.aplayer .aplayer-pic:hover .aplayer-button {
  opacity: 1 !important;
}

.aplayer .aplayer-miniswitcher {
  border-radius: 0 6px 6px 0 !important;
  background: var(--favoriteBg) !important;
}

/*.aplayer .aplayer-pic {
  position: relative;
  float: left;
  height: 66px;
  width: 66px;
  background-size: cover;
  background-position: 50%;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  cursor: pointer;
}*/

/* 背景色 */
/*.aplayer.aplayer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 99;
  overflow: visible;
  max-width: 400px;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.aplayer * {
  box-sizing: content-box;
}
.aplayer.aplayer-fixed .aplayer-body {
  background: var(--favoriteBg) !important;
  border-radius: 0 6px 6px 0;
}
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
  width: 66px !important;
}
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
  left: -66px !important;
}
.aplayer {
  background: #fff;
  font-family: Arial, Helvetica, sans-serif;
  margin: 5px;
  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .07), 0 1px 5px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .07), 0 1px 5px 0 rgba(0, 0, 0, .1);
  border-radius: 2px;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: normal;
  position: relative;
}

.aplayer.aplayer-narrow {
  width: 66px;
}

.aplayer.aplayer-pic {
  position: relative;
  float: left;
  height: 66px;
  width: 66px;
  background-size: cover;
  background-position: 50%;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  cursor: pointer;
}*/

</style>
