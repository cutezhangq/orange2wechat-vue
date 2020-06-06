<template>
  <div>
    <div class="recommend-list" ref="recommendList">
        <ul>
          <li class="item" 
              v-for="(textbookList,index) in textbookLists" :key="index"
              @click="optionchange(index)">
            <div class="icon">
              <img class="imgicon" :src="textbookList.coverUrl"/>
            </div>
            <p v-html="textbookList.name"></p>
            <div class="textName">
              <i class="iconfont weixuan tc-check1" v-if="currentOption !== index"></i>
              <i class="iconfont xuanzhong tc-check1" v-if="currentOption === index"></i>
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
      PressId:1,
      currentOption:0 ,  //用户当前点击的序列
      scrollOptions: {
          //directionLockThreshold: 0,
          pullDownRefresh: false
      },
      textbookLists:[],//教材列表
      textbookId:Number,
    }
  },
  props:{
    //textbookLists:Array,
    Event:Object
  },
  methods:{
    optionchange(i){
      this.currentOption = i
      this.textbookId = this.textbookLists[i].id
      //console.log('传递过去的数据为：'+this.textbookId)
      this.$emit('optionTextbookId',this.textbookId)
    },
    //获取教材列表 用户选择id为1时
   getTextbookList(){
     return axiosJWT({
       url:"/textbook/list",
       methods:'GET',
       params:{
         pressId:this.PressId
       }
     }).then(res=>{
       if(res.code===200){
          this.$nextTick(()=>{  
            this.textbookLists = res.data
            //默认是选择的第一个的id
            this.textbookId = res.data[0].id
            //console.log('=====',res.data[0].id)
            this.$emit('optionTextbookId',this.textbookId)
             //console.log('02请求（methods中的）')
        })
     }
    }).catch({

      })
   },
  },
  watch:{
    PressId:function getTextbookList(){
      return axiosJWT({
       url:"/textbook/list",
       methods:'GET',
       params:{
         pressId:this.PressId
       }
     }).then(res=>{
       if(res.code===200){
          this.$nextTick(()=>{  
            this.textbookLists = res.data
            this.textbookId = res.data[0].id
            //console.log('=====',res.data[0].id)
            this.$emit('optionTextbookId',this.textbookId)
            //console.log('02请求（watch中的）')
        })
     }
    }).catch({

      })
    }
  },
  mounted(){
    this.Event.$on('optionPressId', PressId =>{
      this.PressId = PressId  
      //console.log('接收的选择的值为：'+this.PressId)
    })
    
  },
  created(){
    this.getTextbookList()
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
    width: 50%;
    margin-bottom: 10px;
    float: left;
    .icon {
      position: relative;
      margin: 0;
      display: inline-block;
      //width: 100%;
      border: 1px solid #e4dede;
      padding: 1% 0;
      border-radius: .26667rem;
      box-shadow: 3px 4px 5px #bdbbbb;
      .imgicon {
        //background-repeat: repeat;
        top: 0;
        left: 0;
        width: 150px;
        height: 180px;
        overflow: hidden;
        border-radius: 10px;
      }
    }
    p{
      margin: 0.7rem 0 0.3rem 0;
      font-size: 13px;
      padding-top: .3rem;
    }
    .textName{
    position: absolute;
    font-size: 14px;
    top: 9%;
    right: 10%;
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
