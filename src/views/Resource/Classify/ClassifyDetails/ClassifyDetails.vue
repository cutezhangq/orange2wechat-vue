<template>
  <div style="z-index:200;background-color:#fff">
     <cube-sticky :pos="scrollY">
    <div class="scroll-list-wrap" ref="scroll_list_wrap">
      <cube-scroll ref="scroll" direction="vertical" 
        :options="options" 
        :data="albumLists" 
        :scroll-events="scrollEvents"
        @scroll="scrollHandler"
        @pulling-up="onPullingUp"
      >
  <cube-sticky-ele>
        <!--top部分-->
    <div class="top" id="titleTop">
      <p class="blockTitle">
        <span class="go_back">
          <span href="javascript:" @click="goto()">
            <i class="iconfont tc-back01 back" aria-hidden="true"></i>
          </span>
        </span>
        <span class="title">{{this.curCategoryTitle}}</span>
      </p>
    </div>
</cube-sticky-ele>
        <!--分类详情-->
        <div ref="contentList" class="contentList">
          <AlbumSPU :albums="albumLists" v-if="albumLists.length && isShow"/>
        </div>
        <!-- 缺省页 -->
        <div v-if="!this.haveDate && !this.firstReqest">
          <div class="bgImg">
            <img :src="this.defailtPageImg" class="defailtImg" />
            <span class="defailtTitle">{{this.defailtTitle}}</span>
          </div>
        </div>
      </cube-scroll>
    </div>
    </cube-sticky>
    <Loading v-if="isLoading" style="z-index:990"/>
  </div>
</template>

<script>
  import global from '@/api/global'
  import { axiosJWT} from "@/common/js/request"
  import AlbumSPU from '@/components/SPU/AlbumSPU'
  import { mapGetters, mapActions} from "vuex"

  export default {
    data() {
      return {
        isLoading: true,
        isShow:true,
        pageNum: 0,
        scrollY: 0,
        clientHeight: '',
        scrollEvents: ["scroll", "scroll-end"],
        options: {
          pullUpLoad: true, //上拉加载
          bounce: false
        },
        albumLists: [],
        classifyTitle: this.$route.params._classifyTitle,
        haveDate: true,
        firstReqest: false,
        defailtPageImg: require('@/common/image/defaultPage_imgs.png'),
        defailtTitle: '该分类下没有相应的专辑啦~',
      }
    },
    mounted() {
      this.clientHeight = this.userClientHeight
    },
    watch: {
      clientHeight: function () {
        this.changeFixed(this.clientHeight)
      },
      //组件缓存---当选择的分类变化时
      curCategoryTitle: function () {
        this.isShow = false
        this.isLoading = true
        this.pageNum = 0,
          this.getAlbumList().then(callbackMessage => {
            this.isShow = true
            this.albumLists = callbackMessage
          })
        this.$refs.scroll.scrollTo(0, 0)
      }
    },
    computed: {
      ...mapGetters(["curCategoryId", "curCategoryTitle", "userClientHeight","initPlayer"]),
    },
    methods: {
      //动态修改样式
      changeFixed(clientHeight) {
        this.$nextTick(() => {
          const titleTop = document.getElementById('titleTop').offsetHeight;
          if (!this.initPlayer) {
            this.$refs.scroll_list_wrap.style.height = clientHeight + 'px';
          } else {
            this.$refs.scroll_list_wrap.style.height = clientHeight - global.MINIPLAY_HEIGHT + 'px';
          }
        })
      },
      //路由返回
      goto() {
        this.$router.push({
          name: 'resource'
        })
      },
      //请求接口
      getAlbumList() {
        //拿到vuex中保存的分类id
        let curCategoryId = this.curCategoryId
        return axiosJWT({
          url: "/album/category",
          method: 'get',
          params: {
            pageSize: global.GET_ALBUM_NUM,
            pageNum: ++this.pageNum,
            categoryId: curCategoryId
          }
        }).then(res => {
          if (res.code === 200) {
            this.isLoading = false
            this.haveDate = true
            this.firstReqest = true
            //直接返回请求到的值
            return res.data
          }
          if (res.code === 500) {
            this.isLoading = false
            this.$nextTick(() => {
              this.haveDate = false
            })
          }
        }).catch({})
      },
      //上拉加载
      onPullingUp() {
        if (this.options.pullUpLoad) {
          this.getAlbumList().then(
            callbackMessage => {
              if (callbackMessage == null) {
                this.options.pullUpLoad = false;
                this.showToastTxtOnly();
                return;
              }
              this.albumLists = this.albumLists.concat(callbackMessage);
            }
          )
        }
      },
      //滚动中实时触发
      scrollHandler({y}) {
        this.scrollY = -y
      },
      showToastTxtOnly() {
        this.toast = this.$createToast({
          txt: "没有更多啦",
          type: "txt",
          time: 1000
        });
        this.toast.show();
      }
    },
    components: {
      AlbumSPU
    },
    created() {
      this.getAlbumList().then(callbackMessage => {
        this.albumLists = callbackMessage
      })
    }
  }
</script>

<style lang='less' scoped>
  @import url('~@/assets/css/common.less');

  .blockTitle {
    margin: 0;
  }

  .title {
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 20px;
    color: #fff;
  }

  .go_back {
    left: -3px;
    top: 0px;
    padding: 10px 4px;
    font-size: 21px;
    color: #fff;
  }

  .back {
    font-size: 21px;
  }

  .bgImg {
    // height: 95%;
    // //在屏幕中水平垂直居中
    // position: absolute;
    // left: 50%;
    // top: 48%;
    // transform: translate3d(-50%,-50%,0);
    margin: 30% 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .defailtImg {
    // margin: 0 auto;
    // width: 59%;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-around;
    // align-items: center;
  }

  .defailtTitle {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-size: 14px;
    color: #ABACAD;
  }

  .underLine {
    display: inline-block;
    width: 100%;

    .line {
      display: inline-block;
      width: 22%;
      height: 40px;
      text-align: center;
      color: gray;
      padding: 5% 0;
    }

    .underLineLeft,
    .underLineRight {
      display: inline-block;
      width: 39%;
      height: 1px;
      line-height: 2px;
      border-top: 1px solid gray;
    }
  }

  .top {
    line-height: 45px;
    .setFrameGradualBg();
  }

  .contentList {
    padding-top: 16px;
    background-color: #fff;
  }
</style>
