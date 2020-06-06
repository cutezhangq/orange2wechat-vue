<template>
    <div class="control" ref="control" style="z-index:200">
        <div class="title">
          <i class="iconfont tc-back01" @click="back"></i>
          <h2 class="hTitle">我的收藏</h2>
        </div>
        <div v-if="!isLoading">
          <div class="container">
              <div class="grid-item-1" @click="goAlbumPage">
                  <div>
                      <i class="iconfont tc-xiangguanzhuanji-guangdie"></i>
                      <i class="web-font">专辑</i>
                      <span class="spanSty">
              <span v-html="albumNum"></span>张
            </span>
                  </div>
              </div>
              <div class="grid-item-2" @click="goTrackPage(1)">
                  <i class="iconfont tc-gequ"></i>
                  <i class="web-font">歌曲</i>
                  <span class="spanSty">
            <span v-html="songNum"></span>首
          </span>
              </div>
              <div class="grid-item-3" @click="goTrackPage(2)">
                  <i class="iconfont tc-icon-test"></i>
                  <i class="web-font">课文</i>
                  <span class="spanSty">
            <span v-html="lessonNum"></span>篇
          </span>
              </div>
              <div class="grid-item-4" @click="goTrackPage(3)">
                  <i class="iconfont tc-beidanci"></i>
                  <i class="web-font">单词</i>
                  <span class="spanSty">
            <span v-html="wordNum"></span>个
          </span>
              </div>
          </div>
        </div>
        
        <!-- <div class="backgroundColor"></div> -->
        <Loading v-if="isLoading" style="z-index:990"/>
    </div>
</template>
<script>
import {axiosJWT} from "@/common/js/request"
    export default {
        name: "FavoriteIndex",
        data(){
          return{
            isLoading: true,
            albumNum:0,
            lessonNum:0,
            songNum:0,
            wordNum:0,
          }
        },
        methods: {
            goAlbumPage() {
                this.$router.push({path: "/FavoriteAlbum"});
            },
            goTrackPage(type) {
                this.$router.push({
                    path: "/FavoriteTrack",
                    query: {
                        type: type
                    }
                });
            },
            back() {
                this.$router.back();
            },
            //请求收藏数量接口
            getFavoriteNum(){
              return axiosJWT({
                url:"/favorite/count",
                method: 'get',
              }).then(res=>{
                if(res.code === 200){
                  this.isLoading = false
                  this.albumNum = res.data.album
                  this.lessonNum = res.data.lesson
                  this.songNum = res.data.song
                  this.wordNum = res.data.word
                }
              })
            }
        },
        created(){
          this.getFavoriteNum()
        }
    };
</script>

<style scoped>
    .spanSty {
        display: inline-block;
        margin: 10% auto 20% auto;
        color: white;
    }

    .spanSty span {
        font-size: 30px;
        font-weight: 700;

    }

    .tc-xiangguanzhuanji-guangdie,
    .tc-gequ,
    .tc-icon-test,
    .tc-beidanci {
        width: 25%;
        padding: 9% 5%;
        border-radius: 20%;
        font-size: 200%;
        color: white;
        display: inline-block;
        margin: 20% auto 10% auto;
    }

    /* .tc-xiangguanzhuanji-guangdie {
      background-color: #fff8df;
    }
    .tc-gequ {
      background-color: #ebedf8;
    }
    .tc-icon-test {
      background-color: #ffefea;
    }
    .tc-beidanci {
      background-color: #ebf7f0;
    } */
    .control {
        width: 100%;
        overflow: hidden;
        position: absolute;
        z-index: 999;
        background-color: white;
    }

    .backgroundColor {
        width: 83%;
        height: 70%;
        border-radius: 10%;
        position: absolute;
        left: 10%;
        top: 20%;
        background: #ed8f03;
        background: -webkit-linear-gradient(to right, #f5af19, #ed8f03);
        background: linear-gradient(to right, #f5af19, #ed8f03);
        z-index: -1;
    }

    .title {
        display: flex;
        height: 50px;
        line-height: 50px;
        width: 100%;
        text-align: center;
        color: white;
        background: #ed8f03;
        /* fallback for old browsers */
        background: -webkit-linear-gradient(
                to right,
                #f5af19,
                #ed8f03
        );
        /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(
                to right,
                #f5af19,
                #ed8f03
        );
        font-size: 20px;
        border-radius: 2%;

    }

    .title .hTitle {
        /* display: flex;
       flex: 1;
       justify-items: center;
       text-align: center; */
        width: 82%;
        text-align: left;
        font-weight: 500;
        font-size: 19px;
    }

    .tc-back01 {
        display: flex;
        padding: 10px 4px;
        align-items: center;
        justify-content: center;
        font-size: 21px;
        /* flex: 0 0 50px; */
    }

    .container {
        display: grid;
        align-items: center;
        justify-content: center;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(12, 1fr);
        grid-gap: 20px;
        position: relative;
        overflow: hidden;
    }

    .grid-item-1 {
        grid-column: 2/7;
        grid-row: 2/7;
        /* border:#f5af19 1px solid;
        box-shadow: 10px 10px 5px #f5af19; */
    }

    .grid-item-2 {
        grid-column: 7/12;
        grid-row: 2/7;
        /* border:#f5af19 1px solid;
      box-shadow: 10px 10px 5px #f5af19; */
    }

    .grid-item-3 {
        grid-column: 2/7;
        grid-row: 7/12;
        /* border:#f5af19 1px solid;
      box-shadow: 10px 10px 5px #f5af19; */
    }

    .grid-item-4 {
        grid-column: 7/12;
        grid-row: 7/12;
        /* border:#f5af19 1px solid;
      box-shadow: 10px 10px 5px #f5af19; */
    }

    .grid-item-1,
    .grid-item-2,
    .grid-item-3,
    .grid-item-4 {
        border-radius: 7%;
        text-align: center;
        /* opacity: 0; */
        background: white;
        border: #f5af19 1px solid;
        /* margin-bottom: -50%; */
        background: #ed8f03;
        background: -webkit-linear-gradient(to right, #f5af19, #ed8f03);
        background: linear-gradient(to right, #f5af19, #ed8f03);
    }

    @font-face {
        font-family: "webfont";
        font-display: swap;
        src: url("//at.alicdn.com/t/webfont_0et26122dmh.eot"); /* IE9*/
        src: url("//at.alicdn.com/t/webfont_0et26122dmh.eot?#iefix") format("embedded-opentype"),
            /* IE6-IE8 */ url("//at.alicdn.com/t/webfont_0et26122dmh.woff2") format("woff2"),
        url("//at.alicdn.com/t/webfont_0et26122dmh.woff") format("woff"),
            /* chrome、firefox */ url("//at.alicdn.com/t/webfont_0et26122dmh.ttf") format("truetype"),
            /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/ url("//at.alicdn.com/t/webfont_0et26122dmh.svg#Alibaba-PuHuiTi-Regular") format("svg"); /* iOS 4.1- */
    }

    .web-font {
        width: 100%;
        height: 24px;
        text-align: center;
        display: inline-block;
        font-family: "webfont" !important;
        font-size: 20px;
        color: white;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }

    @media screen and (max-width: 1024px) {
        /* .container {
          line-height:150px;
        }
         .tc-xiangguanzhuanji-guangdie,.tc-gequ,.tc-icon-test,.tc-beidanci{
          font-size:150px;
          margin-top: 75px;
        }
        .web-font{
          font-size: 60px;
        }
         .hTitle{
          font-size: 75px;
          line-height: 75px;
          height: 75px;
          font-size: 36px;
        } */
    }

    @media screen and (max-width: 768px) {
        /* .container {
          line-height: 100px;
        }
        .tc-xiangguanzhuanji-guangdie,.tc-gequ,.tc-icon-test,.tc-beidanci{
          font-size:100px;

        }
        .web-font{
          font-size: 36px;
        }
        .hTitle{
          font-size: 75px;
          line-height: 75px;
          height: 75px;
          font-size: 36px;
        } */
    }

    @media screen and (max-device-width: 414px) {
        /* .container {
          line-height: 65px;
        }
         .tc-xiangguanzhuanji-guangdie,.tc-gequ,.tc-icon-test,.tc-beidanci{
          font-size: 60px;
          margin-bottom:20px;
          margin-top:60px;
        }
        .web-font{
          font-size: 24px;
        }
        .hTitle{
          font-size: 20px;
          height: 40px;
          line-height: 40px;
        } */
    }

    @media screen and (max-device-width: 411px) {
        /* .container {
          line-height:60px;

        }
        .tc-xiangguanzhuanji-guangdie,.tc-gequ,.tc-icon-test,.tc-beidanci{
          font-size: 60px;
          margin-bottom:20px;
          margin-top:60px;
        }
        .web-font{
          font-size: 24px;
        }
        .hTitle{
          font-size: 20px;
          height: 40px;
          line-height: 40px;
        } */
    }

    @media screen and (max-width: 375px) {
        /* .container {
          line-height: 50px;
          grid-template-rows: repeat(16, 1fr);
        }
        .tc-xiangguanzhuanji-guangdie,.tc-gequ,.tc-icon-test,.tc-beidanci{
          font-size: 60px;
          margin-bottom:20px;
          margin-top:50px;
        }
        .web-font{
          font-size: 24px;
        }
        .hTitle{
          font-size: 20px;
          height: 40px;
          line-height: 40px;
        } */
    }

    @media screen and (max-width: 360px) {
        /* .container {
          line-height: 50px;
        }
        .tc-xiangguanzhuanji-guangdie,.tc-gequ,.tc-icon-test,.tc-beidanci{
          font-size: 60px;
          margin-bottom:20px
        }
        .hTitle{
          width: 80%;
          height: 40px;
          line-height: 40px;
          font-size: 20px;

        } */
    }

    @media screen and (max-device-width: 357px) {
        /* .container {
          line-height: 210px;
          grid-template-rows: repeat(14, 1fr);
        } */
    }

    @media screen and (max-width: 320px) {
        /* .container {
          line-height: 40px;
        }
        .tc-xiangguanzhuanji-guangdie,.tc-gequ,.tc-icon-test,.tc-beidanci{
          font-size: 48px;
          margin-bottom:20px;
        }
        .web-font{
          font-size: 20px;
        }
        .hTitle{
          height: 35px;
          line-height: 35px;
          font-size: 16px;
        } */
    }
</style>
