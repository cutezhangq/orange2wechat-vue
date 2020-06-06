// 我们如果在一个动作中多次去改变 mutation 那么往往会封装一个 action
import * as types from './mutation-types'
import {playMode} from '@/common/js/config'
// 形成随机播放列表
import {shuffle} from '@/common/js/utl'
import {actionPath} from '@/common/js/WebSocket'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  //debugger
  commit(types.SET_SEQUENCE_LIST, list)

  if(state.currentIndex==-1){
    console.log("state.currentIndex==-1")
    if(state.currentIndex===index){
      commit(types.SET_PLAYING_STATE,!state.playing)
    }else{
      commit(types.SET_PLAYING_STATE,true)
    }
  }else{
    console.log("state.currentIndex!=-1")
    if(state.playlist[state.currentIndex].id===list[index].id){
      commit(types.SET_PLAYING_STATE,!state.playing)
    }else{
      commit(types.SET_PLAYING_STATE,true)
    }
  }
  // 如果播放模式为随机
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } 
  //否则按照列表播放
  else {
    commit(types.SET_PLAYLIST, list)
  }
  // console.log("state.playing---1",state.playing)
  // //console.log(state.playlist[state.currentIndex].id,list[index].id)
 
  // console.log("state.playing---2",state.playing)
  // 如果 vuex里的currentIndex与 传入的index相等，则说明用户点击的是同一首歌曲，那么就切换播放状态
  // 反之 说明用户点击的是下一首歌曲，就设为正在播放状态
  // if(state.currentIndex===index){
  //   commit(types.SET_PLAYING_STATE,!state.playing)
  // }else{
  //   commit(types.SET_PLAYING_STATE,true)
  // }

  //当前选择播放的下标
  commit(types.SET_CURRENT_INDEX, index)
  // initPlayer 用于刚进入页面不显示播放器，点击任意一首播放后显示
  if (state.initPlayer === true) {
      commit(types.SET_FULL_SCREEN, false)
  } else {
      commit(types.SET_FULL_SCREEN, true)
  }
  commit(types.SET_INIT_PLAYER,true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
   commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const sequencePlay = function ({commit}, list) {
  commit(types.SET_PLAY_MODE, playMode.sequence)
  commit(types.SET_SEQUENCE_LIST, list.list)
  commit(types.SET_PLAYLIST, list.list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_INIT_PLAYER,true)
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有带插入的歌曲，并返回银锁
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入歌曲
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列列表中的序号
    if (currentIndex > fpIndex) {
      // 删掉
      playlist.splice(fpIndex, 1)
      // 因为删除后数组前移，所以 Index--
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fpIndex, 1)
    } else {
      sequenceList.splice(fpIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  // 如果歌曲删除完毕，那么 播放停止
  commit(types.SET_PLAYING_STATE, playingState)
}

// 删除播放列表
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
// 保存播放历史
export const savePlayHistory = function ({commit,state}, song) {
  let playHistory = state.playHistory.slice().concat(song)
  commit(types.SET_PLAY_HISTORY, playHistory)
}

// 保存喜欢的歌曲
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST,song)
}

// 删除喜欢的歌曲
export const deleteFavoriteList = function ({commit,state}, song) {
  let playlist = state.favoriteList.slice()
  let index = findIndex(state.favoriteList,song)
  playlist.splice(index,1)
  commit(types.SET_FAVORITE_LIST, playlist)
}

// 创建websocket
export const createWebSocket = function({commit}){
  if("WebSocket" in window){
    commit(types.SET_ACTION_WEBSOCKET,new WebSocket(actionPath))
  }
}

// 发送消息
export const sendMsgToWebSocket = function({commit},{msg}){
  commit('sendWebScoket',msg)
}

// 设置设备列表
export const setDeviceList = function({commit},deviceList){
  commit(types.SET_DEVICE_LIST,deviceList)
}
//用户搜索关键字
export const curSearchKeywords = function ({commit},curSearchKeywords) {
  commit(types.SET_CURSEARCH_KEYWORDS, curSearchKeywords)
}

//分类-- 专辑Id
export const curCategoryId = function({commit},curCategoryId){
  commit(types.SET_CURSELECT_CATEGORYID ,curCategoryId)
}

//分类--专辑标题
export const curCategoryTitle = function({commit},curCategoryTitle){
  commit(types.SET_CURSELECT_CATEGORYTITLE ,curCategoryTitle)
}

//当前手机屏幕可见区域的高
export const userClientHeight = function({commit},userClientHeight){
  commit(types.SET_USER_CLIENTHEIGHT,userClientHeight)
}

//Resource当前点击的tab
export const curResourceLabel = function({commit},curResourceLabel){
  commit(types.SET_CURRENT_RESOURCELABEL,curResourceLabel)
}

//教材库当前点击的tab
export const curTecBooksLabel = function({commit},curTecBooksLabel){
  commit(types.SET_CURRENT_TECBOOKSLABEL,curTecBooksLabel)
}

//搜索详情当前点击的tab（曲目/专辑的tab）
export const curSearchInfoLabel = function({commit},curSearchInfoLabel){
  commit(types.SET_CURRENT_SEARCHINFOLABEL,curSearchInfoLabel)
}

export const setPlayDetail = function({commit},playDetail){
  commit(types.SET_PLAY_DETAIL,playDetail)
}