<template>
    <div>
        <div class="container page_title">
            <div class="wifi_top">
                <div class="bd spacing">
                    <!-- <div class="markColor tipsTop">提醒:微信6.6.7版本存在兼容性问题，如在配置上网时无法绑定，请参考下面短视频进行绑定操作。</div>
          <video :src="video_1"  width="320" height="160" controls="controls"></video> -->
                    <p class="blockTitle">
                        <span class="title">第三步：识别二维码</span>
                    </p>
                </div>
                <div class="weui_cells_title">长按识别二维码，并选择<span class="markColor">"配置设备上网"</span>
                </div>
            </div>

            <div>
                <div class="weui_cells weui_cells_form">
                    <img :src="imagesWei" class="imagesWei"/>
                </div>
                <div class="weui_cells_title">提示：扫描说明书【配置设备上网】页的二维码可跳过此步骤</div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                imagesWei: require('@/common/image/wei.jpg'),
                //video_1:require(''),
            }
        },
    }
</script>

<style lang='less' scoped>
    @import url('~@/assets/css/common.less');

    body, html {
        height: 100%;
        //-webkit-tap-highlight-color: transparent
    }

    .page,
    body {
        background-color: #fbf9fe
    }

    .blockTitle {
        margin: 3% 1% 10% 1%;
        font-weight: bold;
        font-size: 20px;
        color: black;
    }

    .container {
        overflow: hidden
    }

    .config1 {
        width: 100%;
        margin-top: -53px;
    }

    .page_title {
        text-align: center;
        font-size: 34px;
        font-weight: 400;
        width: 100%;
    }

    // .container .wifi_top {
    // 	color: #ccc;
    // 	width: 100%;
    // 	/*margin-bottom: 15%;*/
    // }
    .weui_cells:before {
        border: none;
    }

    .weui_cells:after {
        border: none;
    }

    .weui_cells {
        background-color: initial;
    }

    .weui_cells_title {
        color: #bbb7b7;
        font-size: 15px;
    }

    .weui_cell_primary {
        font-size: 16px;
        display: inline-block;
        flex: initial;
    }

    .weui_cells_checkbox .weui_cell_hd {
        display: inline-block;
    }

    .weui_cell {
        display: inline-block;
    }

    .weui_cells_checkbox .weui_icon_checked:before {
        font-size: 16px;
    }

    .but_next {
        padding: 0 20px;
    }

    .but_devOpen {
        justify-content: center;
        align-items: center;
        margin-top: 20%;
        border: none;
        font-size: 15px;
    }

    .cube-checkbox-wrap border-bottom-1px {
        justify-content: center !important;
    }

    .weui_cell:active {
        background-color: initial;
    }

    .border-top-1px::before {
        border: 1PX solid #fff !important;
        left: 0;
        top: 0;
        width: 100%;
        transform-origin: 0 top;
    }

    .border-bottom-1px::after {
        border-bottom: 1PX solid #fff !important;
        left: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        transform-origin: 0 bottom;
    }

    .cube-checkbox-group[data-horz="true"]::after, .cube-checkbox-group[data-col="true"]::after {
        border: 1PX solid #fff;
    }

    .cube-checkbox_checked .cube-checkbox-ui i {
        color: @gradualcolor;
        transform: scale(1.23);
    }

    .cube-btn-primary {
        color: #fff;
        background: @gradualcolor;
    }

    .weui_cells_title {
        font-size: 15px;
        width: 90%;
        margin: 0 auto;
    }


    .page_title {
        position: absolute;
        // left: 50%;
        // top: 48%;
        // transform: translate3d(-50%,-50%,0);
        top: 20%;
    }

    .imagesWei {
        height: 250px;
        margin: 15px 0;
    }

    .markColor {
        color: #71e435;
        font-weight: 540;;
    }

    .spacing {
        font-size: 15px !important;
        width: 90% !important;
        margin: 20px auto !important;
    }

    .tipsTop {
        margin-bottom: 20px;
    }
</style>
