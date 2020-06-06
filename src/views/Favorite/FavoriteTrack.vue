<template>
    <div style="z-index:300">
        <div class="box" v-if="trackList!==null">
                <ul class="back">
                    <li>
                        <i class="iconfont tc-back01 icon" aria-hidden="true" @click="back"></i>
                        <span class="title">我喜欢的{{msg}}</span>
                    </li>
                </ul>
                <!--没有收藏页-->
                <div v-show="this.haveContent === false" style="z-index:310">
                           <div class="bgImg">
                              <img :src="this.defailtPageImg" class="defailtImg"/>
                            <span class="defailtTitle">{{this.defailtTitle}}</span>
                          </div>
                </div>
                <!--有收藏页内容-->
                <cube-sticky :pos="scrollY" v-show="this.haveContent === true" style="z-index:300">
                  <cube-scroll
                        ref="scroll"
                        :scroll-events="scrollEvents"
                        @scroll="scrollHandler"
                        :options="options"
                >
                    <div ref="contentList" class="contentList">
                        <div v-show="this.haveContent === true" style="z-index:300">
                          <TrackSPU :tracks="trackList" :total="trackList.length" 
                                ref="TrackSPU" 
                                @clickItem="clickItem"
                                :special="9"
                                />
                        </div>
                    </div>
                </cube-scroll>
            </cube-sticky>
        </div>
        <!-- <div v-if="trackList === null" class="loadFail">
            <div class="header">
                <i class="iconfont tc-back01" @click="back"></i>
                <h1 class="title">我喜欢的{{msg}}</h1>
            </div>
            <img src="@/common/image/defaultPage_imgs.png" width="60%" class="failImg"/>
            <div class="tips">糟糕，加载失败了</div>
        </div> -->
        <Loading v-if="isLoading" style="z-index:990"/>
    </div>
</template>
<script>
    import TrackSPU from "@/components/SPU/TrackSPU";
    import {axiosJWT} from "@/common/js/request";
    import { mapActions, mapGetters } from "vuex";

    export default {
        name: "FavoriteTrack",
        components: {
            TrackSPU
        },
        data() {
            return {
                isLoading: true,
                trackList: "",
                msg: "",
                decideType: this.$route.query.type,
                scrollEvents: ["scroll"],
                scrollY: 0,
                list: [],
                pageNum: 0,
                options: {
                    // pullUpLoad: true,
                    bounce: false
                },
                haveContent:Boolean,
                defailtPageImg:require('@/common/image/defaultPage_search.png'),
                defailtTitle:'哎呀,还没有收藏相应的资源哦~',
            };
        },
        methods: {
            clickItem(index) {
                // this.$emit("togglePlayer");
                this.selectPlay({
                    list: this.trackList,
                    index: index
                });
            },
            scrollHandler({y}) {
                this.scrollY = -y;
            },
            showToastTime() {
                const toast = this.$createToast({
                    time: 500
                });
                toast.show();
            },
            getFavoriteTrack() {
                switch (this.decideType) {
                    case 1:
                        this.msg = "歌曲";
                        break;
                    case 2:
                        this.msg = "课文";
                        break;
                    case 3:
                        this.msg = "单词";
                        break;
                    default:
                        break;
                }
                this._getTrack().then(callbackMessage => {
                    if (callbackMessage === null || callbackMessage === undefined) {
                        return;
                    }
                    //console.log("this.trackList",this.trackList)
                    this.trackList = callbackMessage;
                    // if (this.trackList.length < 10) {
                    //   this.options.pullUpLoad = false;
                    // }
                });
            },
            back() {
                this.$router.back();
            },
            _getTrack() {
                return axiosJWT({
                    url: "/favorite/track",
                    method: "get",
                    params: {
                        type: this.decideType
                    }
                })
                    .then(response => {
                        if (response.code === 200) {
                            this.isLoading = false
                            this.haveContent = true
                            return response.data;
                        }
                        if(response.code === 204){
                            this.isLoading = false
                            this.haveContent = false
                        }
                        return null;
                    })
                    .catch({});
            },
            // onPullingUp() {
            //   if (this.options.pullUpLoad) {
            //       this._getTrack().then(callbackMessage => {
            //         if (callbackMessage == null) {
            //           this.showToastTxtOnly("没有更多啦");
            //           this.options.pullUpLoad = false;
            //           return;
            //         }
            //         this.trackList = this.trackList.concat(callbackMessage);
            //       });
            //     }
            // },
            ...mapActions(["selectPlay"]),
            //当再次进入（播放器打开时），空出miniplay的距离
            IsOpenMiniPlay(){
              if(this.initPlayer === true){
              this.$refs.contentList.style.marginBottom = `${108}px`
            }
            }
        },
        mounted(){
          this.IsOpenMiniPlay()
        },
        computed: {
            // track:function(){
            //   return this.trackList || null
            // }
            ...mapGetters(["initPlayer"])
        },
        watch: {
            trackList(newVal) {
                if (newVal == null) {
                    return;
                }
                this.trackList = newVal;
            },
            initPlayer(newVal) {
              console.log('執行了newVal..',newVal)
              this.$refs.contentList.style.marginBottom = newVal
                  ? `${108}px`
                : `${48}px`;
            }
        },
        created() {
            this.getFavoriteTrack()
            // this.initPlayer()
        }
    };
</script>

<style scoped lang="less">
@import url('~@/assets/css/common.less');
    .box {
        position: fixed;
        height: 100%;
        width: 100%;
        background: white;
        // z-index: 999;
        /* overflow: hidden; */
    }

    .back {
        width: 100%;
        height: 48px;
        line-height: 40px;
        background: #ed8f03;
        /* fallback for old browsers */
        background: -webkit-linear-gradient(to right,
        #f5af19,
        #ed8f03);
        /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right,
        #f5af19,
        #ed8f03);
    }

    .icon {
        padding: 10px 4px;
        font-size: 21px;
        color: #fff;
    }

    .title {
        font-size: 19px;
        font-weight: 500;
        color: #fff;
    }

    .loadFail {
        .header {
            display: flex;
            width: 100%;
            height: 50px;
            line-height: 50px;
            color: gray;
            font-size: 20px;

            .tc-back01 {
                width: 50px;
                height: 50px;
                text-align: center;
                flex: 0 0 50px;
                font-size: 24px;
            }

            .title {
                width: 75%;
                text-align: center;
                font-size: 19px;
                font-weight: 500;
            }
        }

        .tips {
            width: 100%;
            height: 40px;
            text-align: center;
            line-height: 40px;
            color: gray;
        }

        .failImg {
            margin: 28% 20% 0 20%;
        }
    }
    .bgImg{
      margin: 42% 0;
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
.contentList{
  margin-bottom: 60px;
}
</style>
