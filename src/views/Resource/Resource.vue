<template>
  <div>
    <div slot="content" class="content">
      <!--导航-->
      <div class="topGuide" id="topGuide">
        <headerGuide ref="headerGuide" class="swiper-pagination" />
        <cube-tab-bar v-model="selectedLabel" class="header_guide" :use-transition="disabled" ref="tabNav">
          <cube-tab v-for="(item, index) in tabLabels" :key="index" :label="item.label">
            {{item.label}}
          </cube-tab>
        </cube-tab-bar>
      </div>
      <!--首页/分类/专辑/搜索-->
      <div class="tab-slide-container song-list-wrapper">
        <cube-slide ref="slide_res" :loop="loop" :initial-index="initialIndex" :auto-play="autoPlay"
          :show-dots="showDots" :options="slideOptions" @scroll="scroll" @scroll-end="scrollEnd" @change="changePage">
          <cube-slide-item class="cube-slide_item scroll-list-wrap" v-for="(item,index) in tabLabels" :key="index"
            ref="scroll_list_wrap">
            <cube-sticky :pos="scrollY">
              <cube-scroll :options="scrollOptions" direction="vertical" ref="scroll" :scroll-events="scrollEvents"
                @scroll="scrollHandler">
                  <Home v-if="index === 0" />
                  <Classify v-if="index === 1" />
                <teachingBooks @Tbooks2ResTab="getChangeTab" :resClientHeight="resClientHeight" v-if="index === 2" />
                <Search v-if="index === 3" />
              </cube-scroll>
            </cube-sticky>
          </cube-slide-item>
        </cube-slide>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/router/router'
  import global from '@/api/global'
  import headerGuide from '@/components/HeaderGuide/HeaderGuide.vue'
  import Home from '@/views/Resource/Home/Home.vue'
  import Classify from '@/views/Resource/Classify/Classify.vue'
  import teachingBooks from '@/views/Resource/TeachingBooks/TeachingBooks.vue'
  import Search from '@/views/Resource/Search/Search.vue'
  import {findIndex} from '@/../node_modules/cube-ui/src/common/helpers/util'
  import { ease} from '@/../node_modules/cube-ui/node_modules/better-scroll/src/util/ease'
  import {mapActions,mapGetters} from "vuex";

  export default {
    data() {
      return {
        clientHeight: '',
        scrollY: 0,
        //允许竖直滚动
        options: {
          eventPassthrough: 'vertical',
          click: true
        },
        //selectedLabel: "首页",
        selectedLabel: this.$store.getters.curResourceLabel,
        tabLabels: [{
            label: "首页",
          },
          {
            label: "分类",
          },
          {
            label: "教材",
          },
          {
            label: "搜索",
          }
        ],
        activeGuideIndex: 0,
        flag: true,
        scrollHeight: Number,
        disabled: true,
        loop: false,
        autoPlay: false,
        showDots: false,
        slideOptions: {
          listenScroll: true,
          probeType: 3,
          directionLockThreshold: 0,
          preventDefault: true,
          stopPropagation: true, //阻止冒泡
          allowVertical: false
        },
        scrollOptions: {
          bounce: false
          //preventDefault:true,
          //directionLockThreshold: 0,
          // pullDownLoad: {
          //   stop:200
          // }
        },
        scrollToY: -200,
        scrollToTime: 700,
        scrollToEasing: 'bounce',
        scrollEvents: ['scroll'],
        resClientHeight: Number,
        currentTab: '',
      }
    },
    mounted() {
      //是第一次进入/部分，vuex中还没有存height
      if (this.userClientHeight === '') {
        // 获取浏览器可视区域高度
        this.clientHeight = `${document.documentElement.clientHeight}`
        //this.clientHeight =   `${window.screen.height}`          
        window.onresize = function temp() {
          this.clientHeight = `${document.documentElement.clientHeight}`;
        }
      }
      // 当/是从其他页面返回时，获取从vuex中拿到的height
      else {
        this.clientHeight = this.userClientHeight
      }
    },
    watch: {
      // 如果 `clientHeight` 发生改变，这个函数就会运行
      clientHeight: function () {
        this.changeFixed(this.clientHeight)
      },
      '$route.path': function () {
        this.changeFixed(this.clientHeight)
      },
      currentTab: function () {
        //将当前点击的tab存入vuex中
        this.$store.dispatch("curResourceLabel", this.currentTab)
      }
    },
    methods: {
      //动态修改样式 获取到手机屏幕的height赋给回弹scroll的height
      changeFixed(clientHeight) {
        // this.$nextTick(()=>{
        for (let i = 0; i < this.tabLabels.length; i++) {
          // 获取高度为具体数值
          const topGuideHeight = document.getElementById('topGuide').offsetHeight
          if (!this.initPlayer) {
            //未打开播放器时
            this.$refs.scroll_list_wrap[i].$el.style.height = clientHeight - topGuideHeight + 'px';
          } else {
            //this.initPlayer为true,表示打开了播放器
            this.$refs.scroll_list_wrap[i].$el.style.height = clientHeight - topGuideHeight - global.MINIPLAY_HEIGHT +
              'px';
          }
        }
        this.resClientHeight = clientHeight
        //当前可见区域的高存入vuex
        this.$store.dispatch("userClientHeight", clientHeight)
        //  })
      },
      //黏性组件，吸附顶部
      scrollHandler({y}) {
        this.scrollY = -y;
      },
      scrollTo() {
        this.$refs.scroll.scrollTo(
          0,
          this.scrollToY,
          this.scrollToTime,
          ease[this.scrollToEasing]
        )
      },
      //Slide切换
      changePage(current) {
        this.selectedLabel = this.tabLabels[current].label
        this.currentTab = this.tabLabels[current].label
        // //当切换到教材库时，外面的slide静止,只开启里面的slide
        // const resSlide = this.$refs.slide_res.slide
        // if(this.tabLabels[current].label === "教材"){
        //   resSlide.disable()
        // }else{
        //   resSlide.enable()
        // }
      },
      //将切换的当前tab更新到vuex中
      //  ...mapActions([]),
      // 点击tab 触发事件
      clickGuideIndex(index) {
        this.activeGuideIndex = index
      },
      //slide时 实时触发的事件
      scroll(pos) {
        //tab下滑线实时移动
        const x = Math.abs(pos.x)
        const tabItemWidth = this.$refs.tabNav.$el.clientWidth
        const slideScrollerWidth = this.$refs.slide_res.slide.scrollerWidth
        const deltaX = x / slideScrollerWidth * tabItemWidth
        this.$refs.tabNav.setSliderTransform(deltaX)

        //如果是左右slide滑动（slide切换），就禁止上下滚动
        let _slideRes = this.$refs.slide_res.slide.movingDirectionX
        let _cubeScroll = this.$refs.scroll
        if (_slideRes === -1 || _slideRes === 1) {
          for (let i = 0; i < this.tabLabels.length; i++) {
            _cubeScroll[i].scroll.disable()
          }
        }
      },
      //滑动结束时调用
      scrollEnd() {
        let _cubeScroll = this.$refs.scroll
        let _slideRes = this.$refs.slide_res.slide.movingDirectionX
        if (_slideRes === -1 || _slideRes === 1) {
          for (let i = 0; i < this.tabLabels.length; i++) {
            //恢复上下滑动
            _cubeScroll[i].scroll.enable()
          }
        }
      },
      //从教材库里传过来的tab变化
      getChangeTab(changeTab) {
        this.selectedLabel = changeTab
      }
    },
    computed: {
      initialIndex() {
        let index = 0
        index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
        return index
      },
      ...mapGetters(["initPlayer", "userClientHeight", "curResourceLabel"])
    },
    components: {
      headerGuide,
      Home,
      Classify,
      teachingBooks,
      Search,
    },
    created() {
      if (this.selectedLabel === undefined) {
        this.selectedLabel = "首页"
      }
    }
  }
</script>
<style lang="less" scoped>
  @import url('~@/assets/css/common.less');

  .content {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
  }

  .swiper-pagination {
    position: relative;
    //position: -webkit-sticky;
    //position: sticky;  /* 吸附属性，header固定在顶部 */
    top: 0;
    z-index: 100;
    background-color: #fff;
  }

  .header_guide {
    //position: relative;
    display: flex;

    &::before {
      content: '';
      position: absolute;
      z-index: 200;
      left: 0;
      top: 0;
      width: 100%;
      height: 0px;
      background-color: #e4e4e4;
    }

    //position fixed
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    .setFrameGradualBg();
    width: 100%;
    height: 35px;
    display: flex;

    .cube-tab_bar {
      width: 100%
    }
  }

  div {
    display: block;
  }

  .header-cont {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    font-size: 18px;
    color: #fff;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-icon {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 1.17333rem;
    flex: 0 0 1.17333rem;
    margin-top: .08rem;
    cursor: pointer;
  }

  .iconfont {
    color: #fff;
  }

  .list-wrapper {
    overflow: hidden;
  }

  .cube-tab {
    flex: 1;
    font-size: 16px;
    padding: 7px 0;
    color: #efc894;
    text-align: center;
  }

  //cube-tab切换完后变化
  .cube-tab_active {
    color: #fff;
    font-size: 19px;
    // transition:color 2s;
    // transition:font-size 2s;
  }

  .topGuide {
    position: fixed;
    z-index: 900;
    width: 100%;
    top: 0;
    left: 0;
  }

  //scroll要设置height
  .scroll-list-wrap {
    //height:100%;
    //height:@scrollHeight;
    overflow-y: scroll;
  }

  .tab-slide-container {
    margin-top: 87.99px
  }

  .cube-tab-bar {
    .tab-slide-container {
      position: fixed;
      top: 74px;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .list-wrapper {
      overflow: hidden
    }
  }

  //test
  .list-item {
    line-height: 200px;
    height: 300px;
    font-size: 70px
  }

  .cube-pullup-wrapper .before-trigger {
    padding: 0 !important;
    min-height: 0em;
  }
</style>