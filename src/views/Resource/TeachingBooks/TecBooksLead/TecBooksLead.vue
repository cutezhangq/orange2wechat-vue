<template>
<div class="slide-banner" style="z-index:981">
  <div class="banner-wrapper" ref="banner_wrapper">
      <div  class="slide-banner-scroll" ref="slide">
          <div class="slide-banner-wrapper" :options="options">
            <div class="slide-item" 
                v-for="(itemlabel, index) in itemLabels" :key="index" 
                style="display: inline-block;"
            >
              <!--top部分-->
              <div id="titleTop">
                <p class="title" v-html="itemlabel.title"></p>
              </div>
              <!--嵌套滑动列表 center部分-->
              <div class="scroll-list-wrap" ref="scroll_list_wrap">
                <cube-scroll
                  :options="scrollOptions" 
                  direction="vertical" 
                  ref="scroll"
                >
                  <!--出版社列表-->
                  <PressLists :Event="Event" v-if="index === 0"/>
                   <!--教材列表-->
                  <TextbookLists :Event="Event" v-if="index === 1" @optionTextbookId="getTextbookId"/>
                </cube-scroll>  
              </div>
            </div>
          </div>
      </div>

      <div class="docs-wrapper">
        <span
          class="doc"
          v-for="(item, index) in 2"
          :key="index"
          :class="{'active': currentPageIndex === index}"></span>
      </div>
  </div>
  <!--底部按钮 部分-->
  <div id="butBottom" class="btn-wrap butBottom">
    <button class="button prev" @click="prePage" v-show="this.currentPageIndex !== 0">上一步</button>
    <button class="button next" @click="nextPage"  v-show="this.currentPageIndex !== this.itemLabels.length -1">下一步</button>
    <cube-button type="submit" class="button" v-show="this.currentPageIndex === this.itemLabels.length -1" @click="optionSubmit">提交</cube-button>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
// import DEVICEID from '@/api/global'
import {axiosJWT} from "@/common/js/request"
import PressLists from '@/views/Resource/TeachingBooks/TecBooksLead/PressLists'
import TextbookLists from '@/views/Resource/TeachingBooks/TecBooksLead/TextBookLists'
import { mapGetters } from "vuex"
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
BScroll.use(Slide)
const Event = new Vue();

export default {
 data() {
    return {
      autoPlay:false,
      options:{
        autoPlay:false
      },
      itemLabels: [
        {
          title:'选择你喜欢的出版社',
        },
        {
          title:'选择你的年级教材',
        }
      ],
      //autoPlay: false,
      options:{
        stopPropagation:true,//阻止事件冒泡
        listenScroll: true,
        probeType: 2,
        directionLockThreshold: 0
      },
      scrollOptions: {
          pullDownRefresh: false,
          //阻止冒泡
          stopPropagation:true
      },
      clientHeight:'',
      Event: Event,
      PressId:Number,
      slide: null,
      playTimer: 0,
      currentPageIndex: 0,
      textbookId:0  //设置的教材id
    }
  },
  mounted(){
      this.clientHeight = this.userClientHeight
      //加载better-scroll中的init方法
      this.init();
  },
  beforeDestroy() {
      clearTimeout(this.playTimer)
      this.slide.destroy()
    },
  watch: {
      clientHeight: function () {
      this.changeFixed(this.clientHeight)
      }
  },
  computed:{
    ...mapGetters(["userClientHeight"]),
  },
  methods: {
    //动态修改样式
    changeFixed(clientHeight){ 
      this.$nextTick(()=>{
          for(let i=0;i<this.itemLabels.length;i++){
            const titleTop = document.getElementById('titleTop').offsetHeight;
            const butBottom = document.getElementById('butBottom').offsetHeight;
            this.$refs.scroll_list_wrap[i].style.height = clientHeight-titleTop-butBottom+'px';
          }
      })
    },
    init() {
      clearTimeout(this.playTimer)
      this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          slide: {
            loop: false,
            threshold: 100,
            autoPlay:false
          },
          useTransition: true,
          momentum: false,
          bounce: false,
          stopPropagation: true,
          probeType: 2
        })
      this.slide.on('scrollEnd', this._onScrollEnd)
      this.slide.on('beforeScrollStart', () => {
          // 当滚动结束以后 如果是自动播放,首先要清除定时器(防止手动拖动轮播图以后图片无法正确显示)然后再次执行方法 才能实现轮播
          if (!this.autoPlay) {
           clearTimeout(this.playTimer)
           //this.play()
          }
        })
      this.slide.on('scrollEnd', () => {
          //console.log('轮播的当前页:'+this.currentPageIndex);
          let page = this.slide.getCurrentPage().pageX
          this.currentPageIndex = page
          this.autoGoNext()
        })
      this.slide.on('slideWillChange', (page) => {
          this.currentPageIndex = page.pageX
        })
      this.autoGoNext()  
    },
    play: function () {
      let playPage = this.currentPageIndex + 1
      if (playPage === this.children.length - 2) {
        playPage = 0
      }
      setTimeout(() => {
        this.slider.goToPage(playPage, 0, 400)
      }, this.interval)
      },
    //下一页
    nextPage() {
     this.slide.next()
    },
    //上一页
    prePage() {
      this.slide.prev()
    },
    _onScrollEnd() {
          this.autoGoNext()
    },
    autoGoNext() {
        clearTimeout(this.playTimer)
        //自动轮播
        // this.playTimer = setTimeout(() => {
        //   this.nextPage()
        // }, 4000)
    },
    goTo (path) {
      this.$router.push(path)
    },
     //接收用户设置教材的教材Id
    getTextbookId(tbId){
      this.textbookId = tbId
    },
    //引导页 提交设置 请求
   putBatchTextBook(){
    var _data={
      //"deviceId":DEVICEID.DEVICEID, //需要注意
	    textbookId:this.textbookId
    }
    var _json = JSON.stringify(_data)

    return axiosJWT({
      url:"/device/textbook",
      method:"put",
      headers:{
        //"Content-Type":'application/json;charset=UTF-8'
        "Content-Type":'application/x-www-form-urlencoded'
      },
      params:{
        textbookId:this.textbookId
      }
      // data:_json
    })
    .then( res=>{
      if(res.code===200){
           this.$nextTick(()=>{  
           console.log('用户设置教材成功！') 
           //请求成功 出现弹框
           this.$createDialog({
            type: 'alert',
            content: '教材库设置完成',
            icon: 'cubeic-ok',
            zIndex:990,
            confirmBtn:{
              text: '确定', 
              active: true, 
              // href: '/' //跳转到教材库
            },
            onConfirm: (e, promptValue) => {
              this.$router.push({name:'resource'})
            }
            }).show()
          })
      }
      }).catch({})
  },
  //点击 提交按钮     发送 修改单个设备配置信息 请求
  optionSubmit() {
    this.putBatchTextBook()
    }
  },
  components:{
    PressLists,
    TextbookLists
  }
}
</script>

<style lang='less'scoped>
@import url('~@/assets/css/common.less');
// .electWay{
//     padding-bottom: 20px;
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-around;
//     align-items: center;
//     color: #cacacd;
//     font-size: 20px;
//     letter-spacing: 9px;
// }
.title{
    font-weight: bold;
    font-size: 28px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 30px 0;
}
cube-slide > .cube-slide-dots > span {
    display: inline-block;
    vertical-align: bottom;
    margin: 0 1px;
    width: 10px;
    height: 10px;
    background: #ccc;
    border-radius: 50px;
}
.scroll-list-wrap {
  transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
  overflow: hidden;
}
.butBottom{
  padding: 5px 0;
}
.button {
  width: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
  font-size: 15px;
  padding: 10px 27px 10px 27px;
  border: solid @iframecolor 1px;
  background: #fff;
  color: @iframecolor;
  letter-spacing: 2px;
}
// .banner-wrapper{
//   position: relative;
// }
// .slide-banner .slide-banner-wrapper .slide-item{
//   display: inline-block;
// }
// .slide-item{
//   display: inline-block;
// }
.slide-banner{
  background-color: #fff;
  .banner-wrapper{
    position: relative;
  }
  .slide-banner-scroll{
    min-height: 1px;
    overflow: hidden;
  }
  .slide-banner-wrapper{
    white-space: nowrap;
    font-size: 0;
    .slide-item{
      display: inline-block;
      // height: 600px;
      width: 100%;
      line-height: 10px;
      text-align: center;
      font-size: 12px;
    }
  } 
  .docs-wrapper{
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
  }
  .btn-wrap{
    display: flex;
    justify-content: center;
    bottom: 0;
  }
}
body{
  height: 100%;
}
//按钮的适配
//  @media screen and (max-height: 569px) { /*当屏幕尺寸小于568px时，应用下面的CSS样式*/
//    .scroll-list-wrap{
//      height: 80%;
//    }
//    .btn-wrap{
//     display: flex;
//     justify-content: center;
//     margin-top: -26%!important;
//    }       
//   }
//  @media screen and (min-height: 569px) { 
//    .btn-wrap{
//     display: flex;
//     justify-content: center;
//    }       
//   }
  @media screen and(max-height:667px){
    .title{
      font-weight: bold;
      font-size: 26px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      padding: 26px 0;
    }
    // .butBottom{
    //   margin-top: -26%;
    // }
  }
</style>
