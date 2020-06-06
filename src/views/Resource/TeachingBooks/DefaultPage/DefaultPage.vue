<template>
  <div>
    <div class="bgImg">
      <img :src="this.defailtPageImg" class="defailtImg"/>
      <span class="defailtTitle">{{this.defailtTitle}}</span>
    </div>
    <div class="butContent">
      <button class="button" type='button' @click="goTo('/tecBooksLead')">{{this.buttonTitle}}</button>
    </div>
  </div>
</template>

<script>

export default {
  data(){
    return{
      defailtPageImg:require('@/common/image/defaultPage_tbooks.png'),
      defailtTitle:'哎呀，您还没有设置教材哦~',
      buttonTitle:'设置教材'
    }
  },
  methods:{
     goTo (path) {
        this.$router.push(path)
      },
  }
}
</script>

<style lang='less'scoped>
@import url('~@/assets/css/common.less');
.bgImg{
  height: 95%;
}
.butContent{
  height: 5%;
  display: flex;
  bottom: 0;
}
.defailtImg{
  margin: 10% auto;
  width: 36%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.defailtTitle{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
  color: #ABACAD;
}

.button {
  margin: 40px auto;
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
</style>
