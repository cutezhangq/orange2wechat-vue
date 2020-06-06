<template>
  <div>
    <div class="header_title">
      <span class="guide_item">
        <div class="header-icon">
          <!-- <transition name="slide"> -->
            <!-- <router-link to="/Profile" tag="div">
              <i class="iconTab iconfont tc-caidan2"></i>
            </router-link> -->
             <div @click="skipPersonPage">
               <i class="iconTab iconfont tc-caidan2"></i>
             </div>
          <!-- </transition> -->
        </div>
        <div class="header-cont">
          <span class="title_item">资源库</span>
        </div>
        <div class="header-icon" @click="skipFavoritePage">
          <i class="iconTab iconfont tc-shoucang2"></i>
        </div>
      </span>
    </div>
    <!-- <div class="header_guide">
     <span class="guide_item" 
        v-for="(tab,index) in tabs" :key="index"
        :class="{active:index === activeGuideIndex}"
        @click="clickIndex(index)">
       <span>{{tab.label}}</span>
     </span>
    </div>-->
  </div>
</template>

<script>
import VueRouter from "vue-router";
import { axiosJWT } from "../../common/js/request";
import {mapActions} from 'vuex'
import {findDeviceIdIndex,setOtherDevice} from '@/common/js/device.js'
export default {
  data() {
    return {
      tabs: [
        {
          label: "首页"
        },
        {
          label: "分类"
        },
        {
          label: "教材"
        },
        {
          label: "搜索"
        }
      ],
      deviceId: 'gh_8f487a612fc9_0750dca219884e23'
      //activeGuideIndex:this.activeGuideIndex
    };
  },
  props: {
    activeGuideIndex: 0
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化，保证刷新页面后内容区和导航键一致
      this.initPage();
    });
    // 接收swiper组件发射的index进行导航按钮切换高亮和更新模板地址
    this.$root.eventHub.$on("slideTab", this.slideTab);
  },
  methods: {
    //跳转到个人中心页面
    skipPersonPage(){
    //  this._getDeviceListDetail()
      this.$router.push("/profile")
    },
    _getDeviceListDetail(){
      return axiosJWT({
        url: "/user/info",
        method: "get"
      })
        .then(response => {
          let deviceList = response.data.deviceIdList;
          this.setDeviceList({
            deviceList: deviceList
          })
          let currentDeviceIndex =findDeviceIdIndex(deviceList, this.deviceId);
          let currentDevice = deviceList[currentDeviceIndex];
          let otherDeviceList = setOtherDevice(deviceList, currentDeviceIndex);
          this.setOtherDeviceList({
            otherDeviceList: otherDeviceList
          })
          this.setCurrentDevice({
            currentDevice: currentDevice
          })
        })
        .catch(response => {});
    },
    //跳转到收藏页面
    skipFavoritePage() {
      this.$router.push("/favoriteIndex");
    },
    goTo(path) {
      this.$router.replace(path);
    },
    //将点击的导航的index传入父组件中
    clickIndex(index) {
      this.$emit("changeTitle", index);
      this.activeGuideIndex = index;
      console.log("点击" + this.activeGuideIndex);

      //this.$refs.tabIndex_+index.style.class = active
    },
    initPage() {
      this.nowIndex =
        this.$route.path === "/home"
          ? 0
          : this.$route.path === "/classify"
          ? 1
          : this.$route.path === "/teachingBooks"
          ? 2
          : this.$route.path === "/search"
          ? 3
          : 0;
    },
    tabClick(index) {
      this.nowIndex = index;
    },
    slideTab(index) {
      this.nowIndex = index;
      let router = new VueRouter();
      let href =
        index === 0
          ? "/home"
          : index === 1
          ? "/classify"
          : index === 2
          ? "/teachingBooks"
          : index === 3
          ? "/search"
          : "/home";
      // 利用路由的push方法更新路径地址
      router.push(href);
    },
    ...mapActions(['setDeviceList','setOtherDeviceList','setCurrentDevice'])
  }
};
</script>

<style lang='less' scoped>
@import url("~@/assets/css/common.less");

.iconTab {
  font-size: 1.44rem !important;
  color: #fff;
}

.header_title {
  position: relative;
  display: flex;
  padding-bottom: 18px;
  &::before {
    content: "";
    position: absolute;
    z-index: 200;
    left: 0;
    top: 0;
    width: 100%;
    height: 0px;
    background-color: #e4e4e4;
  }
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  background: @iframecolor; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    @gradualcolor,
    @iframecolor
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, @gradualcolor, @iframecolor);
  width: 100%;
  //height: 37px;
  height: 35px;
  display: flex;
  .guide_item {
    display: flex;
    flex: 1;
    text-align: center;
    align-items: center;
    margin: 5px;
    color: #f5bf75;
    // &.active{
    //     //animation:colorChange .2s infinite;
    //     font-weight: 700;
    //     //font-size: 18px;
    //     color: rgb(255,255,255);
    //     span{
    //       border-bottom: 2px solid #f1f1f1;
    //     }
    //   }
    // @keyframes colorChange
    // {
    //   0% {color: #F5BF75;}
    //   50% {color: rgb(233, 202, 160);}
    //   100% {color: #fff;}
    // }
    span {
      font-size: 17px;
      margin-top: 2px;
      margin-bottom: 2px;
    }
    .title_item {
      font-size: 18px;
      letter-spacing: 9px;
      color: rgb(255, 255, 255);
    }
  }
}
div {
  display: block;
}
.header-cont {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  text-align: center;
  //font-size: 18px;
  color: #fff;
  //font-weight: 500;
  //overflow: hidden;
  text-overflow: ellipsis;
  //white-space: nowrap;
  //margin-top: 1.08rem;
}
.header-icon {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 1.17333rem;
  flex: 0 0 1.17333rem;
  margin-top: 0.08rem;
  cursor: pointer;
}
.iconfont {
  color: #fff;
}
</style>
