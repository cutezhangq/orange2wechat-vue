<template>
  <div style="z-index:200">
    <div slot="content" class="content">
      <div class="HeaderTop" id="HeaderTop">
        <!--搜索框-->
          <div class="search">
            <div class="search-box-wrapper">
              <searchTab ref="query" @tabQuery="getSearchKeyWord" :historyKeyWords="this.historyKeyWords"/>
            </div>
          </div>
          <!--导航-->
          <cube-tab-bar v-model="selectedLabel"
                        show-slider
                        :use-transition="disabled"
                        ref="tabNav"
                        :data="tabLabels"
                        class="cube-tab-bar">
          </cube-tab-bar>
      </div>
          <!--曲目/专辑-->
            <div class="tab-slide-container">
              <cube-slide ref="slide"
                  :loop="loop"
                  :initial-index="initialIndex"
                  :auto-play="autoPlay"
                  :show-dots="showDots"
                  :options="slideOptions"
                  @scroll="scroll"
                  @scroll-end="scrollEnd"
                  @change="changePage"
              >
              <cube-slide-item 
                  class="cube-slide_item scroll-list-wrap" 
                  v-for="(item,index) in tabLabels" :key="index"
                  ref="scroll_list_wrap"
                  >
                 <cube-scroll 
                    ref="_scroll"
                    direction="vertical" 
                    :options="options"
                    :data="item.contentList"
                    :scroll-events="scrollEvents"
                    @scroll="scrollHandler"
                    @pulling-up="onPullingUp"
                 >
                   <ul class="list-wrapper">
                      <!--曲目-->
                      <div v-if="index === 0">
                        <div v-if="item.contentList !== null">
                          <cube-sticky :pos="scrollY" @scroll="sticky_scrollHandler" v-if="item.haveDate && !isLoading">
                            <TrackSPUSearch :tracks="item.contentList" ref="TrackSPU" @clickItem="clickItem"/>
                          </cube-sticky>
                        </div>
                        <!--缺省页-->
                        <div v-if="!item.haveDate || item.contentList===null">
                          <div class="bgImg">
                            <img :src="item.defailtPageImg_Track" class="defailtImg"/>
                            <span class="defailtTitle">{{item.defailtTitle_Track}}</span>
                          </div>
                        </div>
                      </div>

                      <!--专辑-->
                      <div v-if="index === 1">
                       <div class="panel">
                         <div v-if="item.contentList !== null">
                           <albumsList :albums="item.contentList" v-if="item.haveDate && !isLoading" class="albumspu"/>
                         </div>
                         <!--缺省页-->
                         <div v-if="!item.haveDate || item.contentList===null">
                           <div class="bgImg">
                              <img :src="item.defailtPageImg_Albums" class="defailtImg"/>
                              <span class="defailtTitle">{{item.defailtTitle_Albums}}</span>
                           </div>
                         </div>
                       </div>
                      </div>
                   </ul>
                 </cube-scroll>
              </cube-slide-item>
              </cube-slide>
          </div>
      </div>
      <Loading v-if="isLoading" style="z-index:990"/>
  </div>
</template>

<script>
import global from '@/api/global'
import {axiosJWT} from "@/common/js/request"
import searchTab from "@/components/SearchTab/SearchTab.vue";
import albumsList from "@/components/SPU/AlbumSPU.vue";
import TrackSPUSearch from '@/components/SPU/TrackSPU_Search.vue'
import {findIndex} from '@/../node_modules/cube-ui/src/common/helpers/util'
import { mapGetters,mapActions} from "vuex"
export default {
  // inject: ['reload'],
  name: "SearchInfo",
  data() {
    return {
      isLoading: true,
      //用户点击的历史记录的数据
      historyKeyWords:this.$route.params._keywords,
      //pageNum: 0,
      pageNum_track: 0,
      pageNum_album: 0,
      clientHeight:'',
      scrollEvents: ["scroll", "scroll-end"],
      options: {
        click: false,
        startY:0,
        directionLockThreshold: 0,
        pullUpLoad: true,  //上拉加载
        pullUpLoad_track: true, 
        pullUpLoad_album: true,  
        bounce: false,//禁止回弹
        // bounce:{
        //   bottom: false,
        //   top: true,
        //   left: true,
        //   right: true
        // }
      },
      selectedLabel: this.$store.getters.curSearchInfoLabel,
      disabled: false,
      tabLabels: [
        {
          label: "曲目",
          contentList: [],
          //有数据
          haveDate:true, 
          defailtPageImg_Track:require('@/common/image/defaultPage_search.png'),
          defailtTitle_Track:'哔哔，没有收录相应的曲目哦~',
        },
        {
          label: "专辑",
          contentList: [],
          haveDate:true, 
          defailtPageImg_Albums:require('@/common/image/defaultPage_search.png'),
          defailtTitle_Albums:'哔哔，没有收录相应的专辑哦~',
        }
      ],
      //请求参数
      searchParams: {
        keywords: this.$route.params._tokeywords
      },
      scrollY: 0,
      loop: false,
      autoPlay: false,
      showDots: false,
      slideOptions: {
          listenScroll: true,
          probeType: 3,
          //directionLockThreshold: 0,
      },
      type:'track',
      //curSearchKeywords:curSearchKeywords //从vuex中取出的
      currentkeywords:'',
      firstReqDate_track:false,//第一次请求是否有数据，判断是否是缺省
      firstReqDate_album:false,
      curTabNum:0,
    };
  },
  mounted(){
      this.clientHeight = this.userClientHeight
      let curSearchKeywords = this.curSearchKeywords
      this.currentkeywords = curSearchKeywords
  },
  watch: {
      clientHeight: function () {
        this.changeFixed(this.clientHeight)
      },
      '$route.path':function () {
          this.changeFixed(this.clientHeight)
      },
      curSearchKeywords:function(){
        let curSearchKeywords = this.curSearchKeywords.replace(/\ +/g, "")
        this.currentkeywords = curSearchKeywords
        this.pageNum_track = 0,
        this.pageNum_album = 0,
        this.firstReqDate_track = false
        this.firstReqDate_album = false
        this.isLoading = true
        // this.reload()
        //重新计算手机浏览器 高度
        this.$refs._scroll[0].scrollTo(0, 0)
        this.$refs._scroll[1].scrollTo(0, 0)
        this.getSearchKeyWord()
      },
      //更改 data 中对应的数据,让 data 中的数据根据 state 中的数据发生改变而改变
      "this.$store.getters.curSearchInfoLabel"(){
        this.selectedLabel = this.$store.getters.curSearchInfoLabel
      }
  },
  computed:{
      initialIndex() {
          let index = 0
          index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
          return index
      },
      ...mapGetters(["curSearchKeywords", "userClientHeight", "curSearchInfoLabel", "initPlayer"]),
  },  
  methods: {
    //动态修改样式
    changeFixed(clientHeight){                        
       this.$nextTick(()=>{
          for(let i=0;i<this.tabLabels.length;i++){
            const HeaderTopHeight = document.getElementById('HeaderTop').offsetHeight 
            if(!this.initPlayer){
               this.$refs.scroll_list_wrap[i].$el.style.height = clientHeight-HeaderTopHeight+'px'
            }
            else{
               this.$refs.scroll_list_wrap[i].$el.style.height = clientHeight-HeaderTopHeight-global.MINIPLAY_HEIGHT+'px'
            }
          }
        })
      },
    //Slide切换
    changePage (current) {
        this.selectedLabel = this.tabLabels[current].label
        this.curTabNum = current
        //将切换的slide存入vuex中
        this.$store.dispatch("curSearchInfoLabel",this.selectedLabel)
      },
    //黏性组件，吸附顶部搜索框
    sticky_scrollHandler({ y }) {  
      this.scrollY = -y;
    },
    // killCurrentPullUp() {
    //   let cubeScroll = this.$refs._scroll;
    //   cubeScroll[0].scroll.forceUpdate()
    //   cubeScroll[1].scroll.forceUpdate()
    // },
    //接收searchTab的query
    getSearchKeyWord(){  
      this.searchParams.keywords=this.currentkeywords.replace(/\ +/g, ""); 
      this.getQuery_track().then(callbackMessage_track => {
        this.isLoading = false
        this.tabLabels[0].contentList = callbackMessage_track
      })
      //控制请求发送时间
      setTimeout(()=>{
        this.getQuery_album().then(callbackMessage_album => {
          this.isLoading = false
          this.tabLabels[1].contentList = callbackMessage_album
        })  
      },400)
      
    },

    //曲目请求
    getQuery_track() {
      this.searchParams.keywords=this.currentkeywords;
      if (this.searchParams.keywords != null) {
        return axiosJWT({
          url: "/search/track",
          method: 'get',
          params:{
            pageNum: ++this.pageNum_track,
            pageSize: global.GET_TRACK_NUM,
            keywords: this.currentkeywords
        }
        }).then(res=>{
           if (res.code === 200) {
              this.isLoading = false
              this.firstReqDate_track = true  //第一次访问有数据
              this.tabLabels[0].haveDate = true;
              return res.data
            }if(res.code === 204){
              this.isLoading = false
              //是第一次请求
              if(this.firstReqDate_track === false){  //第一次默认firstReqDate为false
                this.tabLabels[0].haveDate = false;
              }
            }
          }).catch({});
      }
    },
    //专辑请求
    getQuery_album() {
      this.searchParams.keywords=this.currentkeywords;
      if (this.searchParams.keywords != null) {
        return axiosJWT({
          url: "/search/album",
          method: 'get',
          params:{
            pageNum: ++this.pageNum_album,
            pageSize: global.GET_ALBUM_NUM,
            keywords: this.currentkeywords
        }
        }).then(res=>{
           if (res.code === 200) {
              this.isLoading = false
              this.firstReqDate_album = true
              this.tabLabels[1].haveDate = true;
              return res.data
              // this.$refs._scroll[1].refresh()
            }if(res.code === 204){
             //是第一次请求
              this.isLoading = false
              if(this.firstReqDate_album === false){
                this.tabLabels[1].haveDate = false;
              }
            }
          }).catch({

          });
      }
    },
    //整体 上拉加载
    onPullingUp() {
      if(this.curTabNum === 0){
        if (this.options.pullUpLoad_track) {
          this.getQuery_track().then(
            callbackMessage_track => {
              if (callbackMessage_track == null) {
                this.options.pullUpLoad = false;
                this.options.pullUpLoad_track = false
                this.showToastTxtOnly()
                return;
              }
              this.tabLabels[0].contentList = this.tabLabels[0].contentList.concat(callbackMessage_track)
            }
          )
        }
      }
      if(this.curTabNum === 1){
        if (this.options.pullUpLoad_album) {
          this.getQuery_album().then(
            callbackMessage_album => {
              if (callbackMessage_album == null) {
                this.options.pullUpLoad = false;
                this.options.pullUpLoad_album = false
                this.showToastTxtOnly()
                return;
              }
              this.tabLabels[1].contentList = this.tabLabels[1].contentList.concat(callbackMessage_album)
            }
          )
        }
      }
    },
    scrollHandler({ y }) {
      this.scrollY = -y
    },
    //上拉加载为false时显示提示框
    showToastTxtOnly() {
      this.toast = this.$createToast({
        txt: "没有更多啦",
        type: "txt",
        time: 1000
      });
      this.toast.show();
    },
    //slide时 实时触发的事件
    scroll (pos) {
        const x = Math.abs(pos.x)
        const tabItemWidth = this.$refs.tabNav.$el.clientWidth
        const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
        const deltaX = x / slideScrollerWidth * tabItemWidth
        this.$refs.tabNav.setSliderTransform(deltaX)
        //如果是左右slide滑动（slide切换），就禁止上下滚动
        let _slideSearchInfo =this.$refs.slide.slide.movingDirectionX
        let _cubeScroll = this.$refs._scroll
        if(_slideSearchInfo === -1 || _slideSearchInfo === 1){
          for(let i=0;i<this.tabLabels.length;i++){
             _cubeScroll[i].scroll.disable()
          }
        }
    },
    //滑动结束时调用
    scrollEnd(){
      let _cubeScroll = this.$refs._scroll
      let _slideSearchInfo = this.$refs.slide.slide.movingDirectionX
      if(_slideSearchInfo === -1 || _slideSearchInfo === 1){
         for(let i=0;i<this.tabLabels.length;i++){
           //恢复上下滑动
            _cubeScroll[i].scroll.enable()
         }
      }
    },
    clickItem(index){
      // this.$emit('togglePlayer')
      if(this.curTabNum === 0){
        // console.log(this.tabLabels[0].contentList[index])
        this.selectPlay({
        list: this.tabLabels[0].contentList,
        index: index
        });
      }
      
    },
    ...mapActions(["selectPlay"])
  },
  components: {
    searchTab,
    albumsList,
    TrackSPUSearch
  },
  created() {
    //当从专辑详情页面回退时
    let curSearchKeywords = this.curSearchKeywords.replace(/\ +/g, "")
    this.currentkeywords = curSearchKeywords
    //console.log('==从vuex中拿出来的==',this.currentkeywords)
    //注意顺序，放在之后
    this.getSearchKeyWord()
    //将用户在search页面搜索的内容放入searchTab中
    this.historyKeyWords = this.searchParams.keywords.replace(/\ +/g, "")
  },
}
</script>

<style lang="less" scoped>
@import url('~@/assets/css/common.less');

.search {
  position: relative;
  top: 0;
  z-index: 100;

  overflow: hidden;
  .setFrameGradualBg();
  padding-bottom: 10px;
  .search-box-wrapper {
    margin: 0.5333333333rem 1.6rem 1.0666666667rem 1.6rem;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 4.8rem;
    bottom: 0;
    width: 100%;
  }
}
.panel {
  margin-top: 10px;
}
.tab-composite-view{
  .cube-tab-bar{
    background-color: white
  }
   .cube-tab, .cube-tab_active{
     color: #e8864c;
   }
    .cube-tab-bar-slider{
      background-color:#e8864c;
    }
    .list-wrapper{
       overflow: hidden;
       li{
        padding: 15px 10px;
        margin-top: 10px;
        text-align: left;
        background-color: white;
        font-size: 14px;
        color: #999;
        //white-space: normal;
        .line-height{
          line-height: 1.5
        }
        .is-black{
          color: black
        }
        .is-grey{
          color: #999
        }
        .is-bold{
          font-weight: bold
        }
        .top{
          display: flex;
          .avatar{
            width: 15px;
            height: 15px;
            margin-right: 2px;
            border-radius: 100%;
          }
          .time{
            flex: 1
          }
        }
        .middle{
          display: flex;
          margin: 10px 0;
          color: black;
        }
        .hot-title{
          display: flex;
          align-items: center;
          font-size: 12px;
          .hot-sequence{
            display: inline-block;
            margin-right:2px;
            padding: 3px 6px;
            border-radius: 2px;
            background-color: #e8864c;
            color: white;
          }
        }
        .hot-content{
           margin-top: 15px;
        }
       }
    }
}
.swiper{
    height: 667px;
    overflow:scroll;
  }
  .swiperSlide{
    box-sizing: border-box;
    height: auto;
  }
//scroll要设置height
.scroll-list-wrap{
  //height:667px
  overflow-y: scroll;
}
.content{
    top: 0;
    height: 100%;
    width: 100%;
    background-color: #fff;
}
.HeaderTop{
    position: fixed;
    z-index: 900;
    width: 100%;
    top: 0;
    left: 0;
}

.tab-slide-container{
  position: fixed;
      top: 88.74px;
      left: 0;
      right: 0;
      bottom: 0;
  //margin-top: 80.68px;
}
.cube-tab-bar{
  line-height:25px
}
.albumspu{
    white-space: normal;
  }
.albumspu .recommend-list .item .icon {
  margin-left: 0px!important;
}
.bgImg{
  margin: 36% 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.defailtImg{
  width: 33%;
  margin-bottom: 17px;
  // margin: 0 auto;
  // width: 59%;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-around;
  // align-items: center;
}
.defailtTitle{
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
      width:  22%;
      height: 40px;
      text-align: center;
      color: gray;
      padding: 5% 0;
    }
    .underLineLeft,.underLineRight{
      display: inline-block;
      width: 39%;
      height: 1px;
      line-height: 2px;
      border-top: 1px solid gray;
    }
  } 
</style>
