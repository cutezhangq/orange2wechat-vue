// const API = 'http://orange2test.nat300.top/api/wechat'
const API = 'http://localhost:8086'

//const API = 'http://192.168.1.100:8085'
const APPID = "wx1457af1d6afd9b17"
const OAUTH2 = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1457af1d6afd9b17&redirect_uri=http://orange2test.nat300.top/wechat/auth&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
const BASIC_TOKEN = "b3JhbmdlMjpvcmFuZ2UyLXNlY3JldA=="

//小播放器的height
const MINIPLAY_HEIGHT = 60
//教材Id
const DEVICEID = 'gh_8f487a612fc9_0574de86820650d7'
//专辑部分每次上拉加载的个数
const GET_ALBUM_NUM = 20
//曲目部分每次上拉加载的个数
const GET_TRACK_NUM = 15

export default{
  API,
  APPID,
  OAUTH2,
  BASIC_TOKEN,
  DEVICEID,
  MINIPLAY_HEIGHT,
  GET_ALBUM_NUM,
  GET_TRACK_NUM
}