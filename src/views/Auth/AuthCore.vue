<script>
    import myUtils from "../../common/js/my-utils";
    import {axiosBASIC} from "../../common/js/request.js";
    import {axiosJWT} from "../../common/js/request.js";
    import sysConst from "../../api/global";
    import router from '../../router/router'

    export default {
        beforeRouteEnter: (to, from, next) => {
            next(vm => {
                if (from.path != "/auth") {
                    sessionStorage.setItem("authBackUrl", from.path)
                }
                let code = myUtils.getUrlArg("code");
                if (code != null) {
                    let authBackUrl = sessionStorage.getItem("authBackUrl")
                    console.log("Auth处理完跳转的Url:" + authBackUrl)
                    //携带code请求后台签发token+openid
                    axiosBASIC({
                        url: "/auth/issueToken",
                        method: "get",
                        params: {
                            code: code
                        }
                    }).then(response => {
                        let res = response.data
                        if (res.code == 200) {
                            let WxUser = res.data
                            console.log("code认证成功！重新设值at+rt")
                            axiosJWT.setToken(WxUser.accessToken)
                            localStorage.setItem("refreshToken", WxUser.refreshToken)
                            router.push(authBackUrl);
                        }
                        if (res.code == 701) {
                            alert(res.msg);
                        }
                        //未绑定设备
                        if (res.code == 805) {
                            router.push('/Open')
                        }
                    });
                } else {
                    //请求腾讯OAuth服务器
                    window.location.href = sysConst.OAUTH2
                }
            })
        }
    }
</script>