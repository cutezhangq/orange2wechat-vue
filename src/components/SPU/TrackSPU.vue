<template>
  <div class="song-list-wrapper" :style="{marginTop:special+'%'}" ref="songlist">
    <cube-sticky-ele>
      <ul class="sticky-header">
        <li class="sequence-play" v-show="!(assignPath==='/contentListDetail')">
          <div class="header-left">
            <i class="iconfont tc-play icon" @click="sequence"></i>
            <span class="text">播放全部</span>
            <span class="count">(共{{tracksLength}}首)</span>
          </div>
          <slot name="love"></slot>
        </li>
      </ul>
    </cube-sticky-ele>
    <div v-if="tracks.length">
        <li v-for="(track, index) in tracks" :key="index" class="item" @click="clickItem(index)">
          <p class="song-count">{{index + 1}}</p>
          <div class="content">
            <h2 class="name">{{track.title}}</h2>
          </div>
          <i class="iconfont icon" :class="isCurrent(track.id)"></i>
        </li>
    </div>
    <div v-if="!tracks.length" class="loadStyle" ref="loadStyle" style="height:600px">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svgStyle">
        <rect
          x="0"
          y="0"
          rx="20"
          ry="20"
          width="100%"
          height="100%"
          style="fill:rgb(253, 251, 251);stroke:rgb(253, 251, 251)"
        />
      </svg>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
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
      assignPath: "",
      msg: "",
      status: -1
    };
  },
  mounted() {
    this.assignPath = this.$route.path;
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
    //将列表和当前点击的索引值存入vuex
    clickItem(index) {
      this.status = index;
      this.$emit("clickItem", index);
    },
    //点击播放全部 将列表存入vuex
    sequence() {
      console.log("this.tracksList", this.tracksList);
      this.sequencePlay({
        list: this.tracksList
      });
    },
    ...mapActions(["sequencePlay"])
  },
  watch: {
    tracks(newVal) {
      if (newVal == undefined || newVal == null) {
        return;
      }
      //判断类型
      if (Object.prototype.toString.call(newVal) == "[object Object]") {
        this.tracksList = newVal;
        this.tracksLength = this.total;
      } else if (Object.prototype.toString.call(newVal) == "[object Array]") {
        this.tracksList = newVal;
        if (this.total !== 0) {
          this.tracksLength = this.total;
        } else {
          this.tracksLength = this.tracksList.length;
        }
      } else {
      }
    }
  },
  computed: {
    ...mapGetters(["playing", "currentSong"])
  }
};
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 60px;
  /* overflow-y: scroll; */
  /* border-bottom: 1px solid rgb(228, 228, 228); */
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
  width: 80%;
  text-align: left;
  display: inline-block;
  overflow: hidden; /** 隐藏超出的内容 **/
  word-break: break-all;
  text-overflow: ellipsis; /** 多行 **/
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 1; /** 显示的行数 **/
}

.song-list-wrapper {
  border-radius: 10px;
  /* background: #f2f3f4; */
  background: rgb(253, 251, 251);
  /* margin-bottom: 60px; */
}
.sequence-play {
  position: relative;
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
.header-left {
  display: flex;
  justify-items: center;
  align-items: center;
  width: 60%;
}
.text {
  /* width: 20%; */
  /* font-size: 14px; */
}
.icon {
  font-size: 24px;
  color: slategrey;
  padding-right: 14px;
  margin-left: -2px;
}
.count {
  color: gay;
  font-size: 12px;
  /* width: 20%; */
}
.showHeight {
  height: 41px;
}
.loadStyle {
  width: 100%;
  height: 100%;
  z-index: -1;
}
.svgStyle {
  width: 100%;
  height: 100%;
}
</style>
