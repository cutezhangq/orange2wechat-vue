<template>
  <div>
    <div class="bgImg">
      <img :src="this.defailtPageImg" class="defailtImg_500"/>
      <span class="defailtTitle">{{this.defailtTitle}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      defailtPageImg:require('@/common/image/defaultPage_500.png'),
      defailtTitle:'哎呀，页面出错了，正在全力抢修中...'
    }
  }
}
</script>

<style lang='less'scoped>
@import url('~@/assets/css/common.less');
.bgImg{
  height: 95%;
}
.defailtImg_500{
  margin: 30% auto;
  width: 55%;
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
  margin-top: -20%;
}
</style>
