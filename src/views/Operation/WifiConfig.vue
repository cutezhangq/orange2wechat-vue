<template>
    <div>
        <div class="container page_title">
            <div class="wifi_top">
                <div class="bd spacing">
                    <img class="config1" :src="config1">
                    <p class="blockTitle">
                        <span class="title">第二步：开启网络配置</span>
                    </p>
                </div>
                <div class="weui_cells_title">长按音量+键3秒
                    <br/>
                    <br/>
                    进入网络配置模式
                </div>
            </div>
            <div>
                <cube-checkbox-group class="but_devOpen" v-model="buttonStyle" :horizontal="true">
                    <cube-checkbox v-model="checked" :option="option" ref="butCheckbox" label="primary">
                        <p>听到语音提示“进入配置上网模式...”</p>
                    </cube-checkbox>
                </cube-checkbox-group>
                <cube-button-group class="but_next">
                    <cube-button :outline="false" :primary="primaryStyle" width="100%" class="next_button"
                                 @click="clickNext">下一步
                    </cube-button>
                </cube-button-group>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CubeButtonGroup from '@/components/CubeUi/cube-button-group.vue'

    export default {
        data() {
            return {
                config1: require('@/common/image/config2.png'),
                buttonStyle: ['primary'],
                checked: false,
                option: {
                    value: 'true',
                    disabled: false
                }
            }
        },
        computed: {
            primaryStyle() {
                return this.buttonStyle.indexOf('primary') >= 0
            }
        },
        methods: {
            clickNext() {
                // console.log('是否选中：',this.checked)
                if (this.checked === 'true') {
                    this.$router.push({name: 'wifi'})
                }
                if (this.checked === false) {
                    // console.log('出现提示弹框')
                    this.$createDialog({
                        type: 'alert',
                        title: '提示',
                        content: '请确认条件后点击下一步',
                        confirmBtn: {
                            text: '确定',
                            active: true,
                        }
                    }).show()
                }
            }
        },
        components: {
            CubeButtonGroup,
        }
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
        margin: 1% 1% 10% 1%;
        font-weight: bold;
        font-size: 20px;
        color: black;
    }

    .container {
        overflow: hidden
    }

    .config1 {
        width: 100%;
        margin-top: -15%;
    }

    .page_title {
        text-align: center;
        font-size: 34px;
        font-weight: 400;
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
        margin: 13% 0;
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
        width: 46%;
        margin: 0 auto;
    }
</style>

