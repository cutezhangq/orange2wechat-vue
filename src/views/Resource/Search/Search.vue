<template>
  <div style="z-index:100">
    <!-- decorate顶部回弹背景 -->
    <div class="decorate"></div>
    <div class="search">
      <div class="search-box-wrapper">
          <searchTab ref="query" @tabQuery="getTabQuery"/>
      </div>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <!--历史记录-->
        <div class="search-history" v-show="historyLists.length">
           <h1 class="title">历史记录 
              <i class="iconfont clear tc-icon--" @click="clearHistory"></i>
           </h1>
           <!-- <div class="scroll-list-wrap">
           <cube-scroll
              ref="scroll"
              :options="options" 
              direction="horizontal"
              class="horizontal-scroll-list-wrap"
            > -->
              <ul class="list-wrapper">
                <li class="item list-item" 
                  v-for="(item, index) in historyLists" 
                  :key="index"
                  @click="saveCurSearchKeywords(item.keywords)"
                >
                  <span>{{item.keywords}}</span>
                </li>
              </ul>
           <!-- </cube-scroll>
           </div> -->
         </div>
         <!--热搜榜-->
         <div class="hot-key">
           <h1 class="title">
             <span class="text">热搜榜</span>
           </h1>
           <ul v-if="hotLists.length">
             <li class="hotItem"
              v-for="(item,index) in hotLists" :key="index"
              @click="clickCurHotContent(item.title)"
              >
               <div class="indexNum" :class="{on: index < 3}">
                 <span>{{index+1}}</span>
               </div>
               <div class="hotContent">
                 <p class="hotText">
                   <span>{{item.title}}
                      <i v-show="index < 5" class="iconfont hotIcon tc-custom-hot"></i>
                   </span>
                 </p>
                 <span class="playCount">{{item.searchNum}}</span>
               </div>
             </li>
           </ul>
           <ul v-else>
            <li v-for="item in 6" :key="item">
              <img class="loadingText" src="@/common/image/loadingText.svg">
            </li>
           </ul>
         </div>
      </div>
    </div>
</div>
</template>

<script>
import DEVICEID from '@/api/global'
import searchTab from '@/components/SearchTab/SearchTab.vue'
import { axiosJWT } from '../../../common/js/request'
import { mapActions } from "vuex"
export default {
  name:"Search",
  data(){
    return{
      curSearchKeywords:String,
      historyLists:[],
      historyKeyWords:'',
      haveHistory:false,
      haveHotIcon:true,
      hotLists:[],
      options:{
        //阻止冒泡
        stopPropagation:true
      }
       //上拉下拉回弹
      // swiperOption: {
      //   direction:'vertical',
      //   slidesPerView:'auto',
      //   freeMode:true,
      //   mousewheel:true,
      // },  
    }
  },
  components:{
    searchTab,
  },
  watch:{
    haveHistory:function () {
      this.getHistoryLists()
    }
  },
  methods:{
     //接收 搜索框输入的参数
    getTabQuery(q){
      this.curSearchKeywords = q
      //this.saveCurSearchKeywords()
      this.$router.push({name:'searchInfo',params:{_tokeywords:this.curSearchKeywords}})
    },
    //历史记录 请求
    getHistoryLists(){
      return axiosJWT({
        url:"/search/history",
        method:'get',
        params:{
          count:10
        }
      }).then( res=>{
      if(res.code===200){
          this.$nextTick(()=>{
            this.haveHistory = true
            this.historyLists = res.data
          })
      }
      //没有历史记录
      if(res.code === 204){
        this.haveHistory = false
      }
      }).catch({})
    },
    //用户点击 历史记录
    saveCurSearchKeywords(keywords){
      //将用户点击的历史记录 数据存入vuex
      this.$store.dispatch("curSearchKeywords",keywords)
      //将用户选择的历史记录 数据传入searchTab中
      this.$router.push({name:'searchInfo',params:{_keywords:keywords}})
    },
    //清空历史记录
    clearHistory(){
      //请求成功 出现弹框
       this.$createDialog({
            type: 'confirm',
            title: '是否清空历史记录',
            confirmBtn:{
              text: '确定', 
              active: true, 
              disabled: false,
            },
            cancelBtn: {
              text: '取消',
              active: false,
              disabled: false,
            },
            onConfirm: (e, promptValue) => {
              //点击确认后 发送删除请求
              return axiosJWT({
                 url:"/search/history/all",
                 method:'DELETE',
                 }).then( res=>{
                 if(res.code===200){
                   //隐藏 搜索历史部分
                   this.haveHistory = false
                   this.historyLists = []
                   //console.log('点击确定后隐藏历史记录',this.historyLists.length)
                  }
                 }).catch({
                 })
            }
      }).show()
      
    },

    //热搜榜 请求
    getHotLists(){
      return axiosJWT({
        url:"/search/hot",
        method:'get',
      }).then(res=>{
        if(res.code === 200){
          this.$nextTick(()=>{
            this.hotLists = res.data
          })
        }
      })
    },
    //用户点击 热搜榜
    clickCurHotContent(hotKeywords){
      //hotKeywords 点击的热搜榜的 内容
      this.$store.dispatch("curSearchKeywords",hotKeywords)
      this.$router.push({name:'searchInfo',params:{_keywords:hotKeywords}})
    },
  },
  mounted(){
  },
  created(){
    this.getHistoryLists()
    this.getHotLists()
    this.$store.dispatch("curSearchInfoLabel","曲目")
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/css/common.less');
// .horizontal-scroll-list-wrap{
//   // height: 26px;
//   .cube-scroll-content{
//     display: inline-block;
//   }
.list-wrapper{
  overflow: hidden;
}
//   .list-item{
//     display: inline-block;
//   }
// }
.decorate {
      position: absolute;
      //top: -30vh;
      top:-40vh;
      z-index: -10;
      .setFrameGradualBg();
      width: 100%;
      height: 40vh;
      vertical-align: inherit;
    }
.search {
  overflow: hidden;
  .setFrameGradualBg();
  padding-bottom: 10px;
  .search-box-wrapper {
    margin: 0.53333333rem 1.6rem -5.203333rem 1.6rem;
    }
  }
  .shortcut-wrapper {
    position: relative;
    top:0.8rem;
    bottom: 0;
    left: 0;
    width: 100%;
    margin-bottom: 5px;
    .shortcut {
      height: 100%;
      .search-history {
        margin: 0 0.53333333rem 1.25333333rem 0.53333333rem;
        .cube-scroll-content{
          display: inline-block
        }
        .title {
          margin-bottom:.53333rem;
          font-weight: bold;
          font-size: 19px;
        }
        ul{
          li {
          list-style: none;
          display: inline-block;
          float: left;
          }
        }
        .item {
          display: inline-block;
          padding: 0.33333333rem 0.38666667rem;
          margin: 0 0.2666666667rem 0.2666666667rem 0;
          border-radius: 6px;
          background: #f2f2f2;
          font-size: 14px;
          color: #81817d;
          max-width: 189px;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
        }
      }
      .hot-key {
        position: relative;
        margin: 0.1rem 0.53333333rem;
       .title {
          display: flex;
          align-items: center;
          height: 1.0666666667rem;
          font-size: 14px;
          color: hsla(0,0%,100%,.5);
         .text {
             flex: 1;
            margin-bottom: .53333rem;
            font-weight: bold;
            font-size: 19px;
            color: black;
          }
         
        }
        .indexNum{
           float: left;
           padding: 12px;
           font-size: 19px;
           color: #9c9999;
         }
         .on{
           color: @iconcolor !important;
          }
         .hotContent{
          width: 100%;
          float: left;
          padding: 12px;
          font-size: 16px;
          .hotText{
            float: left;
            width: 255px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .hotIcon{
              font-size: 16px;
              color: @iconcolor;
            }
          }
          .playCount{
            float: right;
            color: #d3d3d3;
            font-size: 14px;
            width: 35px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
         }
         li{
          list-style: none;
          display: flex;
          letter-spacing: 1px;
         }
      }

    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 4.8rem;
    bottom: 0;
  }
.clear{
    float: right;
    margin-right: 20px;
    font-size: 21px;
    color: #a8a3a3;
}
.cube-dialog-content-def {
    padding: 0 16px;
    font-size: 16px!important;
}
.loadingText{
  width: 100%;
  height: 100%;
}
</style>
