<template>
  <div style="z-index:982">
    <div class="config"  ref="configs">
      <div class="header">
        <i class="iconfont tc-back01" @click="back"></i>
        <span class="title">设置中心</span>
      </div>
      <div class="setting">
        <cube-button class="heightConfigCube">
          <span class="spanSty">昵称</span>
          <input v-model="inputValue" placeholder="点击设置昵称" ref="input" class="inputSty" />
          <i class="iconfont tc-cha" @click="clear"></i>
          <span class="inputTip" v-if="valid==true">{{showMsg}}</span>
        </cube-button>
        <cube-button class="heightConfigCube">
          <span>设备ID</span>
          <span class="deviceMessageFont">{{subSpring(this.$route.query.deviceId)}}</span>
        </cube-button>
        <cube-button
          @click="showPicker(deviceRole,$event,findDefaultIndex(deviceRole,deviceMessage.deviceRole))"
          class="heightConfigCube"
        >
          <span>设置内置声音</span>
          <span class="deviceMessage">{{findStatus(deviceRole,deviceMessage.deviceRole)}}</span>
          <i class="iconfont tc-iconfont-left"></i>
        </cube-button>
        <cube-button
          @click="showPicker(ttsRole,$event,findDefaultIndex(ttsRole,deviceMessage.ttsRole))"
          class="heightConfigCube"
        >
          <span>自由对话声音</span>
          <span class="deviceMessage">{{findStatus(ttsRole,deviceMessage.ttsRole)}}</span>
          <i class="iconfont tc-iconfont-left"></i>
        </cube-button>
        <cube-button
          @click="showPicker(deviceVoiceSpeed,$event,findDefaultIndex(deviceVoiceSpeed,deviceMessage.deviceVoiceSpeed))"
          class="heightConfigCube"
        >
          <span>设备发声速度</span>
          <span
            class="deviceMessage"
          >{{findStatus(deviceVoiceSpeed,deviceMessage.deviceVoiceSpeed)}}</span>
          <i class="iconfont tc-iconfont-left"></i>
        </cube-button>

        <cube-button
          @click="showPicker(playMethod,$event,findDefaultIndex(playMethod,deviceMessage.playMethod))"
          class="heightConfigCube"
        >
          <span>播放顺序</span>
          <span class="deviceMessage">{{findStatus(playMethod,deviceMessage.playMethod)}}</span>
          <i class="iconfont tc-iconfont-left"></i>
        </cube-button>
        <cube-button class="heightConfigCube">
          <span>开机自动播放每日推送</span>
          <cube-switch v-model="deviceMessage.turnOnPlay" class="switchMild"></cube-switch>
        </cube-button>
        <cube-button class="heightConfigCube">
          <span>开机自动播放每日等级提醒</span>
          <cube-switch v-model="deviceMessage.turnOnLevel" class="switch"></cube-switch>
        </cube-button>
        <cube-button class="keep" @click="confirm" :disabled="disabled">保存设置</cube-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deviceRole,
  ttsRole,
  deviceVoiceSpeed,
  playMethod
} from "@/common/js/device.js";
import { axiosJWT } from "@/common/js/request.js";
import { mapGetters } from "vuex"
export default {
  name: "Setting",
  data() {
    return {
      remind: "",
      remand: "",
      deviceRole: deviceRole,
      ttsRole: ttsRole,
      deviceVoiceSpeed: deviceVoiceSpeed,
      playMethod: playMethod,
      deviceId: "",
      deviceMessage: null,
      disabled: true,
      deviceMessageCopy: null,
      dialogCont: false,
      inputValue: "",
      isSave: false,
      clientHeight:0,
      activeClass: {
        border: "none"
      },
      showMsg: "字数超过限制",
      // validity: {},
      valid: false
    };
  },
  created() {
    this._getDeviceMessage().then(callbackMessage => {
      this.deviceMessage = callbackMessage;
      this.deviceMessageCopy = JSON.parse(JSON.stringify(this.deviceMessage));
      this.inputValue = this.deviceMessage.nickname;
    });
  },

  methods: {
    clear() {
      this.inputValue = "";
    },
    change() {
      this.valid = false;
      let arr = this.inputValue.split("");
      let m = 0;
      let n = 0;
      let chineseRule = /^[\u4e00-\u9fa5]$/;
      let character = /^[\w%&',;=?$\x22]$/;
      for (let index = 0; index < arr.length; index++) {
        // console.log(arr[index].match(chineseRule),arr[index].match(character),m,"+++++++++++++++")
        if (arr[index].match(chineseRule)) {
          m += 2;
        } else if (arr[index].match(character)) {
          n += 1;
        }
        if (m + n >= 14) {
          this.valid = true;
          console.log("-----------", this.inputValue, this.inputValue);
          this.inputValue = this.inputValue.slice(0, m / 2 + n);
        } else {
          this.valid = false;
          this.deviceMessage.nickname = this.inputValue;
        }
      }
    },
    subSpring(deviceId) {
      if (deviceId == null || deviceId == undefined) {
        return;
      }
      let head = deviceId.substring(0, 2);
      let tail = deviceId.substring(deviceId.length - 4);
      let newId = head + "*****" + tail;
      return newId;
    },
    showToastTxtOnly(msg) {
       console.log("showToastTxtOnly",msg)
      this.toast = this.$createToast({
        txt: msg,
        type: "txt",
        time: 1000,
        zIndex: 985
      });
      this.toast.show();
    },
    confirm() {
      //   this.isPreserve = true
      let msg = this.deviceMessage;
      let deviceId = this.deviceId;
      let _data = {
        deviceId: deviceId,
        nickname: this.inputValue,
        textbookId: msg.textbookId,
        deviceRole: msg.deviceRole,
        ttsRole: msg.ttsRole,
        deviceVoiceSpeed: msg.deviceVoiceSpeed,
        playMethod: msg.playMethod,
        turnOnPlay: msg.turnOnPlay,
        turnOnLevel: msg.turnOnLevel
      };
      let json = JSON.stringify(_data);
      return axiosJWT({
        url: "/device/setting",
        method: "put",
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        data: json
      })
        .then(res => {
          let msg = "";
          if (res.code == 200) {
            msg = "设置成功";
            this.isSave = true;
            this.disabled = true;
            //  this.$router.back()
          } else {
            msg = "设置失败";
          }
          this.showToastTxtOnly(msg);
        })
        .catch(res => {});
    },
    _getDeviceMessage() {
      this.deviceId = this.$route.query.deviceId;
      return axiosJWT({
        url: "/device/setting",
        method: "get"
      }).then(res => {
        // this.deviceMessage = res.data;
        if (res.code === 200) {
          return res.data;
        }
        return null;
        // 保留deviceMessage的初始值，便于判断deviceMessage是否改变
        // this.deviceMessageCopy = JSON.parse(JSON.stringify(this.deviceMessage));
      });
    },
    findDefaultIndex(initVariable, newVariableValue) {
      for (let i = 0; i < initVariable.length; i++) {
        if (
          initVariable[i].value == newVariableValue ||
          initVariable[i].text == newVariableValue
        ) {
          return i;
        }
      }
      return -1;
    },
    findStatus(initVariable, newVariableValue) {
      for (let i = 0; i < initVariable.length; i++) {
        if (
          initVariable[i].value == newVariableValue ||
          initVariable[i].text == newVariableValue
        ) {
          return initVariable[i].text;
        }
      }
      return null;
    },
    back() {
      console.log("this.isSave", this.isSave == false, this.disabled);
      if (!(this.isSave || this.disabled)) {
        this.showBtn();
      } else {
        this.$router.back();
      }
    },
    showBtn() {
      this.$createDialog({
        type: "confirm",
        title: "还未保存设置，确认退出吗",
        zIndex: 985,
        confirmBtn: {
          text: "确定",
          active: true,
          disabled: false,
          href: "javascript:;"
        },
        cancelBtn: {
          text: "取消",
          active: false,
          disabled: false,
          href: "javascript:;"
        },
        onConfirm: () => {
          this.$router.back();
        },
        onCancel: () => {}
      }).show();
    },
    showPicker(msg, e, index) {
      this.picker = this.$createPicker({
        title: e.currentTarget.firstElementChild.innerHTML,
        data: [msg],
        selectedIndex: [index],
        onSelect: this.selectHandle,
        onCancel: this.cancelHandle,
        zIndex: 985
      });
      this.picker.show();
    },
    selectHandle(selectedVal, selectedIndex, selectedText) {
      let title = this.picker.title;
      if (title == "设置内置声音") {
        this.deviceMessage.deviceRole = this.deviceRole[selectedIndex].value;
        this.findStatus(this.deviceRole, selectedText);
      } else if (title == "自由对话声音") {
        this.deviceMessage.ttsRole = this.ttsRole[selectedIndex].value;
        this.findStatus(this.ttsRole, selectedText);
      } else if (title == "设备发声速度") {
        this.deviceMessage.deviceVoiceSpeed = this.deviceVoiceSpeed[
          selectedIndex
        ].value;
        this.findStatus(this.deviceVoiceSpeed, selectedText);
      } else {
        this.deviceMessage.playMethod = this.playMethod[selectedIndex].value;
        this.findStatus(this.playMethod, selectedText);
      }
    },
        // 获取屏幕高
    getScreenHeight() {
      this.clientHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    },
     changeFixed(clientHeight){ 
      this.$refs.configs.style.height = clientHeight + 'px';
     
    },
  },
  beforeUpdate() {
     this.getScreenHeight();
     console.log("this.getScreenHeight()",this.clientHeight)
    let _this = this;
    window.onresize = () => {
      _this.getScreenHeight();
    };
  },
  computed: {
    doConfig: function() {
      // 将this.deviceMessage转化为javascript对象
      return JSON.parse(JSON.stringify(this.deviceMessage));
    }
  },

  watch: {
    inputValue(newV) {
      if (newV == undefined || newV == null) {
        return;
      }
      this.change();
    },
    deviceMessage(newVal) {
      if (newVal == null) {
        return;
      }
      this.deviceMessage = newVal;
    },
    doConfig: {
      // 深度观察对象及其属性
      deep: true,
      handler: function(newVal, oldVal) {
        if (!oldVal) {
          // this.dialogCont = true
          return;
        }
        if (newVal === oldVal) {
          return;
        }
        // 将对象转化为字符串
        const obj = JSON.stringify(this.deviceMessageCopy);
        const newValobj = JSON.stringify(newVal);
        // 如果两个相等， 说明用户没有更改信息，将保存按钮设为禁用状态
        if (obj == newValobj) {
          this.disabled = true;
          this.isSave = true;
          return;
        }
        this.disabled = false;
      }
    },
    clientHeight:function(){
      this.changeFixed(this.clientHeight)
    }
  },
  destroyed() {
    window.onresize = null;
  },
};
</script>

<style lang="less" scoped>
.backgroundColor {
  width: 100%;
  height: 100%;
  background-color: darkgrey;
  z-index: -50;
}
.config {
  width: 100%;
  position: absolute;
  background: white;
  .header {
    margin: 10px;
    .tc-back01 {
      width: 24px;
      height: 24px;
      font-size: 24px;
      color: #f90;
    }
    .title {
      width: 80%;
      display: inline-block;
      // text-align: center;
      padding-left: 5%;
      color: #f90;
      font-size: 18px;
    }
  }
  .userInfo {
    .message {
      width: 100%;
      height: 130px;
      .imgBox {
        display: flex;
        justify-items: center;
        height: 100px;
        margin: 10px auto;
        border-radius: 50%;
      }
      .name {
        text-align: center;
      }
    }
  }
  .setting {
    .heightConfigCube {
      position: relative;
      display: flex;
      justify-items: center;
      /* justify-content: center; */
      align-items: center;
      background: white;
      color: gray;
      font-size: 16px;
      border-bottom: 1px solid rgba(212, 204, 204, 0.5);
      span {
        display: flex;
        justify-items: center;
        flex: 1;
        // margin: 5% 0;
      }

      .inputSty {
        width: 35%;
        height: 20px;
        border: none;
        outline: none;
        color: gray;
        font-size: 14px;
        // border-bottom: 1.3px solid gainsboro;
      }

      .inputTip {
        color: red;
        font-size: 14px;
      }
      .spanSty {
        flex: 0 0 50px;
      }
      .tc-cha {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      // .inputSty /deep/.ivu-input:focus {
      //   outline: none;
      //   border: none !important;
      //   border-bottom: 1.3px solid gainsboro;
      // }
      // .activeClass{
      //   border:none;
      // }
      .switch {
        width: 20%;
        // flex: 0 0 50px;
        // padding: 0 5% 0 25%;
        // margin-right: 5%
      }
      .switchMild {
        width: 20%;
        // padding: 0 5% 0 35%;
        // margin-right: 5%
      }
      .deviceMessage {
        // width: 100%;
        float: right;
        color: gray;
        margin-left: 50%;
        margin-right: 2%;
      }
      .deviceMessageFont,
      .tc-iconfont-left {
        color: gray;
      }
      // .inputSty {

      //   span {
      //     display: flex;
      //     justify-items: center;
      //   }
      // }
      .deviceMessageFont {
        margin-left: 50%;
      }
    }
    .keep {
      // background-color: rgb(243, 165, 47);
      width: 80%;
      margin: 20px auto;
      color: white;
      border-radius: 5px;
    }
  }
}
</style>
<style scoped>
.inputSty >>> .ivu-input {
  width: 38%;
  height: 20px;
  border: none;
  outline: none;
  /* border-bottom: 1.3px solid gainsboro; */
}
.inputSty >>> .ivu-input:focus {
  outline: none;
  border: none !important;
  /* border-bottom: 1.3px solid gainsboro; */
}
</style>