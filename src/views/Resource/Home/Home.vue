<template>
    <div style="z-index:100">
        <div>
            <!-- decorate顶部回弹背景 -->
            <div class="decorate"></div>
            <!--轮播-->
            <div>
                <div class="carousel" ref="carousel" :options="carouselOption">
                    <cube-slide ref="slide" :data="items" :autoPlay="true" @change="changePage" :options="options">
                        <cube-slide-item v-for="(item, index) in items" :key="index"
                                         @click.native="clickHandler(item, index)">
                            <img :src="item.imgUrl">
                        </cube-slide-item>
                    </cube-slide>
                </div>
                <div class="carouselbg"></div>
            </div>

            <!--推荐专辑-->
            <div>
                <p class="blockTitle">
                    <span class="title2">推荐专辑</span>
                    <span class="butmore" @click="goTo('moreAlbums')">专辑广场</span>
                </p>
                <AlbumSPU :albums="playLists" class="albumspu" v-if="playLists.length"/>
                <ul class="lodingAlbum" v-if="!playLists.length">
                    <li v-for="item in 3" :key="item">
                        <img src="@/common/image/lodingAlbum.svg">
                    </li>
                </ul>
            </div>

            <!--精选文章-->
            <p class="blockTitle">
                <span class="title2">精选文章</span>
            </p>
        </div>
        <cube-scroll ref="scroll"
                     direction="vertical"
                     :options="scroll_options"
                     :scroll-events="scrollEvents"
                     @scroll="scrollHandler"
        >
            <ArticleList :articles="articles" v-if="articles.length"/>
            <ul v-if="!articles.length">
                <li v-for="item in 5" :key="item">
                    <img src="@/common/image/loadingText.svg">
                </li>
            </ul>
            <!--上拉加载 到底-->
            <!-- <div class="underLine" v-show="!options.pullUpLoad">
              <span class="underLineLeft"></span>
              <span class="line">到底啦</span>
              <span class="underLineRight"></span>
            </div> -->
        </cube-scroll>

    </div>
</template>

<script>
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {axiosJWT} from "@/common/js/request"
import AlbumSPU from '@/components/SPU/AlbumSPU'
import ArticleList from '@/components/ArticleList/ArticleList'

export default {
    data() {
        return {
            items: [],
            playLists: [],
            articles: [],
            options: {
                stopPropagation: true//轮播 阻止冒泡
            },
            count: 5, //初始文章获取6条count:5
            clientHeight: '',
            scrollEvents: ["scroll", "scroll-end"],
            scroll_options: {
                //pullUpLoad: true, //上拉加载
                //bounce: false,
                stop: 0
            },
            // pullUpLoadThreshold: 0,
            // pullUpLoadMoreTxt: '加载更多...',
            // pullUpLoadNoMoreTxt: '没有更多数据了',
        }
    },
    watch: {},
    computed: {
        carousel: function () {
            return this.$store.state.imgUrl.eqInfo || ''
        }
    },
    mounted() {
    },
    methods: {
        goTo(n) {
            this.$router.push({name: n})
        },
        //轮播
        getCarousel() {
            return axiosJWT({
                url: "/home/carousel",
                method: 'get',
            }).then(res => {
                if (res.code === 200) {
                    this.$nextTick(() => {  //DOM更新时渲染
                        this.items = res.data
                    })
                }
            }).catch({})
        },
        changePage(current) {
            //console.log('当前轮播图序号为:' + current)
        },
        clickHandler(item, index) {
            // this.$refs.carousel.addEventListener("touchstart",function(event){
            //   event.preventDefault();
            // },false)
            //console.log(item, index)
        },
        carouselOption() {
            //阻止事件冒泡
            //event.preventDefault();
            window.event ? window.event.cancelBubble = true : e.stopPropagation();
        },
        //推荐专辑的SPU
        getPlayList() {
            return axiosJWT({
                url: "/recommend/album",
                method: 'get',
            }).then(res => {
                if (res.code === 200) {
                    this.$nextTick(() => {
                        this.playLists = res.data
                    })
                }
            }).catch({})
        },
        //推荐文章SPU
        getArticleList() {
            return axiosJWT({
                url: "/home/news",
                method: 'get',
            }).then(res => {
                if (res.code === 200) {
                    this.$nextTick(() => {
                        this.articles = res.data
                    })
                    // return res.data
                }
            }).catch({})
        },
        // getArticleList(){
        //   return axiosJWT({
        //     url:"/home/news",
        //     method: 'get',
        //     // params:{
        //     //   count:++this.count
        //     // }
        //   })
        // },

        //上拉加载
        // onPullingUp() {
        //   console.log('进入了文章的上拉加载')
        //   let cubeScroll = this.$refs.scroll;
        //   cubeScroll.scroll.on("scrollEnd", pos => {
        //     if (this.scroll_options.pullUpLoad) {
        //       this.getArticleList().then(
        //         callbackMessage => {
        //           if (callbackMessage == null) {
        //             this.scroll_options.pullUpLoad = false;
        //             return;
        //           }
        //           this.articles = this.articles.concat(callbackMessage);
        //         }
        //       );
        //     }
        //   })
        // },
        scrollHandler({y}) {
            this.scrollY = -y;
        },
    },
    created() {
        this.getCarousel()
        setTimeout(() => {
            this.getPlayList()
        }, 500)
        setTimeout(() => {
            this.getArticleList()
        }, 600)
        // this.getArticleList().then(callbackMessage => {
        //   this.articles = callbackMessage
        // })
    },
    components: {
        AlbumSPU,
        ArticleList
        //swiper,
        //swiperSlide
    }
}
</script>

<style lang='less' scoped>
    @import url('~@/assets/css/common.less');

    .iconfont .tc-headset {
        font-size: 1.44rem !important;
    }

    .recommend-content {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .carousel {
        position: relative;
        height: 150px;
        margin: 0px 15px 15px 15px;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        border-radius: 2px;
        overflow: hidden;
        //box-shadow: 0 2px 9px #ddd;
        border-radius: 10px;
        z-index: 3;
    }

    .carousel img {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .title2 {
        margin-bottom: 10px;
        font-weight: bold;
        font-size: 19px;
    }

    .carouselbg {
        position: absolute;
        top: 0;
        height: 9%;
        .setFrameGradualBg();
        z-index: 1;
    }

    .butmore {
        float: right;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 20%;
        justify-content: center;
        background: #fff;
        border-radius: 22px;
        border: #EAEAEA 1px solid;
        margin-right: 2%;
        //zoom: 0.85;
        padding: 4px 0;
        font-size: 13px;
    }

    .blockTitle {
        margin: 0 1% 5% 1%;
    }

    .decorate {
        position: absolute;
        top: -40vh;
        z-index: -10;
        .setFrameGradualBg();
        width: 100%;
        height: 57vh;
        vertical-align: inherit;
    }

    .albumspu {
        white-space: normal;
    }

    .lodingAlbum {
        margin: 0 6% 2% 6%;
    }

    .cube-pullup-wrapper .before-trigger {
        padding: 0 !important;
        min-height: 0em;
    }

</style>
