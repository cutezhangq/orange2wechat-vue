// let actionWebSocket = null;
// let playWebSocket = null;

//const actionPath = "ws://106.12.20.45:9999/ws"
//const actionPath = "ws://192.168.1.106:8085/searchRecord"
// const actionPath = "ws://192.168.1.102:8085/searchRecord"
// const actionPath = "ws://orange2test.nat300.top/api/wechat/searchRecord"
// const actionPath = "ws://192.168.1.105:8085/playRecord"

const accessToken = localStorage.getItem('accessToken')
//const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJvcGVuSWQiOiJvVjc2Qnd1dkNYTzh5dXJPNmpsWUJHc0N5a2dBIiwiaXNzIjoib3JhbmdlMiIsImRldmljZUlkIjoiZ2hfOGY0ODdhNjEyZmM5XzAwMmI5MGRhNWExOGYxNTIiLCJpYXQiOjE1NzU4OTU3MjF9.BuKKq14DtTDpjgOP11HiV_lnnA0sPj-9YXzS27g_fjM'
const actionPath = "ws://192.168.1.100:8085/playRecord?token="+accessToken
//console.log('輸出的actionPath===',actionPath)
const playPath = "ws://192.168.1.106:9999/ws"
export {
  actionPath
}
// if("WebSocket" in window){
//     actionWebSocket = new WebSocket(actionPath)
//     playWebSocket = new WebSocket(playPath)
//     actionWebSocket.onpen = function(msg){
//         actionWebSocket.send(msg)
//         console.log("已发送"+msg)
//     }
//     actionWebSocket.onmessage  = function (evt) {
//         var received_msg = evt.data;
//         console.log("信息已接收"+received_msg)
//     }
// }

// export {
//   actionWebSocket,
//   playWebSocket
// }

