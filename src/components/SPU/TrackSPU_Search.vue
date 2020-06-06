<template>
  <div class="song-list-wrapper" :style="{marginTop:special+'%'}">
    <div class="song-list">
      <li v-for="(track, index) in tracksList" :key="index" class="item" @click="clickItem(index)">
        <p class="song-count">{{index + 1}}</p>
        <div class="content">
          <h2 class="name">{{track.title}}</h2>
        </div>
        <i class="iconfont icon" :class="isCurrent(track.id)"></i>
      </li>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
//import { actionWebSocket, playWebSocket } from "@/common/js/WebSocket";
export default {
  props: {
    tracks: {},
    total: {
      default: 0
    },
    special: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tracksList: [],
      tracksLength: 0,
      //assignPath:''
    };
  },
  created() {
    //已进入页面，建立websocket连接
    this.createWebSocket();
  },
  mounted(){
    //this.assignPath = this.$route.path
  },
  methods: {
     isCurrent(id) {
      if (id == this.currentSong.id && this.playing) {
        return "tc-caozuo-bofang-zanting";
      } else {
        return "tc-play";
      }
      //用户点击同一首歌，播放暂停切换
    },
    //将列表当前点击的索引值存入vuex
    clickItem(index) {
      this.$emit("clickItem", index);
      //this.msg.append('trackId', JSON.stringify(this.tracksList[index].id))
      //this.msg = JSON.stringify(this.tracksList[index].id)
      //用户搜索的曲目播放，将播放曲目id发给后台
      let _data = {
        scene: "search",
        trackId: this.tracksList[index].id + ""
      };
      this.msg = JSON.stringify(_data);
      //console.log("msg为:", this.msg);
      //用户点击曲目，发送websocket
      this.sendMsgToWebSocket({
        msg: this.msg
      });
    },
    //点击播放全部 将列表存入vuex
    sequence() {
      //console.log("this.tracksList",this.tracksList)
      this.sequencePlay({
        list: this.tracksList
      });
    },
    ...mapActions([
      "selectPlay",
      "sequencePlay",
      "setPlayingState",
      "sendMsgToWebSocket",
      "createWebSocket"
    ])
  },
  watch: {
    tracks(newVal) {
      //传入的track没有内容，就跳出
      if (newVal == undefined || newVal == null) {
        return;
      }
      //判断类型   对象/数组
      if (Object.prototype.toString.call(newVal) == "[object Object]") {
        this.tracksList = newVal;
        this.tracksLength = this.total;
      } else if (Object.prototype.toString.call(newVal) == "[object Array]") {
        this.tracksList = newVal;
        if(this.total!==0){
          this.tracksLength = this.total
        }else{
          this.tracksLength = this.tracksList.length;
        }
        
      }
    },
    isCurrent(index) {
      if (id == this.currentSong.id && this.playing) {
        return "tc-caozuo-bofang-zanting";
      } else {
        return "tc-play";
      }
    }
  },
  computed: {
    ...mapGetters(["playing", "currentIndex", "currentSong"])
  }
};
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 60px;
}
.content {
  flex: 1;
  line-height: 20px;
  overflow: hidden;
}
.content i {
  display: inline-block;
  margin-right: 20px;
}
.song-count {
  flex: 0 0 50px;
  width: 50px;
  text-align: center;
  color: gay;
}
.name {
  margin-top: 4px;
  width: 90%;
  text-align: left;
  display: inline-block;
  overflow: hidden; /** 隐藏超出的内容 **/
  word-break: break-all;
  text-overflow: ellipsis; /** 多行 **/
}

.song-list-wrapper {
  border-radius: 10px;
  /* background: #f2f3f4; */
  background: rgb(253, 251, 251);
  /* margin-bottom: 60px; */
}
.sequence-play {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  /* background: #f2f3f4; */
  background: rgb(253, 251, 251);
  padding-left: 16px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  /* border-bottom: 1px solid rgb(228, 228, 228); */
}
.tc-zantingbofang,
.tc-bofang {
  font-size: 14px;
}
.text {
  font-size: 16px;
}
.icon {
  font-size: 24px;
  color: slategrey;
  padding-right: 14px;
  margin-left: -2px;
}
.count {
  font-size: 14px;
  color: gay;
}
.showHeight {
  height: 41px;
}
</style>
