<template>
  <div class="song-list-wrapper">
    <div class="song-list">
      <li v-for="(ContentList, index) in ContentLists" :key="ContentList.title" class="item" @click="clickItem(index)">
        <i class="iconfont tc-folder-line icon"/>
        <p class="song-count">{{index + 1}}</p>
        <div class="content">
          <h2 class="name">{{ContentList.title}}</h2>
        </div>
      </li>
    </div>
  </div>
</template>
<script>
import { mapActions} from "vuex";
export default {
  props: {
    ContentLists: {
      type: Array
    },
  },
  data() {
    return {
      selectIndex_unite:Number  //选择单元条目的索引
    };
  },
  methods: {
    clickItem (index) {
      this.selectIndex_unite = index
      //console.log('选择的下标为：'+this.selectIndex_unite)
      this.$emit('selectIndex',this.selectIndex_unite)
    },
  },
};
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 50px;
  overflow-y: scroll;
  border-bottom: 1px solid rgb(228, 228, 228);
}
.content {
  flex: 1;
  line-height: 20px;
  overflow: hidden;
}
.content i {
  display: inline-block;
  margin-left: 20px;
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
}

.song-list-wrapper {
  border-radius: 10px;
  /* background: #f2f3f4; */
  /* margin-bottom: 100%; */
}
.text {
  font-size: 16px;
}
.icon {
  font-size: 24px;
  color: #7b7c7e;
  /* //padding-right: 14px; */
  margin-left: -2px;
}
.count {
  font-size: 14px;
  color: gay;
}
.showHeight{
  height: 41px;
}
</style>
