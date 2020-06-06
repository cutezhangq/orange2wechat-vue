<template>
  <div class="player">
    <!--全屏播放器-->
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen" @touchstart.once="firstPlay" v-if="playDetail"> <!--.once 事件只执行一次-->
        <div class="background">
          <div class="filter"></div>
          <img :src="playDetail.coverUrl" width="100%" height="100%" v-if="playDetail.coverUrl"/>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="iconfont tc-fanhui-copy-copy-copy-copy"></i>
          </div>
          <h1 class="title" v-html="playDetail.title"></h1>
        </div>
        <div class="middle">
          <transition name="middleL">
            <div class="middle-l">
              <div class="cd-wrapper">
                <div class="cd" :class="cdCls">
                  <img :src="playDetail.coverUrl" class="image" v-if="playDetail.coverUrl"/>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                :percent="percent"
                @percentChangeEnd="percentChangeEnd"
                @percentChange="percentChange"
              ></ProgressBar>
            </div>
            <span class="time time-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="iconfont mode" :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="iconfont tc-xiayishou1" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i class="iconfont" @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont tc-xiayishou" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                class="iconfont"
                @click="toggleFavorite(playDetail)"
                :class="getFavoriteIcon(playDetail)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--小播放器-->
    <transition name="mini">
      <div class="mini-player" v-show="(!fullScreen)&&initPlayer" @click.stop="open"  v-if="playDetail"> <!--阻止事件冒泡-->
        <div class="icon">
          <img :class="cdCls" :src="playDetail.coverUrl" width="40" height="40" v-if="playDetail.coverUrl"/>
        </div>
        <div class="text">
          <h2 class="name" v-html="playDetail.title"></h2>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progress-circle :radius="radius" :percent="percent">
            <!-- <i class="icon-mini" :class="miniIcon" ></i> -->
            <i class="iconfont icon" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="iconfont tc-caidan"></i>
        </div>
      </div>
    </transition>
    <playlist @stopMusic="stopMusic" ref="playlist"></playlist>
    <audio
      id="music-audio"
      ref="audio"
      @ended="end"
      autoplay
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import ProgressCircle from "@/components/Play/ProgressCircle";
import ProgressBar from "@/components/Play/ProgressBar";
import Playlist from "@/components/Play/PlayList";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/utl";
import { getPlayDetail,createSong,changeFavoriteStatus} from "@/common/js/song.js";
import { axiosJWT } from "@/common/js/request";
export default {
  data() {
    return {
      // id: '',
      url: "",
      songReady: false,
      currentTime: 0,
      duration: 0,
      percent: 0,
      radius: 32,
      // currentLyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      // playingLyric: '',
      // noLyric: false,
      //获取单个歌曲的信息
      // songDetail: [],
      playDetail: [],
      deviceId: "gh_8f487a612fc9_002b90da5a18f152"
    };
  },
  created() {
    this.move = false;
  },
  mounted() {
    //console.log("sequenceList",this.sequenceList)
  },
  computed: {
    // 播放模式图标
    iconMode() {
      if (this.mode === playMode.sequence) {
        return "tc-shunxubofang";
      } else if (this.mode === playMode.loop) {
        return "tc-danquxunhuan";
      } else {
        return "tc-suijibofang";
      }
    },
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    miniIcon() {
      return this.playing ? "tc-zanting" : "tc-zanting1";
    },
    playIcon() {
      return this.playing ? "tc-zantingbofang" : "tc-bofang";
    },
    ...mapGetters([
      //播放列表
      "playlist",
      //设置是否全屏
      "fullScreen",
      //当前播放歌曲
      "currentSong",
      //播放状态
      "playing",
      //当前播放歌曲索引
      "currentIndex",
      //播放模式
      "mode",
      // 顺序列表
      "sequenceList",
      // 收藏歌曲列表
      "favoriteList",
      // 用于刚进入页面不显示播放器，点击任意一首播放后显示
      "initPlayer",
      "currentSongId"
    ])
  },
  watch: {
    playing(newVal){
      const audio = this.$refs.audio;
      newVal ? audio.play() : audio.pause();
    },
    currentSong(newVal, oldVal) {
      
      if (!newVal.id) {
        return;
      }
      if (newVal.id === oldVal.id) {
        return;
      }
      // console.log("this.currentSongId",this.currentSongId)
      // this.currentSongId = newVal.id
      // 存储当前歌曲id
      console.log("this.currentSongId",this.currentSongId)
      // console.log("path",this.$route.path)
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
      //获取播放详情 
      
      getPlayDetail(newVal).then(data=>{
        console.log("data",data)
        //创建默认的歌曲
         this.playDetail = data
        let defaultSong = createSong()
        if(this.playDetail==null||this.playDetail.sourceUrl==null){
             // 如果当前资源为空 设置提示没有该资源，并不显示播放器
          this.showToastTxtOnly() 
          this.playDetail = null
          this.setPlayingState(false)
          // 没有该资源不能播放
          this.$refs.audio.pause();
          // 当不位于搜索时，当前歌曲没有资源 继续播放下一首
           if(this.$route.path!=='/searchInfo'){
              this.songReady = true
              this.next()
           }else{
              // 如果没有获取到数据，就设置第一次播放为false
               this.setInitPlayer(false)
               this.setFullScreen(false)
           }
          return;
        }
        if(this.playDetail.coverUrl==null){
          // 如果封面为空 设置默认图片
          this.playDetail.coverUrl = defaultSong.coverUrl
        }
        if(this.playDetail.title==null){
          // 如果标题为空 设置默认标题
          this.playDetail.title = defaultSong.title
        }
        else
        {
          this.url = this.playDetail.sourceUrl
          // 判断播放列表里的歌曲是否已收藏
          this.initIsFavorite(this.playDetail)
        }
        // 如果没有获取到数据，播放源不为空，就设置第一次播放为true
        this.$refs.audio.play()
        // this.togglePlaying()
        if(!this.initPlayer){
          this.setInitPlayer(true)
          this.setFullScreen(true)
        }
       
     })
    },
    url(newUrl) {
      //监听播放的url
      if(newUrl == null){
        this.showToastTxtOnly()
        return ;
      }
      this.$refs.audio.src = newUrl;

      let stop = setInterval(() => {
        if(this.$refs.audio.duration==NaN){
          return;
        }
        //获取当前视频长度
        this.duration = this.$refs.audio.duration;
        if (this.duration) {
          clearInterval(stop);
        }
      }, 150);
    },
    currentTime() {
      this.percent = this.currentTime / this.duration;
    }
  },
  methods: {

    showToastTxtOnly() {
      this.toast = this.$createToast({
        txt: '该资源未找到',
        type: 'txt',
        time: 1000
      })
      this.toast.show()
    },
    firstPlay() {
      this.$refs.audio.play();
      console.log("firstPlay");
      // this.setInitPlayer(true);
    },
    stopMusic() {
      // 删除最后一首的时候暂停音乐
      this.$refs.audio.pause();
      console.log("删除最后一首的时候暂停音乐");
    },
    showPlaylist() {
      this.$refs.playlist.show();
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return "tc-love2";
      }
      return "tc-love";
    },
    // 收藏或者取消收藏歌曲
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
        changeFavoriteStatus(this.currentSong,"delete",this.deviceId)
      } else {
        this.saveFavoriteList(song);
        changeFavoriteStatus(this.currentSong,"add",this.deviceId)
      }
    },
    // 是否已收藏
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id;
      });
      return index > -1;
    },
    initIsFavorite(playDetail){

      // 如果收藏了 保存到收藏列表中
        if(playDetail.isFavorite){
          this.saveFavoriteList(playDetail)
        }
    },
    //改变播放的模式
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = [];
      if (mode === playMode.random) {
        // 随机播放 重新设置播放列表
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this._resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    _resetCurrentIndex(list) {
      let _this = this;
      let index = list.findIndex(item => {
        return item.id === _this.currentSong.id;
      });
      console.log("index: " + index);
      this.setCurrentIndex(index);
    },
    //播放器滚动条 滚动时
    percentChange(percent) {
      this.move = true;
      // 设置当前播放时间
      const currentTime = this.duration * percent;
      this.currentTime = currentTime;
    },
    // 当拖动或点击滚动条时
    percentChangeEnd(percent) {
      this.move = false;
      const currentTime = this.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.$refs.audio.play();
        this.setPlayingState(true);
      }
    },
    // 当视频播放位置已经改变，显示视频当前播放位置（一秒计）
    updateTime(e) {
      if (this.move) {
        return;
      }
      this.currentTime = e.target.currentTime;
    },
    //设置时分秒的格式
    format(interval) {
      interval = interval | 0;
      let minute = (interval / 60) | 0;
      let second = interval % 60;
      if (second < 10) {
        second = "0" + second;
      }
      return minute + ":" + second;
    },
    // 播放结束时
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    // 循环播放
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    // 视频加载发生错误时
    error() {
      this.songReady = true;
    },
    // 视频是否已准备好开始播放
    ready() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
    },
    // 下一首
    next() {
      
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        // this.$refs.audio.play()
        if (!this.playing) {
          
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    //上一首
    prev() {
      if (!this.songReady) {
        return;
      }
      this.songReady = false;
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      // 设置当前播放歌曲索引
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    // 全屏播放器返回
    back() {
      this.setFullScreen(false);
    },
    //
    open() {
      this.setFullScreen(true);
    },
    // 播放|暂停 状态
    togglePlaying() {
      // console.log("togglePlaying---1",this.playing)
      // const audio = this.$refs.audio;
      // this.setPlayingState(!this.playing);
      // console.log("togglePlaying---2",this.playing)
      // this.playing ? audio.play() : audio.pause();
      // console.log("togglePlaying---1",this.playing)
    //  const audio = this.$refs.audio;
      this.setPlayingState(!this.playing);
      // console.log("togglePlaying---2",this.playing)
      // this.playing ? audio.play() : audio.pause();
    },
     togglePlayer() {
      const audio = this.$refs.audio;
      this.playing ? audio.play() : audio.pause();
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlaylist: "SET_PLAYLIST",
      setInitPlayer: "SET_INIT_PLAYER"
    }),
    ...mapActions(["saveFavoriteList", "deleteFavoriteList", "savePlayHistory"])
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Playlist
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/variable";
@import "~@/common/less/minxin";
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 950;
    background: @color-background;
    .background {
      position: absolute;
      left: -50%;
      top: -50%;
      width: 300%;
      height: 300%;
      z-index: -150;
      opacity: 0.6;
      filter: blur(30px);
      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.6;
      }
      .filterR {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.4;
        &.filterR-enter-active,
        &.filterR-leave-active {
          transition: all 0.3s;
        }
        &.filterR-leave-to,
        &.filterR-enter {
          opacity: 0;
        }
        &.filterR-leave {
          opacity: 0.4;
        }
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 850;
        .tc-fanhui-copy-copy-copy-copy {
          display: block;
          padding: 20px 9px;
          font-size: 20px;
          color: @color-theme-l;
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 40px;
        text-align: center;
        .no-wrap();
        font-size: @font-size-large;
        font-weight: bold;
        color: @color-text-l;
      }
    }
    .middle {
      display: flex;
      align-items: center;
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        &.middleL-enter-active,
        &.middleL-leave-active {
          transition: all 0.3s;
        }
        &.middleL-enter,
        &.middleL-leave-to {
          opacity: 0;
        }
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 15px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }
      .middle-r {
        display: inline-block;
        position: absolute;
        top: 0;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        &.middleR-enter-active,
        &.middleR-leave-active {
          transition: all 0.2s;
        }
        &.middleR-enter,
        &.middleR-leave-to {
          opacity: 0;
        }
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 40px;
            color: @color-text-ggg;
            font-size: @font-size-medium;
            &.current {
              color: #fff;
            }
          }
          .no-lyric {
            line-height: 40px;
            margin-top: 60%;
            color: @color-text-ggg;
            font-size: @font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: @color-text-l;
          font-size: @font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
            color: @color-text-gg;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: @color-theme-l;
          &.disable {
            color: @color-theme;
          }
          i {
            font-size: 25px;
          }
          .mode {
            font-size: 30px;
          }
          &.i-left {
            text-align: right;
          }
          &.i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 35px;
            }
          }
          &.i-right {
            text-align: left;
          }
          .tc-love2 {
            color: @color-sub-theme;
          }
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    // position:absolute;
    left: 0;
    bottom: 0;
    z-index: 980;
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255);
    border-top: 1px solid rgba(214, 209, 209, 0.6);
    visibility: visible;
    // margin-top: 20px;
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 10px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        line-height: 16px;
        padding: 0 20px;
        .no-wrap();
        font-size: @font-size-medium;
        color: @color-text;
      }
      .desc {
        .no-wrap();
        font-size: @font-size-small;
        color: @color-text;
      }
    }
    .control {
      flex: 0 0 45px;
      width: 30px;
      padding: 20px 10px 10px 0px;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist,
      .iconfont {
        font-size: 30px;
        color: @color-theme-d;
      }
      .iconfont {
        position: relative;
        left: 0px;
        top: 0px;
      }
      .tc-caidan {
        font-size: 30px;
        // line-height: 60px;
      }
      .tc-zanting {
        color: @color-theme-d;
        font-size: 36px;
        position: absolute;
        left: -12px;
        top: -1px;
      }
      .tc-zanting1 {
        color: @color-theme-d;
        font-size: 36px;
        position: absolute;
        left: -10px;
        top: -1px;
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>