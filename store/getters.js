export const musicList = state => state.musicList

export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const disc = state => state.disc

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList

export const initPlayer = state=> state.initPlayer

export const deviceList = state=> state.deviceList

export const playDetail = state=> state.playDetail

export const curSearchKeywords = (state)=>{
  return state.curSearchKeywords
}

export const curCategoryId = (state)=>{
  return state.curCategoryId
}

export const curCategoryTitle = (state)=>{
  return state.curCategoryTitle
}

export const userClientHeight = (state)=>{
  return state.userClientHeight
}

export const curTecBooksLabel = (state)=>{
  return state.curTecBooksLabel
}

export const curSearchInfoLabel = (state)=>{
  return state.curSearchInfoLabel
}

export const curResourceLabel = (state)=>{
  return state.curResourceLabel
}

export const currentSong = (state) => {
  
  return state.playlist[state.currentIndex] || {}
}
// 当前播放歌曲id
export const currentSongId = (state) => {
  return state.playlist[state.currentIndex].id || {}
}
