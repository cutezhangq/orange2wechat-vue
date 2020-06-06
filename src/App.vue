<template>
    <div id="app">
        <transition :name="transitionName">
            <!-- <transition enter-active-class="animated fadeInUp faster"> -->
            <!-- <transition name="slide">  -->
            <!-- <keep-alive :exclude="['Profile',
                  'Setting',
                  'AlbumDetail',
                  'FavoriteIndex',
                  'FavoriteAlbum',
                  'FavoriteTrack',
                  'SearchInfo',
                  'Search']"> -->
              <router-view :Event_Play="Event_Play" class="transitionBody"></router-view>
            <!-- </keep-alive> -->
        </transition>
        <play class="play" :Event_Play="Event_Play" ref="player"></play>
    </div>
</template>

<script>
    import play from '@/components/Play/Play.vue'
    import Vue from "vue"

    const Event_Play = new Vue();
    export default {
        provide() {
            return {}
        },
        data() {
            return {
                stop: false,
                Event_Play: Event_Play,
                transitionName: ''
            }
        },
        mounted() {
            let m = document.querySelector('#app')
            m.addEventListener('touchend', this.firstPlay)
        },
        methods: {
            firstPlay() {
                let music = document.querySelector('#music-audio')
                music.play()
                if (music.src !== '') {
                    this.stop = true
                }
            },
            reload() {
                this.alive = false
                this.$nextTick(() => {
                    this.alive = true
                })
            }

        },
        watch: {
            stop() {
                let m = document.querySelector('#app')
                m.removeEventListener('touchend', this.firstPlay)
            },
            //路由进入/退出动画
            $route(to, from) {
                //如果to索引大于from索引,判断为进入状态,反之则为退出状态
                this.transitionName = to.meta.index > from.meta.index ? 'slide-right' : 'slide-left'
            }
        },
        components: {
            play
        },

    }
</script>
<style lang="less">
    @import "~@/common/less/variable";
    @import '~@/common/less/minxin';

    html, body {
        height: 100%;
        background-color: #fff;
    }

    .transitionBody {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    // .slide-right-enter-active,
    // .slide-right-leave-active,
    // .slide-left-enter-active,
    // .slide-left-leave-active {
    //   will-change: transform;
    //   transition: all 500ms;
    //   position: absolute;
    // }
    //新的页面
    .slide-left-leave-active,
    .slide-right-enter-active {
        will-change: transform;
        transition: all 600ms;
        position: absolute;
    }

    //原来的页面
    .slide-left-enter-active,
    .slide-right-leave-active {
        will-change: transform;
        transition: all 600ms;
        position: absolute;
    }

    .slide-right-enter {
        opacity: 1;
        transform: translate3d(-100%, 0, 0);
    }

    .slide-right-leave-active {
        opacity: 1;
        // transform: translate3d(100%, 0, 0);
    }

    .slide-left-enter {
        opacity: 1;
        // transform: translate3d(100%, 0, 0);
    }

    .slide-left-leave-active {
        opacity: 1;
        transform: translate3d(-100%, 0, 0);
    }
</style>
