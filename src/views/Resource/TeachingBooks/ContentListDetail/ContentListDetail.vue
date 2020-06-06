<template>
  <div style="z-index:200">
      <!--课文/单词-->
       <div slot="content" class="content">
         <div class="HeaderTop" id="HeaderTop">
           <!--标题-->
            <div class="header_title">
              <span class="guide_item">
                <span href="javascript:" @click="goTo('/')">
                  <i class="iconfont tc-back01 backIcon" aria-hidden="true"></i>
                </span>
                <div class="header-cont">
                  <span class="title_item">教材库</span>
                </div>
              </span>
            </div>
           <!--导航-->
           <cube-tab-bar v-model="selectedLabel"
                        show-slider
                        :use-transition="disabled"
                        ref="tabNav"
                        :data="tabLabels"
                        class="cube-tab-bar"
                        style="line-height: 25px;letter-spacing: 1px; background-color:#fff"
                        >
          </cube-tab-bar>
        </div>
        <!--单元下的课文/单词-->
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
                    :options="scrollOptions"
                    :data="item.dataList"
                 >
                   <ul class="list-wrapper">
                      <!--课文-->
                      <div v-if="index === 0">
                        <div v-if="item.haveDate">
                          <cube-sticky :pos="scrollY" @scroll="scrollHandler">
                            <TrackSPU 
                              @selectIndex="getSelectIndex" 
                              :tabIndex="item.tabIndex" 
                              :tracks="item.dataList" 
                              ref="TrackSPU" 
                              @clickItem="clickItem"/>
                          </cube-sticky>
                        </div>
                        <!--缺省页-->
                        <div v-if="!item.haveDate">
                          <div class="bgImg">
                            <img :src="item.defailtPageImg" class="defailtImg"/>
                             <!-- <i class="iconfont tc-ziyuan2 defailtImg" aria-hidden="true"></i> -->
                            <span class="defailtTitle">{{item.defailtTitle}}</span>
                          </div>
                        </div>
                      </div>
                       <!--单词-->
                       <div v-if="index === 1" >
                         <div v-if="item.haveDate">
                            <cube-sticky :pos="scrollY" @scroll="scrollHandler">
                              <TrackSPU 
                                @selectIndex="getSelectIndex" 
                                :tabIndex="item.tabIndex" 
                                :tracks="item.dataList" 
                                ref="TrackSPU" 
                                @clickItem="clickItem"/>
                            </cube-sticky>
                         </div>
                          <!--缺省页-->
                         <div v-if="!item.haveDate">
                           <div class="bgImg">
                             <img :src="item.defailtPageImg" class="defailtImg"/>
                             <!-- <i class="iconfont tc-ziyuan2 defailtImg" aria-hidden="true"></i> -->
                             <span class="defailtTitle">{{item.defailtTitle}}</span>
                           </div>
                         </div>
                       </div>
                   </ul>
                 </cube-scroll>
              </cube-slide-item>
              </cube-slide>
          </div>
      </div>
  </div>
</template>

<script>
import global from '@/api/global'
import {axiosJWT} from "@/common/js/request"
import {findIndex} from '@/../node_modules/cube-ui/src/common/helpers/util'
import TrackSPU from '@/components/SPU/TrackSPU.vue'
import { mapActions, mapGetters,mapMutations } from "vuex"

export default {
  props:{
    Event_Play:Object
  },
  data(){
    return{
      clientHeight:'',
      transitionName:'',
      selectedLabel:'课文', 
      disabled: false,
      tabLabels: [
        {
          label: '课文',  
          dataList:[],
          tabIndex:0,
          haveDate:true,  
          defailtPageImg:require('@/common/image/defaultPage_lists2.png'),
          defailtTitle:'啧啧，这里啥都没有~',
        },
        {
          label: '单词',
          dataList:[],
          tabIndex:1,
          haveDate:true, 
          defailtPageImg:require('@/common/image/defaultPage_lists2.png'),
          defailtTitle:'啧啧，这里啥都没有~',
        }
      ],
      scrollY: 0,
      loop: false,
      autoPlay: false,
      showDots: false,
      slideOptions: {
          listenScroll: true,
          probeType: 3, 
      },
      scrollOptions: {
          directionLockThreshold: 0,
          bounce: false,
          click:false,
      },
      getParams:{
        getCurrentId:this.$route.params._getCurrentId
      },
      currentClickIndex:Number,  //点击的索引
      ItemListArr:[], //选择的单个课文/单词的信息 存放数组-->发送到play的songDetail中
      tabChange:true, //true标识tabIndex:0 ；false标识tabIndex:1
      curTabNum:0,  //当前选择的tab
    }
  },
  mounted(){
      this.clientHeight = this.userClientHeight
    },
   watch: {
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    },
    '$route.path':function () {
      this.changeFixed(this.clientHeight)
      
    },
  },
  methods:{
    goTo(path){
      //带参数的路由跳转
      this.$router.push({name:'resource',params:{_selectedLabel:"教材"}})
      //this.$router.push({name:'resource'})
    },
    //动态修改样式
    changeFixed(clientHeight){                        
       this.$nextTick(()=>{
          for(let i=0;i<this.tabLabels.length;i++){
            const HeaderTopHeight = document.getElementById('HeaderTop').offsetHeight 
            if(!this.initPlayer){
               this.$refs.scroll_list_wrap[i].$el.style.height = clientHeight-HeaderTopHeight+'px';
            }
            else{
              this.$refs.scroll_list_wrap[i].$el.style.height = clientHeight-HeaderTopHeight -global.MINIPLAY_HEIGHT +'px';
            }
          }
          })
      },
    //Slide切换
    changePage (current) {
        this.selectedLabel = this.tabLabels[current].label
        this.tabChange = !this.tabChange
        this.curTabNum = current
      },
    //黏性组件，吸附顶部搜索框
    scrollHandler({ y }) {  
      this.scrollY = -y;
    },
    //slide时 实时触发的事件
    scroll (pos) {
        const x = Math.abs(pos.x)
        const tabItemWidth = this.$refs.tabNav.$el.clientWidth
        const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
        const deltaX = x / slideScrollerWidth * tabItemWidth
        this.$refs.tabNav.setSliderTransform(deltaX)
        //如果是左右slide滑动（slide切换），就禁止上下滚动
        let _slideSContentListDe =this.$refs.slide.slide.movingDirectionX
        let _cubeScroll = this.$refs._scroll
        if(_slideSContentListDe === -1 || _slideSContentListDe === 1){
          for(let i=0;i<this.tabLabels.length;i++){
             _cubeScroll[i].scroll.disable()
          }
        }
    },
    //滑动结束时调用
    scrollEnd(){
      let _cubeScroll = this.$refs._scroll
      let _slideSContentListDe = this.$refs.slide.slide.movingDirectionX
      if(_slideSContentListDe === -1 || _slideSContentListDe === 1){
         for(let i=0;i<this.tabLabels.length;i++){
           //恢复上下滑动
            _cubeScroll[i].scroll.enable()
         }
      }
    },
    //用户选择 课文/单词的相应索引
    getSelectIndex(i){
      this.currentClickIndex = i
      //拿到单个单词相应的信息
       if (!this.tabChange) { //this.tabChange为false是课文的tab
        this.ItemListArr = this.tabLabels[1].dataList[this.currentClickIndex]
       }
      if (this.tabChange) { //this.tabChange为true是单词的tab
        //拿到单个课文相应的信息
        this.ItemListArr = this.tabLabels[0].dataList[this.currentClickIndex]
      }
    },

    //获取某个单元下的课文
    getLessonList(){
      return axiosJWT({
        url:"/lesson/list",
        methods:'get',
        params:{
          contentId:this.getParams.getCurrentId //单元id
        }
      }).then(res=>{
        if (res.code === 200) {
          this.$nextTick(() => {
             this.tabLabels[0].haveDate = true;
             this.tabLabels[0].dataList = res.data
          })
        }
        if (res.code === 204) {
          this.tabLabels[0].haveDate = false;
        }
      }).catch({

      });
    },
    //获取某个单元下的单词
    getWordList(){
      return axiosJWT({
        url:"/word/list",
        methods:'get',
        params:{
          contentId:this.getParams.getCurrentId //单元id
        }
      }).then(res=>{
        if (res.code === 200) {
          this.$nextTick(() => {
             this.tabLabels[1].haveDate = true;
             this.tabLabels[1].dataList = res.data
          })
        }
        if (res.code === 204) {
          this.tabLabels[1].haveDate = false;
        }
      }).catch({

      });
    },
    clickItem(index){
      // this.$emit('togglePlayer')
      if(this.curTabNum === 0){
        this.selectPlay({
          list: this.tabLabels[0].dataList,
          index: index
        });
      }
      if(this.curTabNum === 1){
      // console.log('-----',this.tabLabels[1].dataList)  
         this.selectPlay({
          list: this.tabLabels[1].dataList,
          index: index
        });
      }
      
    },
     ...mapActions(["selectPlay"]),
    //将ItemListArr数据发送给play中
    sendItemListArr(){
      this.Event_Play.$emit("contentListDetail_Send",this.ItemListArr)
    },
  },
  computed:{
    initialIndex () {
      let index = 0
      index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
        return index
    },
     ...mapGetters(["initPlayer","userClientHeight"])
  },
  created(){
    this.getLessonList()
    this.getWordList()
    this.sendItemListArr()
  },
  components:{
    TrackSPU,
  }
}
</script>

<style lang='less'scoped>
@import url('~@/assets/css/common.less');

.tab-composite-view{
  .cube-tab-bar{
    background-color: white;
    line-height: 25px!important;
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
}
.HeaderTop{
    position: fixed;
    z-index: 200;
    width: 100%;
    top: 0;
    left: 0;
    .header_title{
    position: relative;
    display: flex;
    padding-bottom: 7px;
    &::before{
      content: '' ;
      position: absolute; 
      z-index: 200; 
      left: 0 ;
      top: 0 ;
      width: 100% ;
      height: 0px ;
      background-color: #e4e4e4;
    } 
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
   .setFrameGradualBg();
    width: 100%;
    //height: 37px;
    height: 35px;
    display: flex;
    .guide_item{
      display: flex;
      flex: 1;
      text-align: center;
      align-items: center;
      span{
        font-size: 17px;
        margin-top: 2px;
        margin-bottom: 2px;
      }
      .header-cont {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        text-align: center;
        color: #fff;
        text-overflow: ellipsis;
        .title_item{
          font-size: 18px;
          letter-spacing: 9px;
          color: rgb(255,255,255);
        }
      }
     }  
  }
}
.tab-slide-container{
  position: relative;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
}
.backIcon{
    font-size: 25px;
    color: #fff;
}
.bgImg{
  //height: 95%;
    margin: 30% 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.defailtImg{
  width: 46%;
  margin-bottom: 20px;
    // margin: auto!important;
    // width: 55%!important;
    // display: flex!important;
    // position: absolute!important;
    // left: 50%!important;
    // top: 50%!important;
    // transform: translate3d(-50%,50%,0)!important;
}
.defailtTitle{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
  color: #ABACAD;
}
</style>

