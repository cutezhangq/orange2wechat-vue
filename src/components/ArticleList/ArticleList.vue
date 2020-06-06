<template>
<div>
  <!-- <v-banner v-if="banners.length > 0" :images="banners"></v-banner> -->
  <div class="recommend-list">
    <!-- <h1 class="list-title">文章推荐</h1> -->
    <ul>
      <li class="item" v-for="(article,index) in articles" :key="index" @click="selectItem(article)">
          <div class="icon">
          <img :src="article.coverUrl">
        </div>
        <div class="text">
          <h2 class="name" v-html="article.title"></h2>
          <p class="desc" v-html="article.summary"></p>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  props:{
    articles:Array
  },
methods: {
  selectItem(article) {
      window.location.href = article.url
    },
}
}
</script>

<style lang='less' scoped>
.recommend-list {
   //position: fixed;
  width: 100%;
  top: 176px;
  bottom: 0;
  height: 100%;
  overflow: hidden;
      .list-title {
        height: 1.6rem;
        line-height: 1.73333rem;
        text-align: center;
        font-size: 14px;
        color: #ea2448;
      }
      .item {
            //display: -webkit-box;
            //display: -ms-flexbox;
            display: flex;
            box-sizing: border-box;
            -webkit-box-align: center;
            //-ms-flex-align: center;
            align-items: center;
            padding: 0 0.53333rem 0.833rem;
        img{
          width: 60px;
          height: 60px;
        }
        .icon {
          -webkit-box-flex: 0;
          -ms-flex: 0 0 1.6rem;
          flex: 0 0 1.6rem;
          width: 1.6rem;
          padding-right: 3.53333rem;
        }
        .text {
          line-height: 1.53333rem;
          overflow: hidden;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          .name {
            margin-bottom: .26667rem x;
            color: black;
            font-weight: 700;
            white-space: normal;
            overflow: hidden;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .desc {
                white-space: normal;//换行
                color: black;
                //使文字多出2行的用...表示
                overflow: hidden; /** 隐藏超出的内容 **/
                word-break: break-all;
                text-overflow: ellipsis; /** 多行 **/
                display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
                -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
                -webkit-line-clamp: 2; /** 显示的行数 **/
          }
        }
      }
    }
</style>
