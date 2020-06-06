<template>
  <cube-scroll ref="scroll" :data="otherDevice" :refreshDelay="refreshDelay">
    <div class="device-list-all">
      <div v-for="(deviceDetail,index) in otherDeviceList" :key="index" class="device-list">
        <i class="iconfont deviceImg tc-jiqiren2"></i>
        <div class="device-title">
          <div class="device-nickname">{{deviceDetail.nickname==null?'未设置':deviceDetail.nickname}}</div>
          <div class="device-id">{{subSpring(deviceDetail.id)}}</div>
        </div>
        <div class="iconImg">
          <i class="iconfont tc-qiehuan" @click="changeDevice(deviceDetail)"></i>
          <!-- <i class="iconfont tc-shezhi" @click="getDeviceMessage(deviceDetail)"></i> -->
        </div>
      </div>
    </div>
  </cube-scroll>
</template>
<script>
import { axiosJWT } from "../../common/js/request";
import {
  findDeviceIdIndex,
  setOtherDevice,
  subSpring
} from "@/common/js/device";
// import { mapGetters } from "vuex";
export default {
  props: {
    otherDevice: {
      type: Array
    },
    deviceList: {
      type: Array
    }
  },
  data() {
    return {
      refreshDelay: 100,
      //写死当前设备Id
      deviceId: "gh_8f487a612fc9_0750dca219884e23",
      otherDeviceList: this.otherDevice,
      deviceIdHide: ""
    };
  },
  created() {},
  mounted() {
    this.deviceIdHide = this.subSpring(this.deviceId);
  },
  methods: {
    subSpring(deviceId) {
      let head = deviceId.substring(0, 2);
      let tail = deviceId.substring(deviceId.length - 4);
      let newId = head + "*****" + tail;
      return newId;
    },
    getDeviceMessage(deviceDetail) {
      console.log("deviceDetail");
      console.log(deviceDetail);
      this.$router.push({
        path: "/setting",
        query: {
          deviceId: deviceDetail.id,
          nickname: deviceDetail.nickname
        }
      });
    },
    showToastTime() {
      const toast = this.$createToast({
        time: 200,
        txt: ""
      });
      toast.show();
    },
    _getOtherDeviceMessage(deviceList, deviceId) {
      let currentIndex = findDeviceIdIndex(deviceList, deviceId);
      this.otherDeviceList = setOtherDevice(deviceList, currentIndex);
    },
    changeDevice(deviceDetail) {
      this.showToastTime();
      this._getOtherDeviceMessage(this.deviceList, deviceDetail.id);
      this.$emit("setCurrentDevice", deviceDetail);
      this._putDevice(deviceDetail);
    },
    _putDevice(deviceDetail) {
      return axiosJWT({
        url: "/device/switch",
        method: "post",
        params: {
          newDeviceId: deviceDetail.id
        }
      })
        .then(res => {})
        .catch(error => {});
    },
    scrollTo() {
      this.$refs.scroll.scrollTo(
        0,
        this.scrollToY,
        this.scrollToTime,
        ease[this.scrollToEasing]
      );
    }
  },
  watch: {
    otherDevice: function(newVal, oldVal) {
      this.otherDeviceList = newVal;
    }
  },
  computed: {
    // ...mapGetters(["deviceList"])
  }
};
</script>

<style lang="less" scoped>
.device-list-all {
  width: 100%;
  .device-list {
    position: relative;
    height: 50px;
    display: flex;
    justify-items: center;
    align-items: center;
    //  border-bottom: 1px solid rgb(199, 191, 191,0.5);
    .deviceImg {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 30px;
      color: #f90;
      margin: 5% 1% 5% 5%;
    }
    .device-title {
    width: 70%;
    color: #666;
    /* margin-left: 15%; */
    text-align: center;

      .device-nickname {
        height: 50%;
        text-align: center;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .device-id {
        height: 40%;
        text-align: center;
        font-size: 14px;
      }
    }
    .iconImg{
      .tc-qiehuan{
        position: absolute;
    top: 5%;
    right: 5%;
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    color: #f90;
      }
    }
  }
}
</style>