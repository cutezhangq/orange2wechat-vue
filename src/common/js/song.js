import { axiosJWT } from '@/common/js/request';

export default class Song {
  constructor({ id, title, coverUrl, sourceUrl, seq, isfavorite }) {
    this.id = id
    this.title = title
    this.coverUrl = coverUrl
    this.sourceUrl = sourceUrl
    this.seq = seq
    this.isfavorite = isfavorite
  }
}

export function createSong() {
  return new Song({
    id: 0,
    title: '听橙',
    coverUrl: require('@/common/image/defaultPage_album.png'),
    sourceUrl: '',
    seq: 0,
    isfavorite: false
  })
}
export var playDetail=''

export function getPlayDetail(currentItem) {
  
  switch (currentItem.type) {
    case 1:
      
      return axiosJWT({
        url: "/track/detail",
        method: "get",
        params: {
          trackId: currentItem.id
        }
      })
        .then(res => {
          // playDetail = res.data;
          return res.data
        })
        .catch({});
        // return playDetail
    case 2:
       return axiosJWT({
        url: "/lesson/detail",
        method: "get",
        params: {
          lessonId: currentItem.id,
        }
      })
        .then(res => {
          return res.data
        })
        .catch({});
    case 3:
       return axiosJWT({
        url: "/word/detail",
        method: "get",
        params: {
          wordId: currentItem.id,
        }
      })
        .then(res => {
          return res.data
        })
        .catch({});
      default:
        playDetail= currentItem
        return playDetail
  }
}

export function changeFavoriteStatus(playDetail,status,deviceId){
  // 如果是专辑 type =  0  歌曲为 1  课文为 2  单词为 3
  let type = 0;
  if(playDetail.type!=undefined){
    type = playDetail.type
  }
 switch(status){
    case "delete":
        return axiosJWT({
          url:'/favorite',
          method: 'DELETE',
          params:{
            type: type,
            resourceId: playDetail.id
          }
        }).then(res=>{

        }).catch(res=>{

        })
    case "add":
        return axiosJWT({
          url:'/favorite',
          method: 'POST',
          params:{
            type: type,
            resourceId: playDetail.id
          }
        }).then(res=>{
          
        }).catch(res=>{

        })
   }

}