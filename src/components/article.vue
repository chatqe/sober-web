<template>
  <div>
    <div v-if="!$common.isEmpty(article)">
      <!-- 封面 -->
      <div class="article-head my-animation-slide-top">
        <!-- 背景图片 -->
        <el-image class="article-image my-el-image"
                  v-once
                  lazy
                  :src="!$common.isEmpty(article.articleCover)?article.articleCover:$constant.random_image+new Date()+Math.floor(Math.random()*10)"
                  fit="cover">
          <template #error>
            <div class="image-slot">
              <div class="article-image"></div>
            </div>
          </template>
        </el-image>
        <!-- 文章信息 -->
        <div class="article-info-container">
          <div class="article-title">{{ article.articleTitle }}</div>
          <div class="article-info">
            <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;">
              <path
                d="M510.4 65.5l259.69999999 0 1e-8 266.89999999c0 147.50000001-116.2 266.89999999-259.7 266.90000001-143.4 0-259.7-119.5-259.7-266.90000001 0.1-147.5 116.3-266.9 259.7-266.89999999z"
                fill="#FF9FCF"></path>
              <path
                d="M698.4 525.2l-13 0c53-48.4 86.5-117.8 86.5-195.20000001 0-10.2-0.7-20.3-1.8-30.19999999C613.8 377.50000001 438.6 444.9 266 437.7c15 33.4 36.7 63.1 63.5 87.5l-5.3 0c-122.6 0-225.5 88.1-248.8 204.1C340 677.2 597.7 609.2 862.2 585.7c-44.3-37.6-101.5-60.5-163.8-60.5z"
                fill="#FF83BB"></path>
              <path
                d="M862.2 585.7C597.7 609.2 340 677.2 75.4 729.3c-3.2 16.1-5 32.6-5 49.6 0 99.8 81.7 181.5 181.5 181.5l518.6 0c99.8 0 181.5-81.7 181.5-181.5 0.1-77.2-35-146.5-89.8-193.2z"
                fill="#FF5390"></path>
              <path
                d="M770.1 299.8C755.1 168 643.3 65.5 507.4 65.5c-146.1 0-264.5 118.4-264.5 264.5 0 38.4 8.3 74.8 23.1 107.7 172.6 7.2 347.8-60.2 504.1-137.9z"
                fill="#FF9FCF"></path>
              <path
                d="M436.4 282.1c0 24.1-19.6 43.7-43.7 43.7S349 306.2 349 282.1s19.6-43.7 43.7-43.7c24.19999999 0 43.7 19.6 43.7 43.7z"
                fill="#FFFFFF"></path>
              <path d="M625 282.1m-43.7 0a43.7 43.7 0 1 0 87.4 0 43.7 43.7 0 1 0-87.4 0Z" fill="#FFFFFF"></path>
            </svg>
            <span>&nbsp;{{ article.username }}</span>
            <span>·</span>
            <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;">
              <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#409EFF"></path>
              <path
                d="M654.222222 256c-17.066667 0-28.444444 11.377778-28.444444 28.444444v56.888889c0 17.066667 11.377778 28.444444 28.444444 28.444445s28.444444-11.377778 28.444445-28.444445v-56.888889c0-17.066667-11.377778-28.444444-28.444445-28.444444zM369.777778 256c-17.066667 0-28.444444 11.377778-28.444445 28.444444v56.888889c0 17.066667 11.377778 28.444444 28.444445 28.444445s28.444444-11.377778 28.444444-28.444445v-56.888889c0-17.066667-11.377778-28.444444-28.444444-28.444444z"
                fill="#FFFFFF"></path>
              <path
                d="M725.333333 312.888889H711.111111v28.444444c0 31.288889-25.6 56.888889-56.888889 56.888889s-56.888889-25.6-56.888889-56.888889v-28.444444h-170.666666v28.444444c0 31.288889-25.6 56.888889-56.888889 56.888889s-56.888889-25.6-56.888889-56.888889v-28.444444h-14.222222c-22.755556 0-42.666667 19.911111-42.666667 42.666667v341.333333c0 22.755556 19.911111 42.666667 42.666667 42.666667h426.666666c22.755556 0 42.666667-19.911111 42.666667-42.666667v-341.333333c0-22.755556-19.911111-42.666667-42.666667-42.666667zM426.666667 654.222222h-56.888889c-17.066667 0-28.444444-11.377778-28.444445-28.444444s11.377778-28.444444 28.444445-28.444445h56.888889c17.066667 0 28.444444 11.377778 28.444444 28.444445s-11.377778 28.444444-28.444444 28.444444z m227.555555 0h-56.888889c-17.066667 0-28.444444-11.377778-28.444444-28.444444s11.377778-28.444444 28.444444-28.444445h56.888889c17.066667 0 28.444444 11.377778 28.444445 28.444445s-11.377778 28.444444-28.444445 28.444444z m0-113.777778h-56.888889c-17.066667 0-28.444444-11.377778-28.444444-28.444444s11.377778-28.444444 28.444444-28.444444h56.888889c17.066667 0 28.444444 11.377778 28.444445 28.444444s-11.377778 28.444444-28.444445 28.444444z"
                fill="#FFFFFF"></path>
            </svg>
            <span>&nbsp;{{ article.createTime }}</span>
            <span>·</span>
            <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;">
              <path d="M14.656 512a497.344 497.344 0 1 0 994.688 0 497.344 497.344 0 1 0-994.688 0z"
                    fill="#FF0000"></path>
              <path
                d="M374.976 872.64c-48.299-100.032-22.592-157.44 14.421-211.37 40.448-58.966 51.115-117.611 51.115-117.611s31.659 41.386 19.115 106.005c56.149-62.72 66.816-162.133 58.325-200.405 127.317 88.746 181.59 281.002 108.181 423.381C1016 652.501 723.093 323.2 672.277 285.867c16.939 37.333 20.054 100.032-14.101 130.474-58.027-219.84-201.664-265.002-201.664-265.002 16.96 113.536-61.781 237.397-137.344 330.24-2.816-45.163-5.632-76.544-29.483-119.808-5.333 82.176-68.373 149.269-85.29 231.445-22.912 111.637 17.237 193.173 170.581 279.424z"
                fill="#FFFFFF"></path>
            </svg>
            <span>&nbsp;{{ article.viewCount }}</span>
            <span>·</span>
            <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;">
              <path
                d="M113.834667 291.84v449.194667a29.013333 29.013333 0 0 0 28.842666 29.013333h252.928v90.453333l160.597334-90.453333h252.928a29.013333 29.013333 0 0 0 29.013333-29.013333V291.84a29.013333 29.013333 0 0 0-29.013333-29.013333h-665.6a29.013333 29.013333 0 0 0-29.696 29.013333z"
                fill="#FFDEAD"></path>
              <path
                d="M809.130667 262.826667h-665.6a29.013333 29.013333 0 0 0-28.842667 29.013333v40.106667a29.013333 29.013333 0 0 1 28.842667-29.013334h665.6a29.013333 29.013333 0 0 1 29.013333 29.013334V291.84a29.013333 29.013333 0 0 0-29.013333-29.013333z"
                fill="#FFF3DB"></path>
              <path
                d="M556.202667 770.048h252.928a29.013333 29.013333 0 0 0 29.013333-29.013333V362.837333s-59.733333 392.533333-724.309333 314.709334v63.488a29.013333 29.013333 0 0 0 28.842666 29.013333h253.098667v90.453333z"
                fill="#F2C182"></path>
              <path
                d="M619.008 632.32l101.888-35.157333-131.754667-76.117334 29.866667 111.274667zM891.904 148.992a61.44 61.44 0 0 0-84.138667 22.528l-19.968 34.133333 106.666667 61.610667 19.968-34.133333a61.781333 61.781333 0 0 0-22.528-84.138667z"
                fill="#69BAF9"></path>
              <path d="M775.338667 198.775467l131.669333 76.032-186.026667 322.218666-131.6864-76.032z"
                    fill="#F7FBFF"></path>
              <path
                d="M775.168 198.826667l-5.290667 9.216 59.221334 34.133333a34.133333 34.133333 0 0 1 12.458666 46.592l-139.946666 242.346667a34.133333 34.133333 0 0 1-46.762667 12.629333l-59.050667-34.133333-6.656 11.434666 88.746667 51.2L720.896 597.333333l186.026667-322.56z"
                fill="#D8E3F0"></path>
              <path
                d="M616.448 622.592l2.56 9.728 101.888-35.157333-44.885333-25.941334-59.562667 51.370667zM891.904 148.992c-1.024 0-2.218667-0.853333-3.242667-1.536A61.610667 61.610667 0 0 1 887.466667 204.8l-19.968 34.133333-73.728-42.496-5.12 8.704 106.666666 61.610667 19.968-34.133333a61.781333 61.781333 0 0 0-23.381333-83.626667z"
                fill="#599ED4"></path>
              <path
                d="M265.898667 417.621333H494.933333a17.066667 17.066667 0 1 0 0-34.133333H265.898667a17.066667 17.066667 0 1 0 0 34.133333zM265.898667 533.504H494.933333a17.066667 17.066667 0 0 0 0-34.133333H265.898667a17.066667 17.066667 0 0 0 0 34.133333z"
                fill="#3D3D63"></path>
              <path
                d="M959.488 354.645333a99.84 99.84 0 0 0-23.722667-127.488 78.677333 78.677333 0 0 0-142.848-64.170666l-11.605333 20.138666a17.066667 17.066667 0 0 0-20.821333 7.168l-32.085334 55.466667H142.677333a46.250667 46.250667 0 0 0-45.909333 46.08v449.194667a46.08 46.08 0 0 0 45.909333 46.08h236.032v73.386666a17.066667 17.066667 0 0 0 8.362667 14.848 17.066667 17.066667 0 0 0 8.704 2.218667 17.066667 17.066667 0 0 0 8.362667-2.218667l156.672-88.234666h248.32a46.08 46.08 0 0 0 46.08-46.08V398.677333L921.6 283.306667a17.066667 17.066667 0 0 0-4.266667-21.504l1.877334-3.413334a65.365333 65.365333 0 0 1 10.410666 79.189334l-53.077333 91.989333a56.832 56.832 0 0 0 20.821333 77.653333 17.066667 17.066667 0 0 0 24.234667-6.314666 17.066667 17.066667 0 0 0-6.997333-23.04 23.04 23.04 0 0 1-8.362667-31.061334z m-138.410667 386.389334a11.946667 11.946667 0 0 1-11.946666 11.946666H556.202667a17.066667 17.066667 0 0 0-8.362667 2.218667l-134.997333 76.117333v-61.269333a17.066667 17.066667 0 0 0-17.066667-17.066667H142.677333a11.946667 11.946667 0 0 1-11.776-11.946666V291.84a11.946667 11.946667 0 0 1 11.776-11.946667h565.930667L574.464 512a17.066667 17.066667 0 0 0-1.706667 12.970667L597.333333 615.253333H265.898667a17.066667 17.066667 0 1 0 0 34.133334h352.938666a17.066667 17.066667 0 0 0 5.802667 0l102.4-35.328a17.066667 17.066667 0 0 0 9.216-7.509334l85.333333-147.968z m-204.8-184.661334l63.829334 36.864-49.322667 17.066667z m206.848-170.666666v1.365333l-108.373333 186.709333-102.4-59.050666L781.482667 221.866667l102.4 59.050666z m76.458667-161.28L887.466667 244.224l-76.970667-44.373333 11.264-19.797334a44.544 44.544 0 1 1 77.141333 44.544z"
                fill="#3D3D63"></path>
            </svg>
            <span>&nbsp;{{ article.commentCount }}</span>
            <span>·</span>
            <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;">
              <path
                d="M510.671749 348.792894S340.102978 48.827055 134.243447 254.685563C-97.636714 486.565724 510.671749 913.435858 510.671749 913.435858s616.107079-419.070494 376.428301-658.749272c-194.095603-194.096626-376.428302 94.106308-376.428301 94.106308z"
                fill="#FF713C"></path>
              <path
                d="M510.666632 929.674705c-3.267417 0-6.534833-0.983397-9.326413-2.950192-16.924461-11.872399-414.71121-293.557896-435.220312-529.448394-5.170766-59.482743 13.879102-111.319341 56.643068-154.075121 51.043536-51.043536 104.911398-76.930113 160.095231-76.930114 112.524796 0 196.878996 106.48115 228.475622 153.195078 33.611515-45.214784 122.406864-148.20646 234.04343-148.20646 53.930283 0 105.46603 24.205285 153.210428 71.941496 45.063335 45.063335 64.954361 99.200326 59.133795 160.920016C935.306982 641.685641 536.758893 915.327952 519.80271 926.859589a16.205077 16.205077 0 0 1-9.136078 2.815116zM282.857183 198.75574c-46.25344 0-92.396363 22.682605-137.127124 67.413365-36.149315 36.157501-51.614541 78.120218-47.25321 128.291898 17.575284 202.089671 352.199481 455.119525 412.332023 499.049037 60.434417-42.86732 395.406538-289.147446 414.567947-492.458945 4.933359-52.344159-11.341303-96.465029-49.759288-134.88199-41.431621-41.423435-85.24243-62.424748-130.242319-62.424748-122.041544 0-220.005716 152.203494-220.989114 153.742547-3.045359 4.806469-8.53335 7.883551-14.101159 7.534603a16.257266 16.257266 0 0 1-13.736863-8.184403c-0.902556-1.587148-91.569532-158.081365-213.690893-158.081364z"
                fill="#885F44"></path>
            </svg>
            <span>&nbsp;{{ article.likeCount }}</span>
          </div>
        </div>

        <div class="article-info-news"
             @click="weiYanDialogVisible = true"
             v-if="!$common.isEmpty(currentUser) && currentUser.id === article.userId">
          <svg width="30" height="30" viewBox="0 0 1024 1024">
            <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
            <path
              d="M989.866667 512c0 263.918933-213.947733 477.866667-477.866667 477.866667S34.133333 775.918933 34.133333 512 248.081067 34.133333 512 34.133333s477.866667 213.947733 477.866667 477.866667z"
              fill="#FF7744"></path>
            <path
              d="M512 221.866667A51.2 51.2 0 0 1 563.2 273.066667v187.733333H750.933333a51.2 51.2 0 0 1 0 102.4h-187.733333V750.933333a51.2 51.2 0 0 1-102.4 0v-187.733333H273.066667a51.2 51.2 0 0 1 0-102.4h187.733333V273.066667A51.2 51.2 0 0 1 512 221.866667z"
              fill="#FFFFFF"></path>
          </svg>
        </div>
      </div>
      <!-- 文章 -->
      <div style="background: var(--background);">
        <div class="article-container my-animation-slide-bottom">
          <div v-if="!$common.isEmpty(article.videoUrl)" style="margin-bottom: 20px">
            <videoPlayer :url="{src: $common.decrypt(article.videoUrl)}"
                         :cover="!$common.isEmpty(article.articleCover)?article.articleCover:$constant.random_image+new Date()+Math.floor(Math.random()*10)">
            </videoPlayer>
          </div>

          <!-- 最新进展 -->
          <div v-if="!$common.isEmpty(treeHoleList)" class="process-wrap">
            <el-collapse accordion :model-value="'1'">
              <el-collapse-item title="最新进展" name="1">
                <process :treeHoleList="treeHoleList" @deleteTreeHole="deleteTreeHole"></process>
              </el-collapse-item>
            </el-collapse>

            <hr>
          </div>

          <!-- 文章内容 -->
          <MdEditor
            v-model="articleContentHtml"
            class="entry-content"
            :modelValue="articleContentHtml"
            :previewOnly="true"
            :toolbars="{}"
            :editorId="'article-editor-' + article.id"
            ref="entryContentRef"
          />
          <!-- 为了向后兼容，保留原有的引用方式 -->
          <div style="display: none;" ref="entryContentRefOld"></div>
          <!-- 最后更新时间 -->
          <div class="article-update-time">
            <span>文章最后更新于 {{ article.updateTime }}</span>
          </div>
          <!-- 分类 -->
          <div class="article-sort">
            <span
              @click="$router.push({path: '/sort', query: {sortId: article.sortId, labelId: article.labelId}})">{{
                article.sort.sortName + " ▶ " + article.label.labelName
              }}</span>
          </div>
          <!-- 作者信息 -->
          <blockquote>
            <div>
              作者：{{ article.username }}
            </div>
            <div>
              <span>版权&许可请详阅</span>
              <span style="color: #38f;cursor: pointer"
                    @click="copyrightDialogVisible = true">
                版权声明
              </span>
            </div>
          </blockquote>
          <!-- 订阅 -->
          <!--          <div class="myCenter" id="article-like" @click="subscribeLabel()">-->
          <div class="myCenter" id="article-like">
            <el-icon class="article-like-icon" :class="{'article-like': subscribe}"
               @click="subscribeLabel()"><Thumb /></el-icon>
            <div class="class">
              <img class="article-newlike-img" :src="$constant.newLike" alt="点赞"
                   @click="addArticleLikeCount()">
              <!--              <span>&nbsp;{{ article.likeCount }}</span>-->
            </div>

          </div>

          <!-- 评论 -->
          <div v-if="article.commentStatus === true">
            <comment :type="'article'" :source="article.id" :userId="article.userId"></comment>
          </div>
        </div>

        <div ref="tocElementRef" class="toc"></div>
      </div>

      <div style="background: var(--background)">
        <myFooter></myFooter>
      </div>

      <div ref="tocButtonRef" @click="clickTocButton()" :style="{bottom: tocButtonBottom}">
    <i class="fa fa-align-justify" aria-hidden="true"></i>
  </div>


      <el-dialog title="版权声明"
                 v-model="copyrightDialogVisible"
                 width="80%"
                 :append-to-body="true"
                 class="article-copy"
                 center>
        <div style="display: flex;align-items: center;flex-direction: column">
          <el-avatar shape="square" :size="35" :src="webInfo.avatar"></el-avatar>
          <div class="copyright-container">
            <p>
              {{ webInfo.webName }}是指运行在{{
                $constant.host
              }}域名及相关子域名上的网站，本条款描述了{{ webInfo.webName }}的网站版权声明：
            </p>
            <ul>
              <li>
                {{ webInfo.webName
                }}提供的所有文章、展示的图片素材等内容部分来源于互联网平台，仅供学习参考。如有侵犯您的版权，请联系{{ webInfo.webName }}负责人，{{ webInfo.webName }}承诺将在一个工作日内改正。
              </li>
              <li>
                {{ webInfo.webName
                }}不保证网站内容的全部准确性、安全性和完整性，请您在阅读、下载及使用过程中自行确认，{{ webInfo.webName }}亦不承担上述资源对您造成的任何形式的损失或伤害。
              </li>
              <li>未经{{ webInfo.webName }}允许，不得盗链、盗用本站内容和资源。</li>
              <li>
                {{ webInfo.webName }}旨在为广大用户提供更多的信息；{{ webInfo.webName }}不保证向用户提供的外部链接的准确性和完整性，该外部链接指向的不由本站实际控制的任何网页上的内容，{{ webInfo.webName }}对其合法性亦概不负责，亦不承担任何法律责任。
              </li>
              <li>
                {{ webInfo.webName
                }}中的文章/视频（包括转载文章/视频）的版权仅归原作者所有，若作者有版权声明或文章从其它网站转载而附带有原所有站的版权声明者，其版权归属以附带声明为准；文章仅代表作者本人的观点，与{{ webInfo.webName }}立场无关。
              </li>
              <li>
                {{ webInfo.webName }}自行编写排版的文章均采用
                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" style="color: #38f;text-decoration: none;">
                  知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议
                </a>
              </li>
              <li>
                许可协议标识：
                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                  <img alt="知识共享许可协议"
                       src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
                       style="margin-top: 5px">
                </a>
              </li>
            </ul>
          </div>
        </div>
      </el-dialog>

      <el-dialog title="最新进展"
                 v-model="weiYanDialogVisible"
                 width="40%"
                 :append-to-body="true"
                 :close-on-click-modal="false"
                 destroy-on-close
                 center>
        <div>
          <div class="myCenter" style="margin-bottom: 20px">
            <el-date-picker
              v-model="newsTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              align="center"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
          <commentBox :disableGraffiti="true"
                      @submitComment="submitWeiYan">
          </commentBox>
        </div>
      </el-dialog>
    </div>

    <!-- 微信 -->
    <el-dialog title="密码"
               :modal="false"
               v-model="showPasswordDialog"
               width="25%"
               :append-to-body="true"
               destroy-on-close
               :before-close="pwdCloseBtn"
               center>

      <div>
        <div>
          <div class="password-content">{{ tips }}</div>
        </div>
        <div style="margin: 20px auto">
          <el-input maxlength="30" v-model="password"></el-input>
        </div>
        <div style="display: flex;justify-content: center">
          <proButton :info="'提交'"
                     @click="submitPassword()"
                     :before="$constant.before_color_2"
                     :after="$constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch, inject, computed, nextTick } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { ElMessage, ElMessageBox, ElNotification, ElIcon } from 'element-plus'
import { Thumb } from '@element-plus/icons-vue'
// 导入状态管理
import { useUserStore, useWebInfoStore } from '@/stores'
import MdEditor from 'md-editor-v3'

// 导入API模块
import { articleApi, userApi, weiYanApi } from '@/api/index.js'

// 导入组件
const myFooter = defineAsyncComponent(() => import('./common/myFooter.vue'))
const comment = defineAsyncComponent(() => import('./comment/comment.vue'))
const process = defineAsyncComponent(() => import('./common/process.vue'))
const commentBox = defineAsyncComponent(() => import('./comment/commentBox.vue'))
const proButton = defineAsyncComponent(() => import('./common/proButton.vue'))
const videoPlayer = defineAsyncComponent(() => import('./common/videoPlayer.vue'))

// 导入类型
import { CommonUtils, AppConstants, Article, Sort, Label, WeiYan } from '@/types'

// 获取注入的全局属性
const $common = inject<CommonUtils>('$common')!
const $constant = inject<AppConstants>('$constant')!

// 使用路由和状态管理
const route = useRoute()
const userStore = useUserStore()
const webInfoStore = useWebInfoStore()

// 计算属性
const currentUser = computed(() => userStore.currentUser)
const webInfo = computed(() => webInfoStore.webInfo)

// 响应式数据
const id = ref<string | string[]>(route.query.id as string | string[])
const subscribe = ref<boolean>(false)
const article = ref<Article>({} as Article)
const articleContentHtml = ref<string>("")
const treeHoleList = ref<WeiYan[]>([])
const weiYanDialogVisible = ref<boolean>(false)
const copyrightDialogVisible = ref<boolean>(false)
const newsTime = ref<string>("")
const showPasswordDialog = ref<boolean>(false)
const password = ref<string>("")
const tips = ref<string>("")
const scrollTop = ref<number>(0)

// DOM引用
const tocButtonRef = ref(null)
const tocElementRef = ref(null)
const articleContentRef = ref(null)
const entryContentRef = ref(null)

// 由于我们使用md-editor-v3进行渲染，移除MarkdownIt初始化

// 生命周期钩子：组件挂载后
onMounted(async () => {
  // 检查是否有密码
  if (id.value) {
    getArticle(localStorage.getItem("article_password_" + id.value))

    if ("0" !== localStorage.getItem("showSubscribe")) {
      ElNotification({
        title: '文章订阅',
        type: 'success',
        message: '点击文章下方小手 - 订阅/取消订阅专栏（标签）',
        duration: 0,
        onClose: () => localStorage.setItem("showSubscribe", "0")
      })
    }
  }
  window.addEventListener('scroll', onScrollPage)
})

// 生命周期钩子：组件卸载前
onBeforeUnmount(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', onScrollPage)
})

// 监听滚动位置
const tocButtonBottom = ref('8vh')
watch(scrollTop, (newVal) => {
  let isShow = newVal - window.innerHeight > 30
  tocButtonBottom.value = isShow ? '15vh' : '8vh'
})

// 点击目录按针
const showToc = ref(false)
const clickTocButton = () => {
  showToc.value = !showToc.value
}
// 点击目录按钮
// 点击目录按钮已定义在上面

// 订阅/取消订阅专栏
const subscribeLabel = async (): Promise<void> => {
  if ($common.isEmpty(currentUser.value)) {
    ElMessage({
      message: "请先登录！",
      type: "error"
    })
    return
  }

  try {
    await ElMessageBox.confirm(
      '确认' + (subscribe.value ? '取消订阅' : '订阅') + '专栏【' + article.value.label.labelName + '】？' + 
      (subscribe.value ? "" : "订阅专栏后，该专栏发布新文章将通过邮件通知订阅用户。"), 
      subscribe.value ? "取消订阅" : "文章订阅", {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true
    })
    
    const res = await userApi.subscribe({
      labelId: article.value.labelId,
      flag: !subscribe.value
    })
    
    if (!res.data) {
      ElMessage({
        message: '操作成功',
        type: "success"
      })
    }
    subscribe.value = !subscribe.value
  } catch (error: any) {
    if (error.name !== 'CanceledError') {
      ElMessage({
        message: error.message || '操作失败',
        type: "error"
      })
    } else {
      ElMessage({
        type: 'info',
        message: '已取消!'
      })
    }
  }
}
// 提交密码
const submitPassword = (): void => {
  if ($common.isEmpty(password.value)) {
    ElMessage({
      message: "请先输入密码！",
      type: "error"
    });
    return;
  }
  
  getArticle(password.value);
  password.value = "";
  showPasswordDialog.value = false;
}
// 删除树洞消息
const deleteTreeHole = async (holeId: string): Promise<void> => {
  if ($common.isEmpty(currentUser.value)) {
    ElMessage({
      message: "请先登录！",
      type: "error"
    });
    return;
  }

  try {
    await ElMessageBox.confirm(
      '确认删除该动态吗?', 
      '删除确认', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }
    )
    
    await weiYanApi.deleteWeiYan(holeId)
    
    ElMessage({
      type: 'success',
      message: '删除成功!'
    });
    
    getNews();
  } catch (error: any) {
    if (error.name !== 'CanceledError') {
      ElMessage({
        message: error.message || '操作失败',
        type: "error"
      });
    } else {
      ElMessage({
        type: 'info',
        message: '已取消删除!'
      });
    }
  }
}
// 提交微言
const submitWeiYan = async (content: string): Promise<void> => {
  let weiYan: WeiYan = {
    content: content,
    createTime: newsTime.value,
    source: article.value.id
  }

  try {
    await weiYanApi.saveWeiYan(weiYan)
    
    weiYanDialogVisible.value = false;
    newsTime.value = "";
    getNews();
  } catch (error: any) {
    ElMessage({
      message: error.message || '操作失败',
      type: "error"
    });
  }
}
// 获取树洞消息列表
const getNews = async (): Promise<void> => {
  try {
    const res = await weiYanApi.listWeiYan({
      current: 1,
      size: 9999,
      source: article.value.id
    })
    
    if (!res.data) {
      return;
    }
    
    res.data.records.forEach(c => {
      c.content = c.content.replace(/\n{2,}/g, '<div style="height: 12px"></div>');
      c.content = c.content.replace(/\n/g, '<br/>');
      c.content = $common.faceReg(c.content);
      c.content = $common.pictureReg(c.content);
    });
    treeHoleList.value = res.data.records;
  } catch (error: any) {
    ElMessage({
      message: error.message || '获取消息失败',
      type: "error"
    });
  }
}
// 监听页面滚动
const onScrollPage = (): void => {
  scrollTop.value = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
}
// 获取目录
const getTocbot = () => {
  let script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = $constant.tocbot
  let headElement = document.querySelector('head')
  if (headElement) {
    headElement.appendChild(script)
  }

  // 引入成功
  script.onload = function () {
    if (typeof tocbot !== 'undefined') {
      tocbot.init({
        tocSelector: '.toc',
        // 使用预览区域作为内容选择器
        contentSelector: `.md-editor-preview`,
        headingSelector: 'h1, h2, h3, h4, h5',
        scrollSmooth: true,
        fixedSidebarOffset: 'auto',
        scrollSmoothOffset: -100,
        hasInnerContainers: false
      })
    }
  }
}

// 添加ID
const addId = (): void => {
  if (entryContentRef.value) {
    const headings = entryContentRef.value.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading, i) => {
      if (!heading.id) {
        heading.id = 'toc-' + i;
      }
    });
  }
}
// 获取文章详情
const getArticle = async (passwordVal?: string): Promise<void> => {
  try {
    const res = await articleApi.getArticleById({
      id: id.value,
      password: passwordVal
    })
    
    if (!$common.isEmpty(res.data)) {
      article.value = res.data;
      
      // 检查是否点赞
      const checkHasLike = (): void => {
        // 检查是否点赞的实现
      };
      checkHasLike();
      
      // 获取动态消息
      getNews();
      
      // 使用md-editor-v3渲染文章内容（仅预览模式）
      articleContentHtml.value = article.value.articleContent;
      
      nextTick(() => {
        // 使用MdEditor时，imgShow直接针对整个预览区域
        $common.imgShow(".md-editor-preview img");
        // 对于MdEditor，我们需要获取预览区域的DOM元素
        const previewElement = document.querySelector(`#article-editor-${article.value.id}-preview`);
        if (previewElement) {
          // 将ref设置为预览元素，以便后续函数使用
          entryContentRef.value = previewElement;
          highlight();
          addId();
          getTocbot();
        }
      });
      
      if (!password.value) {
        localStorage.setItem("article_password_" + id.value, password.value);
      }
      
      showPasswordDialog.value = false;
      
      // 检查是否已订阅
      if (!currentUser.value || !currentUser.value.subscribe) {
        return;
      }
      subscribe.value = JSON.parse(currentUser.value.subscribe).includes(article.value.labelId);
    }
  } catch (error: any) {
    if (error.message && error.message.startsWith("密码错误")) {
      if (!password.value) {
        ElMessage({
          message: "密码错误，请重新输入！",
          type: "error"
        });
      }
      tips.value = error.message.substring(4);
      showPasswordDialog.value = true;
    } else {
      ElMessage({
        message: error.message || '获取文章失败',
        type: "error"
      });
    }
  }
}

// 代码高亮
const highlight = () => {
  // 此函数涉及第三方库（hljs、ClipboardJS）需要保持原样
  // 仅进行必要的优化
  if (!entryContentRef.value) return
  
  const preElements = entryContentRef.value.querySelectorAll('pre')
  preElements.forEach((item, i) => {
    const preCode = item.querySelector('code')
    if (!preCode) return

    let classNameStr = preCode.className
    let classNameArr = classNameStr.split(' ')

    let lang = ''
    classNameArr.some(className => {
      if (className.indexOf('language-') > -1) {
        lang = className.substring(className.indexOf('-') + 1, className.length)
        return true
      }
    })

    // 检测语言是否存在，不存在则自动检测
    let language = hljs.getLanguage(lang.toLowerCase())
    if (language === undefined) {
      let autoLanguage = hljs.highlightAuto(preCode.textContent)
      preCode.classList.remove('language-' + lang)
      lang = autoLanguage.language
      if (lang === undefined) {
        lang = 'java'
      }
      preCode.classList.add('language-' + lang)
    } else {
      lang = language.name
    }

    // 设置属性
    item.classList.add('highlight-wrap')
    item.setAttribute('autocomplete', 'off')
    item.setAttribute('autocorrect', 'off')
    item.setAttribute('autocapitalize', 'off')
    item.setAttribute('spellcheck', 'false')
    item.setAttribute('contenteditable', 'false')
    
    preCode.setAttribute('data-rel', lang.toUpperCase())
    preCode.classList.add(lang.toLowerCase())
    
    // 启用代码高亮
    hljs.highlightBlock(preCode)
    // 启用代码行号
    hljs.lineNumbersBlock(preCode)
  })

  const codeBlocks = entryContentRef.value.querySelectorAll('pre code')
  codeBlocks.forEach((block, i) => {
    block.id = 'hljs-' + i

    const copyLink = document.createElement('a')
    copyLink.className = 'copy-code'
    copyLink.href = 'javascript:'
    copyLink.setAttribute('data-clipboard-target', '#hljs-' + i)
    copyLink.innerHTML = '<i class="fa fa-clipboard" aria-hidden="true"></i>'
    
    block.parentNode.appendChild(copyLink)
  })
  
  // 初始化 ClipboardJS
  if (typeof ClipboardJS !== 'undefined') {
    new ClipboardJS('.copy-code')
  }

  // 包装表格
  const tables = entryContentRef.value.querySelectorAll('table')
  if (tables.length > 0) {
    tables.forEach(table => {
      // 仅在没有包装的时候才包装
      if (!table.parentNode.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div')
        wrapper.className = 'table-wrapper'
        table.parentNode.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      }
    })
  }
}
// 添加点赞数
const addArticleLikeCount = async () => {
  try {
    let loginFlag = $common.isEmpty(currentUser.value)

    await articleApi.addArticleLikeCount({
      articleId: id.value,
      userId: loginFlag ? null : currentUser.value.id,
      operation: 0
    })
    
    ElMessage({
      type: 'success',
      message: '点赞成功！'
    })
  } catch (error) {
    ElMessage({
      message: error.message || '点赞失败',
      type: "error"
    })
  }
};

// 检查是否已点赞
const checkHasLike = async () => {
  if($common.isEmpty(currentUser.value)){
    return false;
  }
  
  // 已登录 查看是否被当前登录用户点赞
  try {
    const res = await articleApi.checkHasLike({articleId: id.value})
    console.log(res.data)
  } catch (error) {
    console.error('检查点赞状态失败:', error)
  }
}

// 密码弹窗关闭按钮
const pwdCloseBtn = () => {
  router.push('/')
};
</script>

<style scoped>

.article-head {
  height: 40vh;
  position: relative;
}

.article-image::before {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--miniMask);
  content: "";
}

.article-info-container {
  position: absolute;
  bottom: 15px;
  left: 20%;
  color: var(--white);
}

.article-info-news {
  position: absolute;
  bottom: 10px;
  right: 20%;
  cursor: pointer;
  animation: scale 1s ease-in-out infinite;
}

.article-title {
  font-size: 28px;
  margin-bottom: 15px;
}

.article-info {
  font-size: 14px;
  user-select: none;
}

.article-info i {
  margin-right: 6px;
}

.article-info span:not(:last-child) {
  margin-right: 5px;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.article-update-time {
  color: var(--greyFont);
  font-size: 12px;
  margin: 20px 0;
  user-select: none;
}

blockquote {
  line-height: 2;
  border-left: 0.2rem solid var(--blue);
  padding: 10px 1rem;
  background-color: var(--azure);
  border-radius: 4px;
  margin: 0 0 40px 0;
  user-select: none;
  color: var(--black);
}

.article-sort {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.article-sort span {
  padding: 3px 10px;
  background-color: var(--themeBackground);
  border-radius: 5px;
  font-size: 14px;
  color: var(--white);
  transition: all 0.3s;
  margin-right: 25px;
  cursor: pointer;
  user-select: none;
}

.article-sort span:hover {
  background-color: var(--red);
}

.article-like {
  color: var(--red) !important;
}

.article-like-icon {
  font-size: 37px;
  cursor: pointer;
  color: var(--greyFont);
  transition: all 0.5s;
  border-radius: 50%;
  margin-bottom: 20px;
}

.article-like-icon:hover {
  transform: rotate(360deg);
}

.process-wrap {
  margin: 0 0 40px;
}

.process-wrap hr {
  position: relative;
  margin: 10px auto 60px;
  border: 2px dashed var(--lightGreen);
  overflow: visible;
}

.process-wrap hr:before {
  position: absolute;
  top: -14px;
  left: 5%;
  color: var(--lightGreen);
  content: '❄';
  font-size: 30px;
  line-height: 1;
  transition: all 1s ease-in-out;
}

.process-wrap hr:hover:before {
  left: calc(95% - 20px);
}

.process-wrap ::v-deep(.el-collapse-item__header) {
  border-bottom: unset;
  font-size: 20px;
  background-color: var(--background);
  color: var(--lightGreen);
}

.process-wrap ::v-deep(.el-collapse-item__wrap) {
  background-color: var(--background);
}

.process-wrap .el-collapse {
  border-top: unset;
  border-bottom: unset;
}

.process-wrap ::v-deep(.el-collapse-item__wrap) {
  border-bottom: unset;
}

.password-content {
  font-size: 13px;
  color: var(--maxGreyFont);
  line-height: 1.5;
}

.toc-button {
  position: fixed;
  right: 3vh;
  bottom: 8vh;
  animation: slide-bottom 0.5s ease-in-out both;
  z-index: 100;
  cursor: pointer;
  font-size: 23px;
  width: 30px;
}

#toc-button:hover {
  color: var(--themeBackground);
}

.copyright-container {
  color: var(--black);
  line-height: 2.5;
  padding: 0 30px 10px;
  font-size: 16px;
}

@media screen and (max-width: 700px) {
  .article-info-container {
    left: 20px;
    max-width: 320px;
  }

  .article-info-news {
    right: 20px;
  }
}


@media screen and (max-width: 400px) {
  #toc-button {
    right: 0.5vh;
  }
}

.article-newlike-img {
  width: 37px;
  margin-left: 20px;
  margin-bottom: 17px;
  cursor: pointer;
  transition: all 0.5s;
}

.article-newlike-img:hover {
  /*  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); !* 添加阴影 *!
    transform: rotate(360deg); !*翻转360*!*/
  transform: scale(1.1); /* 放大1.2倍 */
}
</style>