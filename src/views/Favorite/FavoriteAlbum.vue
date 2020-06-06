<template>
    <div style="z-index:300">
        <div class="radio" ref="radio" v-if="albumList!==null">
            <cube-sticky :pos="scrollY">
                <cube-scroll
                        ref="scroll"
                        :scroll-events="scrollEvents"
                        @scroll="scrollHandler"
                        :data="albumList"
                        :options="options"
                        @pulling-up="onPullingUp"
                >
                    <cube-sticky-ele>
                        <div class="back">
                            <i class="iconfont tc-back01 icon" aria-hidden="true" @click="backInto"></i>
                            <span class="title">我喜欢的{{msg}}</span>
                        </div>
                    </cube-sticky-ele>
                    <div ref="contentList" class="contentList">
                      <div v-if="this.haveContent === true">
                        <AlbumSPU :albums="albumList"/>
                      </div>
                      <div v-if="this.haveContent === false">
                           <div class="bgImg">
                              <img :src="this.defailtPageImg" class="defailtImg"/>
                            <span class="defailtTitle">{{this.defailtTitle}}</span>
                          </div>
                        </div>
                    </div>
                </cube-scroll>
            </cube-sticky>
        </div>
        <Loading v-if="isLoading" style="z-index:990"/>
    </div>
</template>
<script>
    import global from "@/api/global";
    import AlbumSPU from "@/components/SPU/AlbumSPU";
    import {axiosJWT} from "../../common/js/request";
    import {callbackify} from "util";
    import {mapGetters} from "vuex";

    let FROMURL = "";
    export default {
        name: "FavoriteAlbum",
        data() {
            return {
                isLoading: true,
                albumList: [],
                msg: "专辑",
                scrollEvents: ["scroll"],
                pageNum: 0,
                clientHeight: 0,
                url: "",
                scrollY: 0,
                //  toUrl:'',
                options: {
                    pullUpLoad: true,
                    bounce: false
                },
                pullDownStyle: "",
                haveContent:Boolean,
                defailtPageImg:require('@/common/image/defaultPage_search.png'),
                defailtTitle:'哎呀,还没有收藏相应的资源哦~',
            };
        },
        methods: {
            scrollHandler({y}) {
                this.scrollY = -y;
            },
            getScreenHeight() {
                this.clientHeigth =
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight;
                console.log("this.clientHeigth", this.clientHeigth);
                let height = 0;
                this.initPlayer
                    ? (height = `${this.clientHeigth - 60}px`)
                    : (height = `${this.clientHeigth}px`);
                this.$refs.radio.style.height = height;
            },
            onPullingUp() {
                if (this.options.pullUpLoad) {
                    this.getFavoriteAlbum().then(callbackMessage => {
                        if (callbackMessage == null) {
                            this.showToastTxtOnly();
                            this.options.pullUpLoad = false;
                            return;
                        }
                        this.albumList = this.albumList.concat(callbackMessage);
                    });
                }
            },
            showToastTxtOnly() {
                this.toast = this.$createToast({
                    txt: "没有更多啦",
                    type: "txt",
                    time: 1000
                });
                this.toast.show();
            },
            getFavoriteAlbum() {
                return axiosJWT({
                    url: "/favorite/album",
                    method: "get",
                    params: {
                        pageSize: global.GET_ALBUM_NUM,
                        pageNum: ++this.pageNum
                    }
                })
                    .then(response => {
                        if (response.code == 200) {
                          this.isLoading = false
                          this.haveContent = true
                          return response.data.list;
                        }
                        if(response.code === 204){
                            this.isLoading = false
                            this.haveContent = false
                            return 0
                        }
                        return null;
                    })
                    .catch(response => {
                    });
            },
            // 返回上一级
            backInto() {
                this.$router.back();
                // console.log("fromUrl",FROMURL)
                // this.$router.push(FROMURL)
            }
        },
        watch: {
            albumList(newVal) {
                if (newVal === null || newVal === undefined) {
                    return;
                }
                this.albumList = newVal;
            },
            initPlayer(newVal) {
                newVal
                    ? (this.$refs.albumListSty.style.height = `${this.clientHeigth -
                    100}px`)
                    : (this.$refs.albumListSty.style.height = `${this.clientHeigth -
                    40}px`);
            }
        },
        computed: {
            ...mapGetters(["initPlayer"])
        },
        created() {
            this.getFavoriteAlbum().then(callbackMessage => {
                if (callbackMessage === undefined) {
                    return;
                }
                this.albumList = callbackMessage;
                if (this.albumList.length < global.GET_ALBUM_NUM) {
                    this.options.pullUpLoad = false;
                }
            });
        },
        mounted() {
            this.getScreenHeight();
            let _this = this;
            window.onresize = () => {
                _this.getScreenHeight();
            };
        },
        components: {
            AlbumSPU
        },
        destroyed() {
            window.onresize = null;
        }
    };
</script>
<style scoped lang="less">
    .radio {
        background: white;
        overflow: scroll;
    }

    .back {
        width: 100%;
        height: 48px;
        line-height: 40px;
        background: #ed8f03;
        /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #f5af19, #ed8f03);
        /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #f5af19, #ed8f03);
    }

    .icon {
        padding: 10px 4px;
        font-size: 21px;
        color: #fff;
    }

    .title {
        // color: white;
        //margin-left: 15px;
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
                font-size: 20px;
            }

            .title {
                width: 75%;
                text-align: center;
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
  margin-top: 16px;
}
</style>