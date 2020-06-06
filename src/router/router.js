import Vue from 'vue'
import Router from 'vue-router'
//我的收藏
const FavoriteIndex = () => import('@/views/Favorite/FavoriteIndex')
const FavoriteTrack = () => import('@/views/Favorite/FavoriteTrack')
const FavoriteAlbum = () => import('@/views/Favorite/FavoriteAlbum')

//Resource/主页
const Resource = () => import('@/views/Resource/Resource')
const ClassifyDetails = () => import('@/views/Resource/Classify/ClassifyDetails/ClassifyDetails')
const ContentListDetail = () => import('@/views/Resource/TeachingBooks/ContentListDetail/ContentListDetail.vue')
const SearchInfo = () => import('@/views/Resource/Search/SearchInfo/SearchInfo')
const MoreAlbums = () => import('@/views/Resource/Home/MoreAlbums/MoreAlbums')
const TecBooksLead = () => import('@/views/Resource/TeachingBooks/TecBooksLead/TecBooksLead')

//个人中心
const Profile = () => import('@/views/User/Profile')
const Setting = () => import('@/views/User/Setting')

//专辑详情
const AlbumDetail = () => import('@/components/AlbumDetail/AlbumDetail')

// 关于
const About = () => import('@/views/About/About')
const AboutDetail = () => import('@/views/About/AboutDetail')

//Operation绑定设备
const Open = () => import('@/views/Operation/Open')
const WifiConfig = () => import('@/views/Operation/WifiConfig')
const Wifi = () => import('@/views/Operation/Wifi')

// 登录验证部分
const AuthCore = () => import('@/views/Auth/AuthCore.vue')
const Login = () => import('@/views/Login/Login.vue')

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
    mode:'history', //去掉url中的 /#
    //base: process.env.BASE_URL,
    routes: [
        {
            path: '/auth',
            name: 'auth',
            component: AuthCore
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        //我的收藏
        {
            path: '/favoriteIndex',
            name: 'favoriteIndex',
            component: FavoriteIndex,
            meta: {
                index: 1
            }
        },
        {
            path: '/favoriteTrack',
            name: 'favoriteTrack',
            component: FavoriteTrack,
            meta: {
                index: 2
            }
        },
        {
            path: '/favoriteAlbum',
            name: 'favoriteAlbum',
            component: FavoriteAlbum,
            meta: {
                index: 2
            }
        },
        //Resource主页
        {
            path: '/',
            name: 'resource',
            component: Resource,
            meta: {
                requireAuth: true,
                index: 0
            },
        },
        {
            path: '/searchInfo',
            name: 'searchInfo',
            component: SearchInfo,
            meta: {
                showHome: false,
                showHeadGuide: false,
                index: 1
            }
        },
        {
            path: '/moreAlbums',
            name: 'moreAlbums',
            component: MoreAlbums,
            meta: {
                index: 1
            }
        },
        {
            path: '/classifyDetails',
            component: ClassifyDetails,
            name: 'classifyDetails',
            meta: {
                index: 1
            }
        },
        //引导页
        {   
            path: '/tecBooksLead',
            name: 'tecBooksLead',
            component: TecBooksLead,
            meta: {
                setTeacingBooks: true,  //进入设置教材页面
                index: 2
            }
        },
        //课文/单词 页面
        {
            
            path: '/contentListDetail',
            name: 'contentListDetail',
            component: ContentListDetail,
            meta: {
                index: 2
            }
        },
        //个人中心
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: {
                index: 1
            }
        },
        {
            path: '/setting',
            name: 'setting',
            component: Setting,
            meta: {
                index: 2
            }
        },
        //专辑详情
        {
            path: '/albumDetail',
            name: 'albumDetail',
            component: AlbumDetail,
            meta: {
                index: 4
            }
        },
        //连接设备wifi
        {
            path: '/open',
            name: 'open',
            component: Open,
            meta: {
                index: 0
            }
        },
        {
            path: '/wifiConfig',
            name: 'wifiConfig',
            component: WifiConfig,
            meta: {
                index: 1
            }
        },
        {
            path: '/wifi',
            name: 'wifi',
            component: Wifi,
            meta: {
                index: 2
            }
        },
        //关于我们
        {
            path: '/about',
            name: 'about',
            component: About,
            meta: {
                index: 0
            }
        },
        {
            path: '/aboutDetail',
            name: 'aboutDetail',
            component: AboutDetail,
            meta: {
                index: 1
            }
        },
    ],
})
