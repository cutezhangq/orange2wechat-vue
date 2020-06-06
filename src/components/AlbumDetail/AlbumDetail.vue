<template>
  <div style="z-index:600">
    <div class="alnum-detail-list" ref="contentHeight">
      <div class="backgroundFilter">
        <div class="filter"></div>
        <img
          class="imgicon"
          :src="ablumDetail.coverUrl"
          v-lazy="ablumDetail.coverUrl"
          v-if="ablumDetail.coverUrl !== null"
        />
        <img
          class="imgicon"
          src="@/common/image/defaultPage_album.png"
          v-if="ablumDetail.coverUrl === null"
          cross-origin="anonymous"
        />
      </div>
      <div class="album-list" v-show="!introduceShow" ref="albumListSty">
        <div class="top" ref="header">
          <p class="blockTitle">
            <span class="go_back">
              <span href="javascript:" @click.stop="goto()">
                <i class="iconfont tc-back01 back" aria-hidden="true"></i>
              </span>
            </span>
            <span class="title">歌单</span>
          </p>
        </div>
        <cube-sticky :pos="scrollY">
          <cube-scroll
            ref="scroll"
            :scroll-events="scrollEvents"
            @scroll="scrollHandler"
            :data="ablumDetail.trackSpuList"
            :options="options"
          >
            <div class="album-detail" ref="albumDetailSty">
              <div class="icon" @click="introShow">
                <div class="gradients"></div>
                <img
                  class="imgicon"
                  :src="ablumDetail.coverUrl"
                  v-lazy="ablumDetail.coverUrl"
                  v-if="ablumDetail.coverUrl !== null"
                />
                <img
                  class="imgicon"
                  src="@/common/image/defaultPage_album.png"
                  v-if="ablumDetail.coverUrl === null"
                />
                <div class="imgshadow"></div>
              </div>
              <p class="play-count">
                <i class="iconfont tc-headset"></i>
                {{ablumDetail.playCount}}
              </p>
              <div class="description">
                <h2 @click="introShow">{{ablumDetail.title}}</h2>
                <div class="detail" @click="introShow">
                  <span class="textSpan">{{ablumDetail.description}}</span>
                  <i class="iconfont tc-iconfont-left" v-show="ablumDetail.description"></i>
                </div>
              </div>
            </div>
            <!-- <div v-if="trackSpuList!=null"> -->
              <trackSPU
                :tracks="trackSpuList"
                :total="ablumDetail.trackCount"
                @clickItem="clickItem"
                :special="42"
                ref="track"
              >
                <div slot="love" class="collect">
                  <h2 class="collectLove">收藏专辑</h2>
                  <i
                    class="iconfont"
                    :class="getFavoriteIcon(ablumDetail)"
                    @click="toggleFavorite(ablumDetail)"
                  ></i>
                </div>
              </trackSPU>
            <!-- </div> -->
          </cube-scroll>
        </cube-sticky>
        <!-- <div class="loadStyle" ref="loadStyle" style="height:600px">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svgStyle">
            <rect
              x="0"
              y="0"
              rx="20"
              ry="20"
              width="100%"
              height="100%"
              style="fill:rgb(253, 251, 251);stroke:rgb(253, 251, 251)"
            />
          </svg>
        </div> -->
      </div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="introduce" v-show="introduceShow" ref="introduce">
          <div class="backgroundColor">
            <div class="head">
              <i class="iconfont tc-clear" @click="introShow"></i>
            </div>
            <div class="album-content">
              <img
                :src="ablumDetail.coverUrl"
                class="album-img"
                v-lazy="ablumDetail.coverUrl"
                v-if="ablumDetail.coverUrl !== null"
              />
              <img
                class="album-img"
                src="@/common/image/1.png"
                v-if="ablumDetail.coverUrl === null"
              />
              <div class="album-tip">{{ablumDetail.title}}</div>
              <div class="tag" v-show="ablumDetail.description">详情</div>
              <div class="album-description">{{ablumDetail.description}}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import TrackSPU from "@/components/SPU/TrackSPU";
import { axiosJWT } from "../../common/js/request";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { changeFavoriteStatus } from "@/common/js/song.js";

let fromUrl = "";
export default {
  name: "AlbumDetail",
  data() {
    return {
      ablumDetail: [],
      trackSpuList: [],
      ablumDescription: [],
      scrollEvents: ["scroll", "scroll-end"],
      scrollY: 0,
      deviceId: "gh_8f487a612fc9_002b90da5a18f152",
      // 获取屏幕的高实现自适应
      clientHeigth: 0,
      pageSize: 0,
      pageNum: 1,
      //计算当前屏幕显示多少条
      trackNum: 0,
      // flag:false,
      fromPath: "",
      introduceShow: false,
      options: {
        bounce: false
      }
    };
  },
  created() {
    this.albumListDetail(this.$route.params.id).then(callbackMessage => {
      this.ablumDetail = callbackMessage;
      this.trackSpuList = this.ablumDetail.trackSpuList;
    });
  },
  mounted() {
    this.getScreenHeight();
    let _this = this;
    window.onresize = () => {
      _this.getScreenHeight();
    };
  },
  components: {
    TrackSPU
  },
  computed: {
    ...mapGetters(["favoriteList", "initPlayer"])
  },
  watch: {
    ablumDetail(newVal) {
      if (newVal == null) {
        return;
      }
      this.initIsFavorite(newVal);
      if (this.trackNum > this.ablumDetail.trackCount) {
        this.options.pullUpLoad = false;
      }
    },
    initPlayer(newVal) {
      this.$refs.albumListSty.style.height = newVal
        ? `${this.clientHeigth - 80}px`
        : `${this.clientHeigth- 20}px`;
    }
  },
  methods: {
    introShow() {
      this.introduceShow = !this.introduceShow;
    },
    showToastTxtOnly(txt) {
      this.toast = this.$createToast({
        txt: txt,
        type: "txt",
        time: 1000
      });
      this.toast.show();
    },
    getAblumTrackList(id) {
      return axiosJWT({
        url: "/track/list",
        method: "get",
        params: {
          pageNum: ++this.pageNum,
          pageSize: 50,
          albumId: id
        }
      })
        .then(res => {
          return res.data;
        })
        .catch(res => {});
    },
    albumListDetail(id) {
      return axiosJWT({
        url: "/album/detail",
        method: "get",
        params: {
          pageSize: 50,
          albumId: id
        }
      })
        .then(res => {
          // console.log("res",res)
          return res.data;
        })
        .catch(err => {
          // console.log("err.msg",err.msg)
        });
    },
    clickItem(index) {
      this.$emit("togglePlayer");
      this.selectPlay({
        list: this.ablumDetail.trackSpuList,
        index: index
      });
    },
    scrollHandler({ y }) {
      this.scrollY = -y;
    },
    goto() {
      this.$router.back();
    },
    getFavoriteIcon(album) {
      if (this.isFavorite(album)) {
        return "tc-love2";
      }
      return "tc-love";
    },
    toggleFavorite(album) {
      if (this.isFavorite(album)) {
        this.deleteFavoriteList(album);
        changeFavoriteStatus(album, "delete", this.deviceId);
      } else {
        this.saveFavoriteList(album);
        changeFavoriteStatus(album, "add", this.deviceId);
      }
    },
    isFavorite(album) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === album.id;
      });
      return index > -1;
    },
    initIsFavorite(albumDetail) {
      if (albumDetail.isFavorite) {
        this.saveFavoriteList(albumDetail);
      }
    },
    // 获取屏幕高
    getScreenHeight() {
      this.clientHeigth =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      this.$refs.introduce.style.height = `${this.clientHeigth}px`;
      if (this.initPlayer) {
        this.$refs.albumListSty.style.height = `${this.clientHeigth - 80}px`;
      } else {
        this.$refs.albumListSty.style.height = `${this.clientHeigth-20}px`;
      }
    },
    ...mapMutations({
      setPlaylist: "SET_PLAYLIST"
    }),
    ...mapActions(["selectPlay", "deleteFavoriteList", "saveFavoriteList"])
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang="less" scoped>
.alnum-detail-list {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .backgroundFilter {
    width: 100%;
    height: 33%;
    position: absolute;
    left: 0%;
    top: 0;
    filter: blur(5px);
    .filter {
      width: 100%;
      height: 150%;
      position: absolute;
      top: -50%;
      left: 0%;
      background: gray;
      opacity: 0.7;
    }

    .imgicon {
      width: 100%;
      height: 100%;
    }
  }
  .album-list {
    width: 100%;
    height: 100%;
    position: absolute;
    .blockTitle {
      padding: 3px;
    }
    .tc-back01 {
      padding: 10px 4px;
      font-size: 18px;
      color: white;
      .back {
        font-size: 21px;
      }
    }
    .title {
      // height: 40px;
      // line-height: 40px;
      // padding-left: 1%;
      margin-bottom: 10px;
      text-align: left;
      font-size: 20px;
      font-weight: 500;
      color: #fff;
    }
    .go_back {
      left: -3px;
      top: 0px;
      padding: 10px 4px;
      font-size: 25px;
      color: #fff;
    }
    .title {
      // height: 40px;
      // line-height: 40px;
      // padding-left: 1%;
      margin-bottom: 10px;
      text-align: left;
      font-size: 20px;
      font-weight: 500;
      color: #fff;
    }
    .go_back {
      left: -3px;
      top: 0px;
      padding: 10px 4px;
      font-size: 25px;
      color: #fff;
    }
    .album-detail {
      display: block;
      position: relative;
      width: 100%;
      padding: 5%;
      float: left;
      // background: #a17531;
      .icon {
        position: relative;
        display: inline-block;
        margin: 0;
        width: 33%;
        height: 33%;
        padding-top: 33%;
        margin-bottom: 5px;
        .gradients {
          position: absolute;
          top: 0;
          width: 100%;
          height: 35px;
          border-radius: 3px;
        }
        .imgicon {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 10px;
        }
        .imgshadow {
          position: absolute;
          top: 0;
          height: 100%;
          width: 100%;
          border-radius: 10px;
          box-shadow: #adadad 0px 15px 5px 2px inset;
          -webkit-box-shadow: #adadad 0px 15px 5px 2px inset;
          opacity: 0.3;
        }
      }
      .play-count {
        position: absolute;
        top: 20px;
        right: 68%;
        //font-size: $font-size-small-s;
        font-size: 12px;
        //color: $color-text-l
        color: #fff;
      }
      .text {
        float: left;
        line-height: 16px;
        text-align: left;
        height: 40px;
        overflow: hidden;
        margin-bottom: 10px;
        //font-size: $font-size-small;
        font-size: 12px;
        word-break: break-word;
      }
      p {
        //使文字多出2行的用...表示
        overflow: hidden; /** 隐藏超出的内容 **/
        word-break: break-all;
        text-overflow: ellipsis; /** 多行 **/
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2; /** 显示的行数 **/
        margin-bottom: 0.3rem;
      }
      .description {
        display: block;
        width: 45%;
        height: 33%;
        float: right;
        margin-right: 15%;
        margin-top: 5%;
        h2 {
          font-size: 20px;
          margin-bottom: 15px;
          color: aliceblue;
          line-height: 25px;

          overflow: hidden;
          word-break: break-all;
          text-overflow: ellipsis; /** 以省略号来表示溢出的文本**/
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 2; /** 显示的行数 **/
        }
        .detail {
          width: 100%;
          position: relative;
          .textSpan {
            width: 90%;
            line-height: 16px;
            font-size: 12px;
            color: wheat;
            overflow: hidden;
            word-break: break-all;
            text-overflow: ellipsis; /** 以省略号来表示溢出的文本**/
            display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
            -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
            -webkit-line-clamp: 2; /** 显示的行数 **/
          }
          .tc-iconfont-left {
            width: 10%;
            position: absolute;
            right: 0;
            color: aliceblue;
            margin: -8% -6%;
          }
        }
      }
    }
    .collect {
      display: inline-block;
      // position: absolute;
      // right: 6%;
      width: 30%;
      height: 30px;
      line-height: 30px;
      text-align: right;
      // padding-right: 3%;

      .collectLove {
        display: inline-block;
        width: 60%;
        text-align: center;
        border-radius: 15px;
        font-size: 0.9rem;
      }
      .iconfont {
        font-size: 20px;
        margin-left: 5%;
      }
      .tc-love2 {
        color: rgb(192, 34, 34);
      }
    }
  }
  .loadStyle {
    width: 100%;
    z-index: -1;
    .svgStyle {
      width: 100%;
      height: 100%;
    }
  }
  .introduce {
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    .backgroundColor {
      width: 100%;
      height: 100%;
      background-color: gray;

      .head {
        height: 40px;
        display: flex;
        position: relative;
        .albumTitle {
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin: 1% 40% auto 40%;
          font-size: 20px;
          color: white;
        }
        .tc-clear {
          position: absolute;
          right: 1%;
          top: 20%;
          font-size: 24px;
          color: white;
        }
      }
      .album-content {
        width: 100%;
        height: 95%;
        .album-img {
          width: 40%;
          margin: 10% 30% 5% 30%;
          border-radius: 5%;
        }
        .album-tip {
          width: 80%;
          color: white;
          font-size: 20px;
          text-align: center;
          word-break: break-all;
          margin: 1% 10%;
          // text-overflow: ellipsis; /** 以省略号来表示溢出的文本**/
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          // -webkit-line-clamp: 3; /** 显示的行数 **/
        }
        .tag {
          width: 50px;
          height: 40px;
          line-height: 40px;
          border-radius: 35%;
          color: white;
          margin-left: 10%;
          margin-top: 10%;
        }
        .album-description {
          width: 80%;
          height: 45%;
          overflow: scroll;
          margin: 1% 10%;
          color: rgba(253, 247, 247, 0.6);
          font-size: 14px;
          line-height: 20px;
          word-break: break-all;
          //  text-overflow: ellipsis; /** 以省略号来表示溢出的文本**/
          //  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          //  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          // // -webkit-line-clamp: 17; /** 显示的行数 **/
        }
      }
    }
  }
}
</style>