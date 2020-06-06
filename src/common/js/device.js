export function findDeviceIdIndex(list, devideId) {
    return list.findIndex(item => {
        return (item.id == devideId);
    });
  }
export function setOtherDevice(list, index) {

    let j = 0
    let otherDeviceList = []
    for (let i = 0; i < list.length; i++) {
      if (i != index) {
        otherDeviceList[j] = list[i];
        j++;
      }
    }
    return otherDeviceList
  }

export function  _getOtherDeviceMessage(deviceList,deviceId){
  let currentIndex = findDeviceIdIndex(deviceList,deviceId)
  return setOtherDevice(deviceList,currentIndex)
}

export function findOptListIndex(optionList,optList){
  return optionList.findIndex(item => {
    return (item.title == optList.title);
});
}

export function setSelect(optionList,currentIndex){
  for(let i=0;i<optionList.length;i++){
    if(i!=currentIndex){
      optionList[i].show = false
    }
  }
}

export function subSpring(deviceId) {
  let head = deviceId.substring(0, 2);
  let tail = deviceId.substring(deviceId.length - 4);
  return head + "*****" + tail;
}

export var deviceRole = [
  {
  "text": "男",
  "value": 1,
  "show":false,
  "isInit":false
},
{
  "text": "女",
  "value": 0,
  "show":false,
  "isInit":false
}
]

export var ttsRole = [
  {
    "text":"girl",
    "value": 1,
    "show":false,
    "isInit":false
  },
  {
    "text":"wonman",
    "value": 2,
    "show":false,
    "isInit":false
  }
]

export var deviceVoiceSpeed = [
  {
    "text":"慢",
    "value": 1,
    "show":false,
    "isInit":false
  },
  {
    "text":"稍慢",
    "value": 2,
    "show":false,
    "isInit":false
  },
  {
    "text":"中",
    "value": 4,
    "show":false,
    "isInit":false
  },
  {
    "text":"快",
    "value": 6,
    "show":false,
    "isInit":false
  },
]

export var playMethod = [
  {
    "text":"顺序播放",
    "value": 0,
    "show":false,
    "isInit":false
  },
  {
    "text":"循环播放",
    "value": 1,
    "show":false,
    "isInit":false
  },
]

// export var deviceRole = [
//   {
//   "text": "男",
//   "value": 1
// },
// {
//   "text": "女",
//   "value": 0
// }
// ]

// export var ttsRole = [
//   {
//     "text":"girl",
//     "value": 1
//   },
//   {
//     "text":"wonman",
//     "value": 2
//   }
// ]

// export var deviceVoiceSpeed = [
//   {
//     "text":"慢",
//     "value": 1
//   },
//   {
//     "text":"稍慢",
//     "value": 2
//   },
//   {
//     "text":"中",
//     "value": 4,
//   },
//   {
//     "text":"快",
//     "value": 6
//   },
// ]

// export var playMethod = [
//   {
//     "text":"order顺序",
//     "value": 0
//   },
//   {
//     "text":"loop循环",
//     "value": 1
//   },
// ]
// export var deviceRole = [
//   {
//   "title": "男",
//   "status": 1,
//   "show": false
// },
// {
//   "title": "女",
//   "status": 0,
//   "show": true
// }
// ]

// export var ttsRole = [
//   {
//     "title":"girl",
//     "status": 1,
//     "show": false
//   },
//   {
//     "title":"wonman",
//     "status": 2,
//     "show": false
//   }
// ]


// export var deviceVoiceSpeed = [
//   {
//     "title":"慢",
//     "status": 1,
//     "show": true
//   },
//   {
//     "title":"稍慢",
//     "status": 2,
//     "show": false
//   },
//   {
//     "title":"中",
//     "status": 4,
//     "show":false
//   },
//   {
//     "title":"快",
//     "status": 6,
//     "show": false
//   },
// ]

// export var playMethod = [
//   {
//     "title":"order顺序",
//     "status": 0,
//     "show": false
//   },
//   {
//     "title":"loop循环",
//     "status": 0,
//     "show": false
//   },
// ]
