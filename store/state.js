import {playMode} from '@/common/js/config'

const state = {
  musicList: {},
  singer: {},
  // 播放
  playing: false,
  // 全屏
  fullScreen: false,
  playlist: [],
  // 顺序列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放索引
  currentIndex: -1,
  disc: {},
  topList: {},
  // searchHistory: loadSearch(),
  playHistory: [],
  favoriteList: [],
  actionWebSocket: null,
  // playWebSocket: null,
  initPlayer: false,
  // 设备列表
  deviceList: [],
  //当前用户搜索的内容
  curSearchKeywords:'',
  //分类
  curCategoryId:1,
  curCategoryTitle:'',
  //当前手机屏幕可见区域的高
  userClientHeight:'',
  currentSongId: '',
   //当前播放的详情
  playDetail: [],
  //当前手机屏幕可见区域的高
  curTecBooksLabel: '单元/模块',
  curSearchInfoLabel: '曲目',
  curResourceLabel:'首页',
  
}

export default state
