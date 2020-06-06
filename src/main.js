import Vue from 'vue'
import './cube-ui'
import router from './router/router'
import App from './App.vue'
import store from '../store'
import axios from 'axios'
//import domurl from 'domurl'
import myUtils from "./common/js/my-utils";
import sysConst from "./api/global";
import VueAxios from 'vue-axios'
import animate from 'animate.css'
//图片懒加载
import VueLazyload from 'vue-lazyload'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$sysConst = sysConst
Vue.prototype.$myUtils = myUtils
//Vue.prototype.$domurl = domurl
//登录路由拦截
router.beforeEach((to, from, next) => {
    if (sessionStorage.getItem('isLogin') == null &&
        to.path !== "/login" &&
        to.path !== "/auth" &&
        to.path !== "/open" &&
        to.path !== "/wifi" &&
        to.path !== "/wifiConfig") {
        next('/login')
    } else {
        next()
    }
})
Vue.config.devtools = true

import VConsole from 'vconsole'
//import def_lazy_img from '../src/common/image/load.gif'
//请求还未响应时的动画页面
import Loading from '../src/components/Loading/Loading'//全局注册插件
Vue.component('Loading',Loading)

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(animate)
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/common/image/defaultPage_album.png'),
    attempt: 1,
    // loading: def_lazy_img
})
const vConsole = new VConsole();

new Vue({
    vConsole,
    router,
    store,
    data: {
        eventHub: new Vue()//使用集中的事件处理器，在resource模块下调用事件发射，接收的方法
    },
    render: h => h(App)
}).$mount('#app')



