<template>
  <div style="z-index:100">
    <!--缺省页-->
    <div v-if="InitOptions === false && this.isCode_500 === false" style="z-index:110">
    <!-- <div v-if="true" style="z-index:101"> -->
      <DefaultPage class="defaultPage"/>
    </div>
     <!--教材库nav500内容-->
    <div v-if="this.isCode_500 === true">
      <Page500/>
    </div>
    <!--教材库内容-->
    <div v-if="InitOptions === true" style="z-index:100">
    <!-- <div v-if="false"> -->
       <div slot="content" class="content">
          <cube-sticky-ele>
            <div class="HeaderTop">
              <!--导航-->
              <cube-tab-bar v-model="selectedLabel"
                           show-slider
                           :use-transition="disabled"
                           ref="tabNav"
                           class="cube-tab-bar"
                           @click="clickHandler"
                           >
                <cube-tab v-for="(item, index) in tabLabels" :key="index" :label="item.label" >
                </cube-tab>
             </cube-tab-bar>
            </div>
        </cube-sticky-ele>
        <!--条目-->
        <div class="tab-slide-container" ref="tab_slide_container">
          <cube-tab-panels v-model="selectedLabel">
            <cube-tab-panel v-for="(item, index) in tabLabels" :label="item.label" :key="index">
              <ul>
                  <cube-sticky v-if="InitOptions === true" :pos="scrollY" @scroll="scrollHandler_sticky">
                      <ContentList 
                        :ContentLists="item.dataList" 
                        @selectIndex="getContentListId" 
                        ref="TrackSPU" 
                        v-show="item.haveDate"
                        v-if="item.dataList.length"
                      />
                      <ul v-if="!item.dataList.length">
                        <li v-for="item in 6" :key="item">
                          <img class="loadingText" src="@/common/image/lodingWenjianjia.svg">
                        </li>
                      </ul>
                  </cube-sticky>
              </ul>
            </cube-tab-panel>
          </cube-tab-panels>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import DEVICEID from '@/api/global'
import {axiosJWT} from "@/common/js/request"
import {findIndex} from '@/../node_modules/cube-ui/src/common/helpers/util'
import DefaultPage from '@/views/Resource/TeachingBooks/DefaultPage/DefaultPage'
import Page500 from '@/views/DefaultPage/Page500'
import ContentList from '@/components/ContentList/ContentList'
import { mapGetters } from "vuex";
const NEST_MODE_NONE = 'none'
const NEST_MODE_NATIVE = 'native'
const NEST_MODE_FREE = 'free'

export default {
  props:{
    resClientHeight:'',
    nestMode: {
      type: String,
      default: NEST_MODE_NONE
    }
  },
  data(){
    return{
      scrollEvents: ["scroll", "scroll-end"],
      clientHeight:'',
      transitionName:'',
      InitOptions:Boolean ,//用户进入教材库---标识用户是否设置了教材
      selectedLabel:'',
      //selectedLabel:this.$store.getters.curTecBooksLabel, //单元/模块  
      currentLabelIndex:0,
      disabled: false,
      tabNum:Number,  //有多少tab
      tabLabels: [
        {
          label: '单元/模块',  //导航名 label: '单元/模块'
          dataList:[],  //相应条目数据
          navId:Number,  //从导航接口获得的分类导航id
          textbookId:'',  //从导航接口获得的分类导航id
          haveDate:true, 
        }
      ],
      scrollY: 0,
      _scrollY: 0,
      loop: false,
      autoPlay: false,
      showDots: false,
      slideOptions: {
        listenScroll: true, // 是否监控scroll事件
        probeType: 3, // 0 不派发scroll事件，1：非实时；2：滑动过程中；3：不仅在屏幕滑动的过程中，而且momentum 滚动动画运行过程中实时派发(下滑线跟随滑动)
        directionLockThreshold: 0,
        allowVertical:true,
        stopPropagation:false,//阻止冒泡
        momentum:true,
        //eventPassthrough:"vertical"
        //nestMode:'free',
        //preventDefault:true
      },
      scrollOptions: {
        startY:0,
        directionLockThreshold: 0,
      },
      currentIndex:Number,
      currentId:String,
      curSlideY:0,
      originalX:0,  //tab为0后的原始坐标
      posX:0,
      clickTabArr:[0],//存放用户点击过的tab下标，默认将第一个tab下标0放入其中 
      isSameTab:false,//数组去重--false:一开始没有重复的tab
      have_Tab:false,//判断数组中有没有当前的tab，false:一开始没有
      //doChangeTab:false,//标识用户当前是在点击tab切换而不是滑动切换 false:一开始没有
      slidePosX:0,
      slidePosY:0,
      isCode_500:false,
    }
  },
  mounted(){
    // this.$nextTick(() => {
    // this.initSlide()
    // })
  },
  watch: {
  },
  methods:{
    //备用--点击每个tab执行此函数
    clickHandler(label){
      //遍历数组
      for(let i=0;i<this.tabNum;i++){
        //找到当前label对应的下标
        if(this.tabLabels[i].label === label){
          //  console.log('当前的tab为：'+label+'是第几个：'+i)
          this.currentLabelIndex = i
          //将当前的label存入vuex---便于返回到当前tab
          this.$store.dispatch("curTecBooksLabel",label)
        }
      }
    },
    //判断slide是否划出边界
    _checkReachBoundary(){
      const tbSlide = this.$refs.slide.slide
      const distX = tbSlide.distX
      const distY = tbSlide.distY
      const reachBoundaryX = distX > 0 ? this.slidePosX >= tbSlide.minSlideX : distX < 0 ? this.slidePosX <= tbSlide.maxSlideX : false
      const reachBoundaryY = distY > 0 ? this.slidePosY >= tbSlide.minSlideY : distY < 0 ? this.slidePosY <= tbSlide.maxSlideY : false
      const freeSlide = tbSlide.freeSlide
      const hasHorizontalSlide = tbSlide.hasHorizontalSlide
      const hasVerticalSlide = tbSlide.hasVerticalSlide

      if (!hasHorizontalSlide && !hasVerticalSlide) {
          return true
      }
      if (freeSlide) {
        return reachBoundaryX || reachBoundaryY
      }

      let reachBoundary
      if (tbSlide.movingDirectionX) {
        reachBoundary = reachBoundaryX
      } 
      else if (tbSlide.movingDirectionY) {
        reachBoundary = reachBoundaryY
      }
      return reachBoundary
    },

    //处理嵌套slide边界的情况
    _handleNestSlide(){
      //parentCom父组件实例--resoource中的slide实例
      var parentCom =  this.$refs.slide.$parent.$parent.$parent.$parent.$parent
      //获取内部嵌套的slide 里面得到的movingDirectionX
      var movDirectionX = this.$refs.slide.slide.movingDirectionX
      // console.log('是否到达边界:',reachBoundary)
      this.$nextTick(() => {
        const innerSlide = this.$refs.slide.slide
        const outerSlide = parentCom.slide
        const slides = [innerSlide,outerSlide]

        slides.forEach((slide,index,arr)=>{
          //滚动结束始终启用它们
          slide.on('touchEnd',()=>{
            innerSlide.enable()
            outerSlide.enable()
            innerSlide.initiated = false
          })
          slide.on('beforeScrollStart', () => {
            this.touchStartMoment = true
            const anotherSlide = arr[(index + 1) % 2]
            anotherSlide.stop()
            anotherSlide.resetPosition()
          })
        })
        //滑动到边界
        if(movDirectionX === -1 || movDirectionX === 1){
          //console.log(this.selectedLabel)
          if(this.selectedLabel === this.tabLabels[0].label){
            if(movDirectionX === -1){
              innerSlide.resetPosition()
              // console.log(innerSlide.scroll.resetPosition())
              innerSlide.disable()
              outerSlide.pointX = innerSlide.pointX
              outerSlide.pointY = innerSlide.pointY
              outerSlide.enable()
              this.$refs.slide.slide.movingDirectionX = 0
            }
            else{
            innerSlide.enable()
            outerSlide.disable()
            } 
          }
          if(this.selectedLabel === this.tabLabels[this.tabLabels.length-1].label){
            if(movDirectionX === 1){
              innerSlide.resetPosition()
              innerSlide.disable()
              outerSlide.pointX = innerSlide.pointX
              outerSlide.pointY = innerSlide.pointY
              outerSlide.enable()
              this.$refs.slide.slide.movingDirectionX = 0
            }
            else{
            innerSlide.enable()
            outerSlide.disable()
            }
          }
        }
        else{
            innerSlide.enable()
            outerSlide.disable()
        }
        this.touchStartMoment = false
      })
    },

    //slide中滚动实时调用
    slideScroll(pos){
      this.posX = pos
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
      this.slidePosX = pos.x
      this.slidePosY = pos.y
      //处理嵌套slide
      //this._handleNestSlide()

      //临时 slide嵌套处理
      //parentCom父组件实例
      var parentCom =  this.$refs.slide.$parent.$parent.$parent.$parent.$parent
      var movDirectionX = this.$refs.slide.slide.movingDirectionX
    },

    //Slide切换
    changePage (current) {
        this.selectedLabel = this.tabLabels[current].label
        this.currentLabelIndex = current
        //console.log('当前切换到的tab为：',this.tabLabels[current].label)
        //判断当第一次切换tab时才发送请求
        this.firstLoadContent()
        //数组去重
        for(let i=0;i< this.clickTabArr.length;i++){
          //存在重复的数据
          if( this.clickTabArr[i] === current){
            this.isSameTab = true
          }
        }
        //将当前切换的tab放入数组中
        if(!this.isSameTab){
          this.clickTabArr.push(current)
          //console.log(this.clickTabArr)
        }
    },

    //黏性组件，吸附顶部搜索框
    scrollHandler({ y }) {  
      this.scrollY = -y;
    },
    _scrollHandler({ y }) {  
      this._scrollY = -y;
    },
    scrollHandler_sticky({ y }) {  
      this._scrollY = -y;
    },
    //切换tab加载内容（只在第一次加载）---数组中没有（没切换过）就加载
    firstLoadContent(){
      this.have_Tab = false
      //数组中已经存在了---不是第一次进入
      for(let i=0;i< this.clickTabArr.length;i++){
        if(this.clickTabArr[i] === this.currentLabelIndex){
          this.have_Tab = true
        }
      }
      //是第一次切换tab
      if(this.have_Tab === false){
        this.getContentList(this.currentLabelIndex)
      }  
    },
    //用户是否选择教材 接口
    // haveNavTBooks(){
    //   return axiosJWT({
    //     url:"/content/nav",
    //     method:'GET',
    //     // params:{
    //     //   deviceId:DEVICEID.DEVICEID //已选择
    //     // }
    //   }).then(res =>{
    //     //返回901，未选择教材
    //     if(res.code ===  901){
    //       this.$nextTick(()=>{
    //         this.InitOptions = false
    //       })
    //     }
    //     if(res.code === 200){
    //        this.$nextTick(()=>{
    //          this.InitOptions = true
    //        })
    //     }
    //   }).catch({

    //   })
    // },

    //请求 目录导航
    getContentNav(){
      return axiosJWT({
        url:"/content/nav",
        methods:'get',
      }).then(res=>{
        //已选择（设置）教材
        if (res.code === 200) {
          this.$nextTick(() => {
            this.InitOptions = true
            //tab数目
            this.tabNum = res.data.navBar.length
            //第一个（初始）tab
            this.selectedLabel = res.data.navBar[0].title
            this.tabLabels[0].label = res.data.navBar[0].title
            this.tabLabels[0].navId = res.data.navBar[0].id
            this.tabLabels[0].textbookId = res.data.textbookId
            this.getContentList(0)
            //动态添加第二,三..的tab
            for(let i=1;i<res.data.navBar.length;i++){
              //将每一个tab动态追加到数组中，更新视图
              this.tabLabels.push({label:res.data.navBar[i].title,
                                   dataList:[],
                                   navId:Number,
                                   textbookId:'',
                                   haveDate:true, 
                                   })
              this.tabLabels[i].label = res.data.navBar[i].title
              this.tabLabels[i].navId = res.data.navBar[i].id
              this.tabLabels[i].textbookId = res.data.textbookId
              setTimeout(()=>{
                this.getContentList(i)
              },600)
            }
            //this.getContentList(0)
            //第一次只加载第一个tab，后面的tab进行tab切换时才加载
            // this.getContentList(0)
            //console.log('tab:',this.tabLabels)
          })
        }
        if(res.code ===  500){
          this.InitOptions = false
          this.isCode_500 = true
          //当进入了tab为教材库时
          // this.$createDialog({
          //     type: 'alert',
          //     title: '提示',
          //     content: '请确认条件后点击下一步',
          //     confirmBtn: {
          //         text: '确定',
          //         active: true,
          //     }
          // }).show()
        }
        //返回901，未选择（设置）教材
        if(res.code ===  901){
          this.$nextTick(()=>{
            this.InitOptions = false
          })
        }
      }).catch({

      });
    },

    //点击后，获得选择的id  (点击文件夹获取id，进入其下的课文单词)
    getContentListId(currentIndex){
      this.currentIndex = currentIndex
      //当选择的是 单元/模块 或复习课  或...  中内容时
      for(let index=0;index<this.tabNum;index++){
        //console.log('当前选择的label为--',this.currentLabelIndex)
        if(this.currentLabelIndex === index){
          this.currentId = this.tabLabels[index].dataList[this.currentIndex].id
        }
      }
      //带选中的id,路由跳转到课文单词
      //console.log('点击的当前id为',this.currentId)
      this.$router.push({name:'contentListDetail',params:{_getCurrentId:this.currentId}})
    },

    //请求 单元目录--条目
    getContentList(i){
      return axiosJWT({
        url:"/content/list",
        methods:'get',
        params:{
          textbookId:this.tabLabels[i].textbookId,
          navId:this.tabLabels[i].navId
        }
      }).then(res=>{
        if (res.code === 200) {
          this.$nextTick(() => {
            this.tabLabels[i].dataList = res.data,
            this.tabLabels[i].haveDate = true
            // console.log(this.tabLabels[i].dataList)
            // console.log('执行了条目的请求，当前的tab是',i)
          })
        }
        if(res.code === 204){
           this.tabLabels[i].haveDate = false
        }
      }).catch({});
    }
    },
  computed:{
    initialIndex () {
      let index = 0
      index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
        return index
    },
    ...mapGetters(["userClientHeight","curTecBooksLabel"]),
  },
  created(){          
    //是否设置教材
    // this.haveNavTBooks()
    //请求教材库的tab
    this.getContentNav()
  },
  components:{
    ContentList,
    DefaultPage,
    Page500
  }
}
</script>

<style lang='less'scoped>
@import url('~@/assets/css/common.less');

.tab-composite-view{
  .cube-slide-group{
    width: 100%!important;
  }
  .cube-tab-bar{
    background-color: white;
    line-height: 25px!important;
    letter-spacing: 1px;
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
  overflow-y: scroll;
  margin-top: 0;
}
.content{
    top: 0;
    height: 100%;
    width: 100%;
    background-color: #fff;
    //固定教材库内容
    // display: block;
    // position: fixed;
}
.tab-slide-container{
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.cube-tab-bar{
  line-height: 25px;
  background: rgba(255, 252, 252, 0.92);
}
.bgImg{
  margin: 30% 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.defailtTitle{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
  color: #ABACAD;
}
.defaultPage{
  z-index: 900;
}
</style>