<template>
  <div>
      <div class="recommend-list" ref="recommendList">
        <ul>
          <li class="item" 
              v-for="(pressList,index) in pressLists" :key="index"
              @click="optionchange(index)">
            <div class="icon">
              <img class="imgicon" :src="pressList.coverUrl"/>
            </div>
            <div class="textName">
              <i class="iconfont weixuan tc-check1" v-show="currentOption !== index"></i>
              <i class="iconfont xuanzhong tc-check1" v-show="currentOption === index"></i>
            </div>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
import {axiosJWT} from "@/common/js/request"
export default {
  data(){
    return{
      optionId:1,
      currentOption:0 ,  //用户当前点击的序列
      scrollOptions: {
          //directionLockThreshold: 0,
          pullDownRefresh: false
      },
      pressLists:[]//出版社列表
    }
  },
  props:{
    //pressLists:Array,
    Event:Object
  },
  methods:{
    optionchange(i){
      //选择的id,控制icon
      this.currentOption = i
      //将选择的下标给optionId，传到兄弟组件textbookLists中
      this.optionId = i+1
      this.Event.$emit("optionPressId",this.optionId)
      //console.log('111发送的选择的id:'+this.optionId)
    },
    //获取出版社列表
   getPressLlist(){
     return axiosJWT({
        url:"/press/list",
        method:'get',
     }).then( res=>{
        if(res.code===200){
          this.$nextTick(()=>{  
            this.pressLists = res.data
          })
        }
      }).catch({

      })
   },
  },
  // watch:{
  //   optionId:function getPressLlist(){
  //     return axiosJWT({
  //       url:"/press/list",
  //       method:'get',
  //    }).then( res=>{
  //       if(res.code===200){
  //         this.$nextTick(()=>{  
  //           this.pressLists = res.data
  //         })
  //       }
  //     }).catch({

  //     })
  //   }
  // },
  created(){
    this.getPressLlist()
  },
}
</script>

<style lang='less'scoped>
@import url('~@/assets/css/common.less');
.recommend-list {
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  .item {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 0 10%;
    float: left;
    margin-bottom: 15px;
    .icon {
      position: relative;
      margin: 0;
      display: inline-block;
      width: 100%;
      border: 1px solid #e4dede;
      padding: 1% 0;
      border-radius: .26667rem;
      box-shadow: 3px 4px 5px #bdbbbb;
      .imgicon {
        //background-repeat: repeat;
        top: 0;
        left: 0;
        width: 231px;
        height: 60px;
        overflow: hidden;
        border-radius: 10px;
      }
    }
    .textName{
    position: absolute;
    font-size: 14px;
    top: 30%;
    right: 6%;
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
  }
}
.weixuan{
    font-size: 30px;
    font-style: normal;
    color: #e3e2df;
}
.xuanzhong{
    font-size: 30px;
    font-style: normal;
    color: @iframecolor;
}
</style>
