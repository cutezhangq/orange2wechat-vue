import * as types from './mutation-types'
const mutations = {
  [types.SET_MUSIC_LIST] (state, musicList) {
    state.musicList = musicList
  },
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST] (state, topList) {
    state.topList = topList
  },
  // [types.SET_SEARCH_HISTORY] (state, history) {
  //   state.searchHistory = history
  // },
  [types.SET_PLAY_HISTORY] (state, history) {
    state.playHistory = history
  },
  [types.SET_FAVORITE_LIST] (state, list) {
    state.favoriteList = state.favoriteList.concat(list)
  },
  [types.SET_INIT_PLAYER] (state,initPlayer){
    state.initPlayer = initPlayer
  },
  [types.SET_DEVICE_LIST] (state,deviceList){
    state.deviceList = deviceList
  },
  [types.SET_CURSEARCH_KEYWORDS](state,curSearchKeywords){
    state.curSearchKeywords = curSearchKeywords
  },
  [types.SET_CURSELECT_CATEGORYID](state,curCategoryId){
    state.curCategoryId = curCategoryId
  },
  [types.SET_CURSELECT_CATEGORYTITLE](state,curCategoryTitle){
    state.curCategoryTitle = curCategoryTitle
  },
  [types.SET_USER_CLIENTHEIGHT](state,userClientHeight){
    state.userClientHeight = userClientHeight
  },
  [types.SET_CURRENT_TECBOOKSLABEL](state,curTecBooksLabel){
    state.curTecBooksLabel = curTecBooksLabel
  },
  [types.SET_CURRENT_SEARCHINFOLABEL](state,curSearchInfoLabel){
    state.curSearchInfoLabel = curSearchInfoLabel
  },
  [types.SET_CURRENT_RESOURCELABEL](state,curResourceLabel){
    state.curResourceLabel = curResourceLabel
  },
  [types.SET_PLAY_DETAIL](state,playDetail){
    state.playDetail = playDetail
  },
  //// 存储所有表单数据（歌曲、课文、单词）
  [types.SET_ACTION_WEBSOCKET] (state, actionWebSocket) {
    state.actionWebSocket = actionWebSocket
    state.actionWebSocket.onopen = function(){
      console.log("连接成功")
      //state.actionWebSocket.send("hello123")
    }
    state.actionWebSocket.onmessage = function(callback){
      console.log("接收信息")
      console.log(callback.data)
    }
    state.actionWebSocket.onerror = function(e){
      console.log("actionWebSocket错误")
      console.log(e)
    }
    // state.actionWebSocket.onclose = function(){
    //   console.log("actionWebSocket关闭")
    // }
  },
  // [types.SET_PLAY_WEBSOCKET] (state, playWebSocket) {
  //   state.playWebSocket = playWebSocket
  // }
  sendWebScoket(state,msg){
     console.log("发送msg---"+msg)
      state.actionWebSocket.send(msg)
    
  }
}

export default mutations
