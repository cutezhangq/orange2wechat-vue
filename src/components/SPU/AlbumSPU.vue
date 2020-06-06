<template>
  <div>
    <div class="recommend-list" ref="recommendList" v-show="albums.length">
      <ul>
        <li class="item" v-for="(album,index) in albums" :key="index" @click="skipAlbumsDetailPage(album)">
          <div class="icon">
            <div class="gradients"></div>
            <img class="imgicon default-image" :src="album.coverUrl" v-lazy="album.coverUrl" v-if="album.coverUrl !== null"/>
            <img class="imgicon default-image" src="@/common/image/defaultPage_album.png" v-if="album.coverUrl === null"/>
            <div class="imgshadow"></div>
          </div>
          <p class="play-count">
            <i class="iconfont tc-headset"></i>
            {{album.playCount}}
          </p>
          <div class="text">
            <p class="name">{{album.title}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, { 
  preLoad: 1.3,
  loading:require('@/common/image/defaultPage_album.png') ,
  error:require('@/common/image/defaultPage_album.png'),
  attempt: 1
})

export default {
  data(){
    return{
      albumsList:[]
    }
  },
  props: {
    albums: Array,
    categoryId:Number
  },
  methods:{
    skipAlbumsDetailPage(album){
      this.$router.push({
        name:'albumDetail',
        params:{
          id:album.id,
        }
      })
    }
  },
  watch:{
    albums(newVal){
      if(newVal==null){
        return 
      }
    }
  },
  created(){
  }
}
</script>

<style lang='less' scoped>
.recommend-list {
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  .title {
    height: 65px;
    line-height: 65px;
    padding-left: 1.5%;
    text-align: left;
    //font-size: $font-size-medium;
    font-size: 14px;
    font-weight: bold;
    //color: $color-text;
    color: #2e3030;
  }
  .item {
    //display: inline-block;
    position: relative;
    box-sizing: border-box;
    width: 33%;
    padding: 0 1%;
    float: left;
    .icon {
      position: relative;
      margin: 0;
      display: inline-block;
      width: 100%;
      height: 0;
      padding-top: 100%;
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
      top: 5px;
      right: 8px;
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
  }
}
</style>
