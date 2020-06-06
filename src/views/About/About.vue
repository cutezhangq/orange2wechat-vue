<template>
    <div class="about-list" ref="about">
        <div class="header">
            <i class="iconfont tc-back01" @click="back"></i>
            <h1 class="title">关于</h1>
        </div>
        <div class="iconImg">
            <img class="imgSty" src="@/common/image/2.jpg" width="100" height="100"/>
            <h1 class="tip">【听橙】为12岁以下儿童提供丰富的科学的英语听说辅助训练。</h1>
        </div>
        <div class="about-info">
            <cube-button class="heightConfigCube" @click="skipDescription('版权说明')">
                <span class="item">版权说明</span>
                <span>1.0</span>
            </cube-button>
            <cube-button class="heightConfigCube" @click="skipDescription('联系我们')">
                <span class="item">联系我们</span>
                <i class="iconfont tc-iconfont-left"></i>
            </cube-button>
            <cube-button class="heightConfigCube" @click="skipDescription('隐私条款')">
                <span class="item">隐私条款</span>
                <i class="iconfont tc-iconfont-left"></i>
            </cube-button>
        </div>
        <div class="bottom">
            <!-- 南京橙子信息科技有限公司以【为用户服务】为自己的使命，努力利用技术的进步来帮助用户解决孩子学习上面临的切实问题和困难，协助家长按照科学训练法训练孩子语感和听说能力，提高效果，节约费用。 -->
            南京橙子信息科技有限公司以【为用户服务】为自己的使命，努力利用技术的进步来帮助用户解决孩子学习上面临的切实问题和困难，协助家长按照科学训练法训练孩子语感和听说能力，提高效果，节约费用。
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                clientHeigth: ""
            };
        },
        mounted() {
            this.getScreenHeight();
            let _this = this;
            window.onresize = () => {
                _this.getScreenHeight();
            };
        },
        methods: {
            back() {
                this.$router.back();
            },
            getScreenHeight() {
                this.clientHeigth =
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight;
                this.$refs.about.style.height = `${this.clientHeigth}px`;
            },
            skipDescription(tip) {
                this.$router.push({
                    name: "AboutDetail",
                    params: {
                        tip: tip
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .about-list {
        background: #f5f5f5;

        .header {
            display: flex;
            width: 100%;
            height: 50px;
            line-height: 50px;
            color: gray;
            font-size: 20px;
            background: white;

            .tc-back01 {
                width: 50px;
                height: 50px;
                text-align: center;
                flex: 0 0 50px;
                font-size: 20px;
            }

            .title {
                width: 75%;
                text-align: center;
            }
        }

        .iconImg {
            width: 100%;
            height: 30%;

            .imgSty {
                height: 40%;
                border-radius: 10px;
                margin: 10% 37.5% 5% 37.5%;
            }

            .tip {
                width: 100%;
                height: 40px;
                text-align: center;
                color: gray;
                font-size: 14px;
            }
        }

        .about-info {
            width: 90%;
            margin: 0 5%;
            border-radius: 10px;

            .heightConfigCube {
                display: flex;
                background: white;
                color: rgb(77, 75, 75);
                font-size: 16px;
                border-bottom: 1px solid rgba(212, 204, 204, 0.5);

                .item {
                    display: flex;
                    flex: 1;
                }

                .item .tc-iconfont-left {
                    color: gray;
                }
            }
        }

        .bottom {
            width: 95%;
            margin: 0 2.5%;
            position: absolute;
            left: 0;
            bottom: 10px;
            font-size: 12px;
            line-height: 15px;
            color: gray;
        }
    }
</style>