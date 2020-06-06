<template>
<div>
  <div class="go_back" name="back" v-show="this.$route.path === '/searchInfo'">
    <span href="javascript:" @click="goto()">
      <i class="iconfont tc-back01" aria-hidden="true"></i>
    </span>
  </div>
  <div class="search-box">
    <i class="iconfont tc-sousuo" @click="searchGoods2" aria-hidden="true"></i>
      <input ref="query" 
             v-model.trim="query" 
             class="searchbox" 
             :placeholder="placeholder" 
             @keypress="searchGoods"
      >
    <i @click="clear" v-show="query" class="iconfont tc-clear" aria-hidden="true"></i> 
  </div>
</div>
</template>

<script>
export default {
  props:{
    placeholder:{
      type:String,
      default:'搜索曲目、专辑'
    },
    historyKeyWords:{
      type:String
    }
  },
  data(){
    return{
      query:'' , //input中内容
      curSearchKeywords:'',
    }
  },
  watch:{
    query(newVal){
      if (newVal === undefined || newVal == null) {
          return;
      }
      this.change()
    }
  },
  methods:{
    goto(){
      this.$router.push({name:'resource'})
    },
    clear(){
      this.query = ''
    },
    searchGoods(event) {
        if (event.keyCode === 13) { //如果按的是enter键 13是enter
            event.preventDefault(); //禁止默认事件（默认是换行）
            this.saveCurSearchKeywords()
            //this.$emit('tabQuery',this.query) //searchInfo上的搜索框存数据
            if (this.$route.path === '/') {
                this.$router.push({name: 'searchInfo'})
            }
        }
    },
    //将搜索内容存入vuex
    saveCurSearchKeywords(){
      //去除用户搜索的空格
      let queryKeywords = this.query.replace(/\ +/g, "")
      this.$store.dispatch("curSearchKeywords",queryKeywords)
    },
    searchGoods2(){
      //this.ClickSearchIcon = true
      //this.$emit('tabQuery',this.query)
      this.saveCurSearchKeywords()
      this.$router.push({name:'searchInfo'})
    },
    // 限制字数不超过15个
    change(){ 
      //.trim()删除字符串开始和末尾的空格
      let arr = this.query.trim().split("")
      let m=0
      let n=0
      // 匹配中文
      let chineseRule = /^[\u4e00-\u9fa5]$/
      // 匹配字符
      let character = /^[\w%&',;=?$\x22]$/
      for(let index=0;index<arr.length;index++){
        // console.log(arr[index].match(chineseRule),arr[index].match(character),m,"+++++++++++++++")
        if(arr[index].match(chineseRule)){
          m+=2
        }else if(arr[index].match(character)){
          n+=1
        }
        if((m+n)>=30){
          this.showToastTxtOnly()
          this.query = this.query.slice(0,(m/2+n))
        }
      }
    }, 
    showToastTxtOnly() {
      this.toast = this.$createToast({
        txt: '字数超过限制',
        type: 'txt',
        time:1000
      })
      this.toast.show()
    } 
  },
  created(){
    //console.log('用户搜索的历史记录',this.historyKeyWords);
    //let queryKeywords = this.query.replace(/\ +/g, "")
    this.query = this.historyKeyWords
  }
}
</script>

<style lang="less" scoped>

.search-box {
  float: left;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 0.1066666667rem;
  height: 1.986667rem;
  background: #ffffff;
  border-radius: 22px;
  .tc-sousuo {
    font-size: 18px !important;
    color: #9C9C9C !important;
    margin: 0 10px !important;
  }
  .searchbox {
    flex: 1;
    margin: 0 5px;
    line-height:  0.48rem;
    background: #ffffff;
    color:#9C9C9C;
    font-size: 15px;
    outline: 0;
    &::placeholder {
      //color: hsla(0,0%,100%,.3);
      color:#9C9C9C;
    }
  }
  .tc-clear {
    font-size: 18px;
    margin-right: 0.4rem;
    color: #9C9C9C;
  }
}
.go_back {
  position: absolute top 5px left 5px;
  width: 15px;
  height: 30px;
  float: left;
  position: absolute;
  left: -3px;
  top: 0px;
  padding: 10px 4px;
  font-size: 25px;
  color: #fff;
}
.tc-back01{
  font-size: 25px;
}
</style>
