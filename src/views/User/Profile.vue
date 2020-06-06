<template>
  <!--我的-->
  <div style="z-index:981">
    <section class="profile" ref="profile">
      <section class="profile-title">
        <div class="backgroundColor">
          <div class="filter"></div>
          <div v-if="deviceMessage!=null&&deviceMessage.headImgUrl!=null" class="imgBox">
            <img :src="deviceMessage.headImgUrl" width="100%" height="100%" /> 
          </div>
        </div>
        <div class="user">
          <div class="header">
            <i class="iconfont tc-back01" @click="back"></i>
            <h1 class="title">个人中心</h1>
          </div>
          <div class="message">
            <div v-if="deviceMessage!=null&&deviceMessage.headImgUrl!=null" class="imgBox">
              <img :src="deviceMessage.headImgUrl" width="100%" height="100%" style="border-radius:50%"/>
            </div>
            <i v-else class="iconfont tc-touxiang"></i>
            <!-- <img class="imgBox" v-else src="https://i.loli.net/2019/12/07/inzh6WbK3uUtde7.jpg" width="100%" height="100%" /> -->
            <div class="userInfo">
              <h1 class="name">{{limitNickname(deviceMessage.nickname)}}</h1>
              <!-- <h1 class="name">{{limitNickname("安居房咖啡机奥卡福")}}</h1> -->
              <span class="gender">
                <!-- <i class="iconfont tc-nanxing"></i> -->
                <i class="iconfont tc-nanxing" v-if="deviceMessage.sex==1"></i>
                <i class="iconfont tc-nv" v-else-if="deviceMessage.sex==0"></i>
              </span>
            </div>
          </div>
        </div>
      </section>
      <div class="messageIndex">
        <section class="profile_info_data border-1px">
          <ul class="info_data_list">
            <a href="javascript:" class="info_data_link">
              <span class="info_data_top">
                <span>{{deviceMessage.bindCount}}</span>个
              </span>
              <span class="info_data_bottom">绑定设备数</span>
            </a>
            <a href="javascript:" class="info_data_link">
              <span class="info_data_top">
                <span>{{deviceMessage.consecutiveDays}}</span>天
              </span>
              <span class="info_data_bottom">连续登录</span>
            </a>
            <a href="javascript:" class="info_data_link">
              <span class="info_data_top">
                <span>{{deviceMessage.points}}</span>分
              </span>
              <span class="info_data_bottom">积分</span>
            </a>
          </ul>
        </section>
        <div class="current-device">
          <div class="current-title">
            <i class="iconfont tc-chenghui"></i>
            <span>当前设备</span>
          </div>
          <div class="device-message">
            <div class="detail">
              <cube-form :model="model" :immediate-validate="false">
                <cube-form-group>
                  <div v-if="currentDevice!=null">
                    <cube-form-item :field="fields[0]" class="adjust">
                      <cube-button class="trim">{{currentDevice.nickname||model.nicknameValue}}</cube-button>
                    </cube-form-item>
                    <cube-form-item :field="fields[1]" class="adjust">
                      <cube-button class="trim">{{subSpring(currentDevice.id)||model.idValue}}</cube-button>
                    </cube-form-item>
                    <cube-form-item :field="fields[2]" class="adjust">
                      <cube-button class="trim">{{currentDevice.honorName||model.honorNameValue}}</cube-button>
                    </cube-form-item>
                    <cube-form-item :field="fields[3]" class="adjust">
                      <cube-button
                        class="trim"
                      >{{currentDevice.bindTextbook||model.bindTextbookValue}}</cube-button>
                    </cube-form-item>
                  </div>
                  <div v-else>
                    <cube-form-item :field="fields[0]" class="adjust">
                      <cube-button class="trim">{{model.nicknameValue}}</cube-button>
                    </cube-form-item>
                    <cube-form-item :field="fields[1]" class="adjust">
                      <cube-button class="trim">{{model.idValue}}</cube-button>
                    </cube-form-item>
                    <cube-form-item :field="fields[2]" class="adjust">
                      <cube-button class="trim">{{model.honorNameValue}}</cube-button>
                    </cube-form-item>
                    <cube-form-item :field="fields[3]" class="adjust">
                      <cube-button class="trim">{{model.bindTextbookValue}}</cube-button>
                    </cube-form-item>
                  </div>
                </cube-form-group>
              </cube-form>
            </div>
            <div class="imgBox">
              <img src="@/common/image/2.png" width="60" height="80" />
            </div>
            <i class="iconfont tc-shezhi" @click="getDeviceMessage(currentDevice)"></i>
          </div>
        </div>
        <div class="other-device">
          <div class="current-title">
            <i class="iconfont tc-chenghui"></i>
            <span>其他设备</span>
          </div>
          <deviceList
            :otherDevice="otherDeviceList"
            :deviceList="deviceLists"
            @setCurrentDevice="updateCurrentDevice"
          ></deviceList>
        </div>
      </div>
    </section>
    <!-- <div v-else class="loadFail">
      <div class="header">
        <i class="iconfont tc-back01" @click="back"></i>
        <h1 class="title">个人中心</h1>
      </div>
      <img src="@/common/image/defaultPage_imgs.png" width="60%" height="60%" class="failImg" />
      <div class="tips">糟糕，加载失败了</div>
    </div>-->
  </div>
</template>

<script>
import { axiosJWT } from "@/common/js/request";
import { findDeviceIdIndex, setOtherDevice } from "@/common/js/device.js";
import deviceList from "@/views/User/DeviceList";
import { mapGetters, mapActions } from "vuex";
import global from "@/api/global";
export default {
  name: "Profile",
  data() {
    return {
      refreshDelay: 100,
      // //写死当前设备Id
      // deviceId: "gh_8f487a612fc9_0750dca219884e23",
      currentDevice: "",
      otherDeviceList: [],
      deviceMessage: null,
      deviceLists: [],
      clientHeight: 0,
      model: {
        nicknameValue: "未设置",
        honorNameValue: "",
        idValue: "",
        bindTextbookValue: "未绑定"
      },
      fields: [
        {
          label: "昵称",
          modelValue: "nicknameValue"
        },
        {
          label: "设备ID",
          modelValue: "idValue"
        },
        {
          label: "荣誉称号",
          modelValue: "honorNameValue"
        },
        {
          label: "绑定教材",
          modelValue: "bindTextbookValue"
        }
      ]
    };
  },
  created() {
    this._getUsfoAndDevice().then(callbackMessage => {
      console.log("callbackMessage", callbackMessage);
      if (callbackMessage == null || callbackMessage == undefined) {
        return;
      }
      // console.log("")
      // 用户信息
      this.deviceMessage = callbackMessage;
      // 获取设备信息
      let deviceList = callbackMessage.deviceIdList;
      // 将设备信息存入vuex
      this.setDeviceList({
        deviceList: deviceList
      });
      // 当前设备的索引
      let currentDeviceIndex = findDeviceIdIndex(deviceList, deviceList[0].id);
      this.currentDevice = deviceList[currentDeviceIndex];
      this.otherDeviceList = setOtherDevice(deviceList, currentDeviceIndex);
      this.deviceLists = deviceList;
    });
  },
  beforeUpdate() {
    this.getScreenHeight();
    console.log("this.getScreenHeight()", this.clientHeight);
    let _this = this;
    window.onresize = () => {
      _this.getScreenHeight();
    };
  },
  computed: {},
  methods: {
    limitNickname(name) {
      if (this.deviceMessage == null || name === null) {
        return "昵称";
      }
      let mode = /^[\u4E00-\u9FA5A-Za-z0-9_%&',;=?$\x22]{1,7}$/;
      name.match(mode);
      if (name.match(mode) == null) {
        return name.substring(0, 7) + "...";
      } else {
        return name;
      }
    },
    subSpring(deviceId) {
      if (deviceId == undefined) {
        return;
      }
      let head = deviceId.substring(0, 2);
      let tail = deviceId.substring(deviceId.length - 4);
      let newId = head + "*****" + tail;
      return newId;
    },
    back() {
      this.$router.back();
    },
    getDeviceMessage(deviceDetail) {
      this.$router.push({
        path: "/setting",
        query: {
          deviceId: deviceDetail.id
        }
      });
    },
    _getUsfoAndDevice() {
      return axiosJWT({
        url: "/user/info",
        method: "get"
      })
        .then(response => {
          if (response.code == 200) {
            return response.data;
          }
          return;
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    updateCurrentDevice(currentDevice) {
      this.currentDevice = currentDevice;
    },
    getScreenHeight() {
      this.clientHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    },
    changeFixed(clientHeight) {
      this.$refs.profile.style.height = clientHeight + "px";
    },
    ...mapActions(["setDeviceList"])
  },
  watch: {
    currentDevice(newVal) {
      if (newVal == null || newVal == undefined) {
        return;
      }
      this.currentDevice = newVal;
    },
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    }
  },
  components: {
    deviceList
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/less/variable";
.profile {
  width: 100%;
  background: white;
  position: absolute;
  .profile-title {
    width: 100%;
    height: 200px;
    left: 0;
    top: 0;
    .backgroundColor {
      width: 100%;
      height: 195px;
      position: absolute;
      left: 0;
      top: 0;
      // z-index: -150;
      filter: blur(5px);
      .filter {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        /* width: 300%; */
        height: 100%;
        background: gray;
        opacity: 0.6;
      }
      .imgBox{
        width: 100%;
        height: 100%;
      }
    }
    .user {
      width: 100%;
      /* height: 30%; */
      height: 200px;
      /* z-index: 150; */
      position: absolute;
      left: 0;
      top: 0;
      .header {
        display: flex;
        justify-items: center;
        align-items: center;
        width: 100%;
        height: 50px;
        /* line-height: 50px; */
        font-size: 20px;
        // color: white;

        .tc-back01 {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 40px;
          flex: 0 0 40px;
          font-size: 24px;
          color: white;
        }
        .title {
          width: 75%;
          font-weight: bold;
          color: white;
          font-size: 20px;
          // text-align: center;
        }
      }
      .message {
        display: flex;
        /* padding: 0 0; */
        padding-bottom: 3%;
        .imgBox {
          justify-items: center;
          margin: 10px 5%;
          border-radius: 50%;
          width: 21.7%;
          height: 60%;
        }
        .tc-touxiang {
          font-size: 60px;
          /* color: gray; */
          margin: 5%;
          border-radius: 50%;
          /* border: 1px solid gray; */
          color: white;
        }
        .userInfo {
          // display: flex;
          width: 70%;
          height: 100%;
          margin: auto 0;
          .name {
            display: inline-block;
            padding-left: 5%;
            font-size: 18px;
            color: white;
          }
          .gender {
            display: inline-block;
            width: 20%;
            font-weight: 900;
            margin-left: 20px;
            line-height: 30px;
            .tc-nanxing {
              color: blue;
            }
            .tc-nv {
              color: red;
            }
          }
        }
      }
    }
  }
  .other-device {
    width: 90%;
    margin: 5%;
    box-shadow: 2px 2px 5px 2px lightgrey;
    .current-title {
      height: 50px;
      line-height: 50px;
      .tc-chenghui {
        color: #f90;
        width: 50px;
        font-size: 24px;
        height: 50px;
      }
    }
  }
  .messageIndex {
    position: absolute;
    width: 100%;
    .profile_info_data {
      border-bottom: 1px #e4e4e4;
      width: 90%;
      margin: -12% 5% 5% 5%;
      box-shadow: 2px 2px 5px 2px lightgrey;
      background: #fff;
      overflow: hidden;

      .info_data_list {
        .clearFix {
          zoom: 1;
          &:after {
            content: "";
            display: block;
            clear: both;
          }
        }
        .info_data_link {
          float: left;
          width: 33%;
          text-align: center;
          border-right: 1px solid #f1f1f1;
          .info_data_top {
            display: block;
            width: 100%;
            font-size: 14px;
            color: #333;
            padding: 15px 5px 10px;
            span {
              display: inline-block;
              font-size: 30px;
              color: #f90;
              font-weight: 700;
              line-height: 30px;
            }
          }
          .info_data_bottom {
            display: inline-block;
            font-size: 14px;
            color: #666;
            font-weight: 400;
            padding-bottom: 10px;
          }
        }
        .info_data_link:nth-of-type(2) {
          .info_data_top {
            span {
              color: #ff5f3e;
            }
          }
        }
        .info_data_link:nth-of-type(3) {
          border: 0;
          .info_data_top {
            span {
              color: #6ac20b;
            }
          }
        }
      }
    }
    .current-device {
      width: 90%;
      margin: 5%;
      box-shadow: 2px 2px 5px 2px lightgrey;
      .current-title {
        height: 50px;
        line-height: 50px;
        .tc-chenghui {
          color: #f90;
          width: 50px;
          font-size: 24px;
          height: 50px;
        }
      }
      .device-message {
        position: relative;
        height: 55%;
        margin: 0 2%;
        display: flex;
        border-radius: 5px;
        .imgBox {
          width: 30%;
          height: 90%;
          margin: auto 0;
          position: absolute;
          right: 5px;
        }
        .detail {
          margin-bottom: 5px;
          .border-bottom-1px::after {
            border-bottom: 0;
          }

          .adjust {
            min-height: 30px;
            color: rgb(37, 36, 36);
            border: none;
            outline: none;
                padding: 0 1px 0 15px;
            .trim {
              width: 20%;
              padding: 0;
              margin-left: -40px;
              background: white;
              color: gray;
              font-size: 14px;
            }
          }
        }
        .tc-shezhi {
          font-size: 24px;
          color: #f90;
          /* margin: -12% 0 0 0; */
          position: absolute;
          right: 5%;
          top: -28%;
        }
      }
    }
    .profile_my_order {
      border-top: 1px (#e4e4e4);
      margin-top: 10px;
      background: #fff;
      .my_order {
        display: flex;
        align-items: center;
        padding-left: 15px;
        > span {
          display: flex;
          align-items: center;
          width: 20px;
          height: 20px;
          > .iconfont {
            margin-left: -10px;
            font-size: 30px;
          }
          .icon-order-s {
            color: #02a774;
          }
          .icon-jifen {
            color: #ff5f3e;
          }
          .icon-vip {
            color: #f90;
          }
          .icon-fuwu {
            color: #02a774;
          }
        }
        .my_order_div {
          width: 100%;
          border-bottom: 1px solid #f1f1f1;
          padding: 18px 10px 18px 0;
          font-size: 16px;
          color: #333;
          display: flex;
          justify-content: space-between;
          span {
            display: block;
          }
          .my_order_icon {
            width: 10px;
            height: 10px;
            .icon-jiantou1 {
              color: #bbb;
              font-size: 10px;
            }
          }
        }
      }
    }
  }
}
.loadFail {
  .header {
    display: flex;
    width: 100%;
    height: 50px;
    line-height: 50px;
    // font-size: 20px;
    .tc-back01 {
      width: 50px;
      height: 50px;
      text-align: center;
      flex: 0 0 50px;
      font-size: 20px;
      color: white;
    }
    .title {
      width: 75%;
      text-align: center;
      color: white;
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
</style>
<style scoped>
.adjust >>> .border-bottom-1px {
  border: none;
  outline: none;
}
</style>
