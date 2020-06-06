<template>
    <div style="z-index:200;background-color:#fff">
        <cube-sticky :pos="scrollY">
            <div class="scroll-list-wrap" ref="scroll_list_wrap">
                <cube-scroll
                        ref="scroll"
                        direction="vertical"
                        :options="options"
                        :data="albumLists"
                        :scroll-events="scrollEvents"
                        @scroll="scrollHandler"
                        @pulling-up="onPullingUp"
                >
                    <!--top部分-->
                    <cube-sticky-ele>
                        <div class="top" id="titleTop">
                            <p class="blockTitle">
              <span class="go_back">
                <span href="javascript:" @click="goto()">
                  <i class="iconfont tc-back01 back" aria-hidden="true"></i>
                 </span>
              </span>
                                <span class="title">专辑广场</span>
                            </p>
                        </div>
                    </cube-sticky-ele>
                    <!-- 专辑广场 -->
                    <div ref="contentList" class="contentList">
                        <AlbumSPU :albums="albumLists" v-if="albumLists.length"/>
                    </div>
                    <!-- <ul class="lodingAlbum" v-if="!albumLists.length">
                        <li v-for="item in 8" :key="item">
                            <img src="@/common/image/lodingAlbum.svg">
                        </li>
                    </ul> -->
                    <!-- <div class="underLine" v-show="!options.pullUpLoad">
                      <span class="underLineLeft"></span>
                      <span class="line">到底啦</span>
                      <span class="underLineRight"></span>
                    </div> -->
                </cube-scroll>
            </div>
        </cube-sticky>
        <Loading v-if="isLoading" style="z-index:990"/>
    </div>
</template>

<script>
    import global from '@/api/global'
    import {axiosJWT} from "@/common/js/request"
    import AlbumSPU from '@/components/SPU/AlbumSPU'
    import {mapGetters} from "vuex"

    export default {
        data() {
            return {
                isLoading: true,
                pageNum: 0,
                clientHeight: '',
                scrollEvents: ["scroll", "scroll-end"],
                scrollY: 0,
                options: {
                    pullUpLoad: true,
                    bounce: false
                },
                albumLists: [],
                randomNum: Number,
                user_ClientHeight: '',
            }
        },
        mounted() {
            //从vuex中获取手机屏幕可视区域的height
            this.clientHeight = this.userClientHeight
        },
        watch: {
            clientHeight: function () {
                this.changeFixed(this.clientHeight)
            }
        },
        computed: {
            ...mapGetters(["userClientHeight", "initPlayer"]),
        },
        methods: {
            //动态修改样式
            changeFixed(clientHeight) {
                const titleTop = document.getElementById('titleTop').offsetHeight;
                if (!this.initPlayer) {
                    this.$refs.scroll_list_wrap.style.height = clientHeight + 'px';
                } else {
                    this.$refs.scroll_list_wrap.style.height = clientHeight - global.MINIPLAY_HEIGHT + 'px';
                }
            },
            goto() {
                this.$router.push({name: 'resource'})
            },
            //生成随机数
            //  getRandomNum(){
            //    this.randomNum = Math.ceil(Math.random()*9)
            //  },

            //请求接口
            getAlbumList() {
                return axiosJWT({
                    url: "/album/market",
                    method: 'get',
                    params: {
                        pageNum: ++this.pageNum,
                        pageSize: global.GET_ALBUM_NUM,
                        //categoryId:this.randomNum
                    }
                }).then(res => {
                    if (res.code === 200) {
                        // this.$nextTick(()=>{
                        //   this.albumLists = res.data
                        // })
                        //直接返回请求到的值
                        this.isLoading = false
                        return res.data
                    }
                }).catch({})
            },
            //上拉加载
            onPullingUp() {
                if (this.options.pullUpLoad) {
                    this.getAlbumList().then(
                        callbackMessage => {
                            if (callbackMessage == null) {
                                this.options.pullUpLoad = false
                                this.showToastTxtOnly()
                                return;
                            }
                            this.albumLists = this.albumLists.concat(callbackMessage)
                            this.IsScrollBottom = false
                        }
                    )
                }
            },
            scrollHandler({y}) {
                this.scrollY = -y
            },
            showToastTxtOnly() {
                this.toast = this.$createToast({
                    txt: "没有更多啦",
                    type: "txt",
                    time: 1000
                });
                this.toast.show()
            },
        },
        components: {
            AlbumSPU
        },
        created() {
            let userClientHeight = this.userClientHeight
            this.user_ClientHeight = userClientHeight
            this.getAlbumList().then(callbackMessage => {
                this.albumLists = callbackMessage
            })
        },
    }
</script>

<style lang='less' scoped>
    @import url('~@/assets/css/common.less');

    .title {
        margin-bottom: 10px;
        font-weight: 500;
        font-size: 20px;
        color: #fff;
    }

    .go_back {
        left: -3px;
        top: 0px;
        padding: 10px 4px;
        font-size: 25px;
        color: #fff;;
    }

    .tc-back01 {
        font-size: 25px;
        color: #fff;
    }

    .back {
        font-size: 21px;
    }

    .scroll-list-wrap {
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;
    }

    .butBottom {
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

    .scroll-list-wrap {
        height: 350px
    }

    .underLine {
        display: inline-block;
        width: 100%;

        .line {
            display: inline-block;
            width: 22%;
            height: 40px;
            text-align: center;
            color: gray;
            padding: 5% 0;
        }

        .underLineLeft, .underLineRight {
            display: inline-block;
            width: 39%;
            height: 1px;
            line-height: 2px;
            border-top: 1px solid gray;
        }
    }

    .top {
        line-height: 45px;
        .setFrameGradualBg();
    }

    .contentList {
        padding-top: 16px;
        background-color: #fff;
    }
</style>
