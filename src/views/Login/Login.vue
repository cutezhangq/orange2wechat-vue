<template>
<div></div>
</template>

<script>
    import {axiosJWT} from "../../common/js/request.js";
    import router from '../../router/router'
    export default {
        name: 'login',
        beforeRouteEnter: (to, from, next) => {
            next(vm => {
                console.log("login处理完跳转的Url:" + backUrl)
                if (from.path !== "/auth") {
                    sessionStorage.setItem("loginBackUrl", from.path)
                }
                let backUrl = sessionStorage.getItem("loginBackUrl")
                console.log("login处理完跳转的Url:" + backUrl)
                axiosJWT({
                    url: "/user/login",
                    method: "post"
                }).then(res => {
                    if (res.code === 200) {
                        sessionStorage.setItem("isLogin", Date.now())
                        router.push(backUrl)
                    }
                })
            })
        }
    }
</script>